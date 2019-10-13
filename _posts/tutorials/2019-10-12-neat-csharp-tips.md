---
title: A List Of Cool But Mostly Inconsequential C# Tips For Unity
date: "2019-10-12"
author: Keenan Woodall
permalink: "/tutorials/inconsequential-csharp-tips-for-unity"
excerpt: ""
---

Over the last few years goofing around with C# I've discovered up a handful of features and tips. I see some of these used more than others, but there's a good chance you'll see something new. 

**Disclaimer:** None these tips are objectively the best way to do stuff. I just like them personally.

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
The `EditorGUI` and `EditorGUILayout` classes have many pairs of methods for controlling layouts and groups. The most common pairs are probably `Begin/EndVertical()` and `Begin/EndHorizontal()`. Unfortunately they get hard to read as you nest them, and it's possible to forget to "end" them which results in an error.

Scopes come to the rescue! Every thing you want to do with the aforementioned methods can be done with scopes - with the added bonus of them being nicely indented and impossible to fail to close.

Here's a two examples of converting Begin/End methods to scopes:

---
#### Horizontal Layout
*Methods*
```cs
EditorGUILayout.BeginHorizontal();
// Draw stuff in horizontal layout.
EditorGUILayout.EndHorizontal();
```
*Scope*
```cs
using (new EditorGUILayout.HorizontalScope())
{
	// Draw stuff in horizontal layout.
}
```
---
#### Change Check
*Methods*
```cs
EditorGUI.BeginChangeCheck();
someFloat = EditorGUILayout.FloatField(someFloat, 0f, 1f);
if (EditorGUI.EndChangeCheck())
{
	// Handle change.
}
```
*Scopes*
```cs
using (var check = new EditorGUI.ChangeCheckScope())
{
	someFloat = EditorGUILayout.FloatField(someFloat, 0f, 1f);
	if (check.changed)
	{
		// Handle change.
	}
}
```
---

<br>
There's way more of them, but you get the idea. It might not look like a big deal at first, but I think using scopes greatly improves readability. If you're curious what the difference in readability is on more complicated GUI check out this [gist](https://gist.github.com/keenanwoodall/a94fb298f7ccfa7e8c73eb9e6691e57b).

## 3. Less typing via the 'using static' directive
By adding `using static SomeFullyQualifiedTypeName;` alongside your other namespaces you can access the static functions/properties within the type without having to type its name.

My favorite place to use this is with the `Unity.Mathematics` library. Here's some normal mathematics code.
```cs
float3 lightPosition = math.transform(lightToWorld, float3(0));
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
You no longer need to prepend all the math functions with `math.` I think it looks super cool. The only downside in this specific example is that you cannot access the static methods within the math structs (like `quaternion`, `float4x4` etc). The math class has functions called `quaternion` and `float4x4` so the compiler thinks you are calling the functions instead of accessing the struct of the same name. 

I ran into this problem when trying to call `quaternion.LookRotation(...)` and the compiler thought I was trying to call the `quaternion()` method. You can get around this by adding `using quaternion = Unity.Mathematics.quaternion;` but at that point you're starting to do a lot of work for a small cosmetic improvement to your code.