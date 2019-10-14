---
title: A List Of Underused Parts Of Unity's API & Neat But Mostly Inconsequential C# Features
date: "2019-10-12"
author: Keenan Woodall
permalink: "/tutorials/neat-csharp-and-unity-tips"
excerpt: ""
---

Here's a handful of C# features and parts of the Unity API I've found over the years. I rarely see some of these used, so there's a good chance you'll see something new. 

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
Sometimes you're using two namespaces that both have a member of the same name. Differentiating between the two members can be frustrating. For example, when `using System;` and `using UnityEngine;` if you try to get a `Random.value` you'll get an error because the System namespace also has a `Random` class and the compiler doesn't know which one to use.
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
using Random = UnityEngine.Random;
```
Now you can safely using `Random.value`, `Random.Range` or whatever member you want from Unity's `Random` class. If you're ever in a situation where you need the class from both namespaces, just create a unique alias for both.
```cs
using URandom = UnityEngine.Random;
using SRandom = System.Random;
...
var randomSystemInt = new SRandom().Next(10);
var randomUnityInt = URandom.Range(0, 10);
```

## 4. 'using static'
By adding `using static SomeFullyQualifiedTypeName;` alongside your other namespaces you can access the static members within the type without having to type its name.

My favorite place to use this is with the Mathematics library. Here's some example code I pulled from an old project.
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
You no longer need to prepend all the math methods with `math.` I think it looks super cool. The only downside in this specific example is that you cannot access the static methods within the `math` data types. For example, when trying to call `quaternion.LookRotation` the compiler will think you're referencing the `quaternion()` method instead of the `quaternion` struct.

You can get around this by creating an alias: 
```cs
using quaternion = Unity.Mathematics.quaternion;
``` 
but having to create an alias for each type whose static members you want to access could get lame. However in practice this has rarely been an issue for me since most methods are in the `math` class.

## 5. String interpolation
This one is pretty commonly known, but I think it's worth mentioning. String interpolation lets you type variables directly inside a string. Just put a `$` before the string and put each variable name inside a pair braces. Behind the scenes it's the same as using `String.Format`, but it is easier to read and write.
```cs
// Note: All of these lines will result in the same string.

// string interpolation (awesome)
var msg = $"{playerA} was killed by {playerB} with a {weapon}.";

// String.Format (fine)
var msg = String.Format("{0} was killed by {1} with a {2}.", playerA, playerB, weapon);

// concatenation (lame)
var msg = playerA + " was killed by " + playerB + " with a " + weapon + ".";
```

## 6. Switching on types and the 'when' clause
In C# 7 you can finally switch on types. Using the `case Type variableName:` pattern you can handle different types and have the variable you're switching on get casted automatically.
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

If you want to have additional conditions for a case you can use the `when` clause. For example, you could have two separate cases for a `MeshCollider` depending on if it is convex.
```cs
case MeshCollider mesh when mesh.convex:
	print($"Collider is a convex mesh with the bounds {mesh.bounds}.");
	break;
case MeshCollider mesh when !mesh.convex:
	Debug.LogError("Mesh must be convex", mesh);
	break;
```

## 7. Default operator and literal
You can set something to its default value. In the following block of code `a`, `b`, `c` and `d` will all have the same values.
```cs
var a = new Vector3();
var b = default(Vector3);
Vector3 c;
// As of C# 7.1, if the type can be inferred you can use the default literal.
// However setting 'd' to default is redundant here because it will have the 
// same effect as not assigning it.
Vector3 d = default;
```
It is important to know that `default` is not the same as the default constructor. `default(Vector3)` will always assign `x`, `y` and `z` to 0, but if Unity wanted to, they could change the default Vector3 constructor to assign any values they wanted. 

Using `default` is also the only easy way to make a struct parameter optional, because you cannot assign null or a custom value.
```cs
// You cannot do this because Vector3.zero is not a compile-time constant
public void Add(Vector3 a, Vector3 b, Vector3 c = Vector3.zero)
{
	return a + b + c;
}

// You cannot do this either because a constructor cannot be guaranteed to
// assign the same values at compile-time and run-time.
public void Add(Vector3 a, Vector3 b, Vector3 c = new Vector3())
{
	return a + b + c;
}

// You CAN do this 👍
public void Add(Vector3 a, Vector3 b, Vector3 c = default)
{
	return a + b + c;
}
```
Note that you cannot override the default keyword. It just assigns the default value to every primitive in a struct and null to every reference type.

## 8. ToString float overloads
You can specify the precision of the string by passing a string with an 'n' followed by an integer indicating the number of decimal places. This is pretty handy when you don't want to print a massive string just because the tweo fl
```cs
var f = 1f / 3f; // 0.3 repeating

print(f.ToString("n1")); 	// prints 0.3
print(f.ToString("n2")); 	// prints 0.33
```