---
title: Explaining some JavaScript weirdness
pubDate: 2023-12-08
tags: ['javascript', 'computer-science']
isDraft: false
description: JavaScript is used as a source for a lot of programming memes. Let's explain some of them.
---

JavaScript is made fun of a lot in the world of memes. While some things actually are unique to JS, more often than not, if you would try similar things in other languages, you probably would also get unintuitive results.

I want to look at some of the weird, unintuitive results and demystify how they happen.

## `[].every()` always returns `true`

`Array.prototype.every()` is a great function to check if every element of an array fulfills the given condition. It would seem logical that an empty array will return `false` since there is no element that could fulfill the condition.

But if we take a look at the actual code, we can find the culprit:

```js
Array.prototype.every = function (callbackfn, thisArg) {
  'use strict';
  var T, k;

  if (this == null) {
    throw new TypeError('this is null or not defined');
  }

  var O = Object(this);

  var len = O.length >>> 0;

  if (typeof callbackfn !== 'function') {
    throw new TypeError();
  }

  if (arguments.length > 1) {
    T = thisArg;
  }

  k = 0;

  while (k < len) {
    var kValue;

    if (k in O) {
      kValue = O[k];
      var testResult = callbackfn.call(T, kValue, k, O);
      if (!testResult) {
        return false;
      }
    }
    k++;
  }
  return true;
};
```

The function checks in a while loop if the current item does not honor the condition. If not, it returns `false`. This makes sense, if the first of 100 elements don't meet the condition, there is no reason to check the rest. If the while loop is finished, we know that the condition is true for every element and the function returns now `true`.

So, if there is no element in the array, the while loop is skipped and the function gets to the `return true` immediately.

A similar behavior can be found if you try to call `[].some()`. It will always return `false`. The check is pretty much the same, but with the booleans swapped. It checks for the first element that returns true and skips the rest. If none meet the condition, it returns false.

## `true + true + true === 3`

I don't understand why I see this all the time. The numeric value of `true` is 1, the value of `false` is 0. It's just binary.

This taps into the concept of `truthiness` and `falsiness`, where only a few values are considered `false`:

- `null`
- `undefined`
- `0`
- `""` (meaning empty string)
- `NaN`
- and of course `false`

## `1 + "1" === "11"` and `1 - "1" === 0`

Something that may have happened to you was to add a string to a number and then getting something completely different than what you expected.
But if you tried to subtract a string from a number, you actually get the result you expected. Why?

Well, the reason behind this behavior is simply that `+` is doing much more than just add two numbers. What the `+` operator will do is defined by the operands. If one is a string, it's going for string concatenation.

The `-` operator on the other hand only works for subtracting. The string is then coerced to a number and will be subtracted from the first operand.

## `[] == ""`, but `[] != []`

How can an empty array be the same as an empty string, but not the same as another array? Type coercion is to blame again, since I did not use `===` or strict equality here.

When comparing the empty array against a string, the array is cast as a string. So string is the same as string. But if you compare two objects with each other (and as we know, [arrays are objects in Javascript](/posts/til-6)), they are compared by reference - you can think of memory address. Since they are separate objects they are stored in different locations in the heap.

## `true != "true"`

Another case of type coercion that feels weird, but is actually pretty logical. Trying this comparison will change `true` as `1`, the number. Therefore, it will try `parseInt("true")` which will of course return `NaN` . And `1` is not `NaN`.

## Trailing commas

Let's take a look at the following:

```js
let a = [, , ,];
a.length; // -> 3
a.toString(); // -> ',,'
```

Trailing commas are great, it removes some pain when coding. But this results in the last comma being ignored in an array, hence the result above!

## Arrow functions

If we create an arrow function called foo like this, everything will work as expected:

```js
const foo = () => 'bar';
foo(); // -> "bar"
```

But if we change `"bar"` to `{}`, something unexpected happens:

```js
const foo = () => {};
foo(); // -> undefined
```

Why? The curly braces are normal arrow function syntax and since it does not return anything, the result of foo is `undefined`. To get foo to actually return the curlies, you have to wrap them in parentheses:

```js
const foo = () => ({});
foo(); // -> {}
```

## Conclusion

Yes, JavaScript can be weird sometimes. But let's be honest: we don't encounter the issues I described here in our daily work.

Most of the JavaScript weirdness are more fun challenges to figure out. Or at least for me!
