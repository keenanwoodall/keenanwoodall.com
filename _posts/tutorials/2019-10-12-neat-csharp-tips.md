---
title: A List Of Underused Parts of Unity's API And Cool But Mostly Inconsequential C# Features
date: "2019-10-12"
author: Keenan Woodall
permalink: "/tutorials/cool-csharp-tips-for-unity"
excerpt: ""
---

Here's a handful of C# features and parts of the Unity API I've found over the years. I never see some of these used, so there's a good chance you'll see something new. 

**Disclaimer:** The items on this list aren't life-changing or the objectively best way to do stuff. I just like them personally.

## 1. Inline 'out' variable declaration
Most of you will be familiar with having to write this snippet of code.
```cs
RaycastHit hitInfo;
if (Physics.Raycast(someRay, out hitInfo))
{ 
    // Do stuff with the hitInfo here
}
```
After typing `RaycastHit hit;` on a separate line 1000 times it starts to feel a little tedious. As of C# 7.0 you can declare `out` values inline.
```cs
if (Physics.Raycast(someRay, out var hitInfo))
{
    // Do stuff with the hitInfo here
}
```

## 2. Editor scripting with scopes
The `EditorGUI` and `EditorGUILayout` classes have many pairs of methods for controlling layouts and groups. The most common pairs are probably `Begin/EndVertical()` and `Begin/EndHorizontal()`. Unfortunately they can get hard to read if you have a lot of them, and it's possible to forget to "end" them which results in an error.

Scopes come to the rescue! Every thing you want to do with the aforementioned methods can be done with scopes - with the added bonus of them being nicely indented and impossible to fail to close.

Here's a couple examples of converting Begin/End method pairs to scopes.

#### Horizontal Layout
```cs
// ----- Method-pair version

EditorGUILayout.BeginHorizontal();
// Draw stuff in horizontal layout.
EditorGUILayout.EndHorizontal();

// ----- Scopes version

using (new EditorGUILayout.HorizontalScope())
{
	// Draw stuff in horizontal layout.
}
```
#### Change Check
```cs
// ----- Method-pair version

EditorGUI.BeginChangeCheck();
someFloat = EditorGUILayout.FloatField(someFloat, 0f, 1f);
if (EditorGUI.EndChangeCheck())
{
	// Handle change.
}

// ----- Scopes version

using (var check = new EditorGUI.ChangeCheckScope())
{
	someFloat = EditorGUILayout.FloatField(someFloat, 0f, 1f);
	if (check.changed)
	{
		// Handle change.
	}
}
```

There's way more scopes and method pairs, but you get the idea. It might not look like a big deal at first, but I think using scopes greatly improves readability. If you're curious what the difference in readability is on more complicated GUI check out this [gist](https://gist.github.com/keenanwoodall/a94fb298f7ccfa7e8c73eb9e6691e57b).

## 3. Aliases
Sometimes you're using two namespaces that both have a member of the same name. Differentiating between the two members can be frustrating. For example, when `using System;` and `using UnityEngine;` if you try to get a `Random.value` you'll get an error because the System namespace also has a `Random` class. 
```cs
using System;
using UnityEngine;

[Serializable]
class CoinFlipper
{
	public void FlipCoin()
	{
		// This will not compile because the compiler doesn't
		// know whether to use UnityEngine.Random or System.Random
		if (Random.value > 0.5f)
			Debug.Log("Heads");
		else
			Debug.Log("Tails");
	}
}
```

You could type `UnityEngine.Random.value` to differentiate but that's pretty annoying. Thankfully there's another option. You can use an alias to tell the compiler which `Random` class you want to use.
```cs
using System;
using UnityEngine;
using Random = UnityEngine.Random
```

## 4. Less typing via the 'using static' directive
By adding `using static SomeFullyQualifiedTypeName;` alongside your other namespaces you can access the static members within the type without having to type its name.

My favorite place to use this is with the Mathematics library. Here's some normal mathematics code.
```cs
float3 lightPosition = math.transform(lightToWorld, math.float3(0));
float3 lightDirection = math.normalize(lightPosition - point);
float lighting = math.saturate(math.dot(normal, lightDirection));
```
After adding this using statement:
```cs
using static Unity.Mathematics.math;
```
It can be typed like this:
```cs
float3 lightPosition = transform(lightToWorld, float3(0));
float3 lightDirection = normalize(lightPosition - point);
float lighting = saturate(dot(normal, lightDirection));
```
You no longer need to prepend all the math methods with `math.` I think it looks super cool. The only downside in this specific example is that you cannot access the static methods within the math data types. For instance, the compiler will think you're trying to call the `quaternion` method instead of the `quaternion` struct.

You can get around this by creating an alias: 
```cs
using quaternion = Unity.Mathematics.quaternion;
``` 
but having to create an alias for each type that has static members you want access to could get lame. However in practice this has rarely been an issue for me since most methods are in the `math` class.

## 5. String interpolation
String interpolation lets you type variables directly inside a string. Just put a `$` before the string and put the variable names inside the braces. Behind the scenes it's the same as using `String.Format`, but is easier to type and read.
```cs
// string interpolation (awesome)
var msg = $"{playerA} was killed by {playerB} with a {weapon}.";

// String.Format (fine)
var msg = String.Format("{0} was killed by {1} with a {2}.", playerA, playerB, weapon);

// concatenation (lame)
var msg = playerA + " was killed by " + playerB + " with a " + weapon + ".";
```

## 6. Switching on types and the 'when' clause
In C# 7 you can finally switch on types. Simply switch on the variable and put a variable name at the end of each case.
```cs
var collider = GetComponent<Collider>();
switch(collider)
{
	case SphereCollider sphere:
		print($"Collider is a sphere with a radius of {sphere.radius}.");
		break;
	case BoxCollider box:
		print($"Collider is a box with a size of {box.size}.");
		break;
	case CapsuleCollider capsule:
		print($"Collider is a capsule with a radius of {capsule.radius} and height of {capsule.height}.");
		break;
	case MeshCollider mesh:
		print($"Collider is a mesh with the bounds {mesh.bounds}.");
		break;
}
```

If you want to have additional conditions for a case you can use the `when` clause. For instance, you could have two separate cases for a `MeshCollider` depending on if it is convex.
```cs
case MeshCollider mesh when mesh.convex:
	print($"Collider is a convex mesh with the bounds {mesh.bounds}.");
	break;
case MeshCollider mesh when !mesh.convex:
	Debug.LogError("Mesh must be convex", mesh);
	break;
```

## 7. Default operator and literal
You can literally set something to its default value. All of these lines of code result in the same `Vector3`.
```cs
var a = new Vector3();
var b = default(Vector3);
Vector3 c = default;
```