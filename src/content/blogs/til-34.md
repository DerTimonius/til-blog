---
title: Why I avoid enums in TypeScript
pubDate: 2025-06-01
isFeatured: false
tags: ['typescript']
description: When you get some superficial knowledge of enums in TS, they seem like a good idea. When you start to dig a bit deeper, oh boy...
---

Enums look like the best of both JavaScript and TypeScript: a type that can also be used as a value, what's not to love?

Well, when looking at the output, quite a lot to be honest.

I gave a short session at the latest [barcamp in Graz](https://barcamp-graz.org) where I talked about enums, so I thought it might be a good idea to write it down.

## What are enums?

But first, we have to look at the appeal of enums. From the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/enums.html):

> Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.
> Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases. TypeScript provides both numeric and string-based enums.

```ts
// numeric enum
enum RequestMethodNumeric {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}

// string enum
enum RequestMethodString {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
```

As the name suggests, numeric enums map the values to numbers, so in this example `RequestMethodNumeric.GET` would be 0, `RequestMethodNumeric.POST` would be 1 etc.

In string enums you have to define the actual value, so nothing is inferred. It's actually not necessary to name the values the same as the keys, but it's something I have seen a lot.

Another thing to mention is that it's not possible to use both numeric and string values in the same enum.

## So, what's my problem then?

The issues I have with enums are twofold: the created objects are weird and, unlike other TypeScript types, they have to be compiled to JavaScript somehow.

### The created objects

Since enums are objects, we can simply call `console.log` to see how they look.

```ts
console.log(Object.entries(RequestMethodString));

// prints the following
// [["GET", "GET"], ["POST", "POST"], ["PUT", "PUT"], ["PATCH", "PATCH"], ["DELETE", "DELETE"]]
```

Okay, this actually makes sense. Since we defined the values, it's just a key-value tuple.

But when we look at the numeric enums, things are getting weird fast.

```ts
console.log(Object.entries(RequestMethodNumeric));

// prints the following
// [["0", "GET"], ["1", "POST"], ["2", "PUT"], ["3", "PATCH"], ["4", "DELETE"], ["GET", 0], ["POST", 1], ["PUT", 2], ["PATCH", 3], ["DELETE", 4]]
```

What the? `GET` is mapped to `0` and vice versa, for all values? Why?

To answer this question, we have to look at the JavaScript that is being created for the enums.

### The compiled JavaScript

Again, let's look at the simple version of the string-based enum first.

```js
var RequestMethodString;
(function (RequestMethodString) {
  RequestMethodString['GET'] = 'GET';
  RequestMethodString['POST'] = 'POST';
  RequestMethodString['PUT'] = 'PUT';
  RequestMethodString['PATCH'] = 'PATCH';
  RequestMethodString['DELETE'] = 'DELETE';
})(RequestMethodString || (RequestMethodString = {}));
```

What is happening here? At first, the `RequestMethodString` variable is declared without an actual value.

Next, an `IIFE` (_Immediately Invoked Function Expression_) is created that populates the individual keys with the designated values. The function is invoked immediately with either the `RequestMethodString` variable or an empty object.

A bit weird if you are not used to looking at compiled JavaScript, but understandable.

This will change when we look at numeric enums.

```js
var RequestMethodNumeric;
(function (RequestMethodNumeric) {
  RequestMethodNumeric[(RequestMethodNumeric['GET'] = 0)] = 'GET';
  RequestMethodNumeric[(RequestMethodNumeric['POST'] = 1)] = 'POST';
  RequestMethodNumeric[(RequestMethodNumeric['PUT'] = 2)] = 'PUT';
  RequestMethodNumeric[(RequestMethodNumeric['PATCH'] = 3)] = 'PATCH';
  RequestMethodNumeric[(RequestMethodNumeric['DELETE'] = 4)] = 'DELETE';
})(RequestMethodNumeric || (RequestMethodNumeric = {}));
```

It looks pretty similar, with the key difference that each index is assigned the keys we defined and the keys are also assigned the individual numbers.

But at least there is an actual value.

### `const enum`

There is a third kind of enums: `const` enums. The difference between the other two and const enums is that they are not part of the compiled JavaScript.

In our example, let's say that `RequestMethodString` is a `const` enum.

```ts
const enum RequestMethodString {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

console.log(RequestMethodString.GET);
```

If we want to access any key, the compiled JavaScript has to do something different, since the object is not included in the code.

```js
console.log('GET' /* RequestMethodString.GET */);
```

If it was the numeric enum, it would be `console.log(0 /*RequestMethodNumeric.GET */)`. Not really intuitive when just looking at the JavaScript code.

### Other issues

Another problem I have is that enums don't really provide a good developer experience.

When creating a function that expects an enum as an argument, one would expect it's possible to pass the actual value.

```ts error-preview
function checkRequestMethod(method: RequestMethodString) {}

checkRequestMethod(~~"GET"~~) //! Argument of type '"GET"' is not assignable to parameter of type 'RequestMethodString'.

// the only appropriate way
checkRequestMethod(RequestMethodString.GET)
```

Since we can't pass the actual values, there's also no autocomplete.

## Alternatives

I just can't keep hating on enums without actually providing useful alternatives. These alternatives are actually pretty simple: create an object of the values you want, and use a combination of `keyof` and `typeof` to create the associated type.

```ts
const requestMethods = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH',
  Delete: 'DELETE',
} as const;

type RequestMethod = (typeof requestMethods)[keyof typeof requestMethods];
// ^? "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
```

Passing the `RequestMethod` type as a parameter to a function would then allow two ways to pass them:

```ts
function checkMethod(method: RequestMethod) {}

checkMethod(requestMethods.Get);
checkMethod('GET');
```

Both are valid and if you want to pass the string, you would also get autocomplete.

## Conclusion

I know that enums were added to TypeScript when it has less features and did not offer `keyof typeof`. But the fact that enums are compiled to JavaScript in a weird way, offer a worse developer experience, and that creating alternatives is very simple, suggests there aren't many reasons to use them.

Enums in Rust are pretty great though.
