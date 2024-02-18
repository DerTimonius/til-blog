---
title: Javascript arrays are not arrays
pubDate: 2023-10-15
tags: ['javascript', 'computer-science', 'rust']
isDraft: false
description: While called arrays, array objects in Javascript are not really arrays in the typical computer science sense - let's explore
updatedAt: 2023-10-20
---

import Aside from '~/components/Aside.astro';

I recently decided to step up my knowledge in data structures and algorithms. I had some prior knowledge, but data structures is a topic where knowing more can help you tremendously at your job or any of your personal coding projects.

To achieve that, I started with the great [course by ThePrimeagen](https://frontendmasters.com/courses/algorithms/) today and in the first hour he asked a question that took me by surpise:

> Is this `const a = []` an array?

If a question is asked like that, the answer, most certainly, is no. But I was confused: I started my coding journey by first learning Python and then learning web development where I learned JS/TS. `[]` was the JS symbol for an array. And now, Primeagen is telling me that it's not.

## Array vs. Array

In low-level languages like C, C++ or Rust, an array is specified like this:

- it has a fixed size
- it uses a contiguous block of memory
- it can only use the same type of elements

Because arrays are of a fixed size, there is no possibility to add or append something to the end of the array - the array would grow and parts of the memory might already be in use. This information would then be lost and chaos is what would happen.

A typical array in Rust would be initialized like this:

```rs
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

`a` is an array of 5 signed 32bit integers. There is no possibility to change the integer to a string. If you delete something of an array, the memory is still allocated to the array - therefore it's filled with `null`.

A standard array in Javascript can hold anything at the same time - strings, numbers, other arrays, objects. It can grow and shrink without any issues:

```ts
const arr = [1, 2, true, false, { foo: 'bar' }];
```

## What is it then?

Under the hood, JS arrays are objects with ascending integer-like keys that has the possibility to `pop`, `push`, change stored data types. They also don't have to be contiguous, empty values in JS arrays are valid:

```ts
const arr = [1, 2, true, , { foo: 'bar' }];
```

<Aside header="[object Object]">
  To be honest, running checking the type of `arr` with `typeof` and seeing
  `[object Object]` return might have been the biggest clue to realize that it's
  an object.
</Aside>

All this means that the memory that is allocated to the array is not guaranteed to be contiguous, no information is then lost if the array grows. Removing items from the array does not lead to filling an entry with `null`.

Something similar also exists in Rust: it's called a [_Vector_](https://doc.rust-lang.org/book/ch08-01-vectors.html) (caveat: they can only handle one data type). You can add to the vector like in JS with `push`.

```rs
let mut v: Vec<i32> = Vec::new();
v.push(1)
v.push(2)
v.push(3)
v.push(4)
```

## Creating an actual array in JS

It's possible to create an "actual" array in Javascript which behaves as expected (if we drop the fact that it will be resizable). Not that it's usable in every day web dev, but knowing about it won't hurt.

What can be used is an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

```ts
const arr = new ArrayBuffer(8);
console.log(arr);
// ArrayBuffer {
//   [Uint8Contents]: <00 00 00 00 00 00 00 00>,
//   byteLength: 8
// }
```

An ArrayBuffer can be described as an array of bytes whose elements cannot be accessed directly. To achieve this, it's necessary to create a view into the array first:

```ts
const arr8View = new Uint8Array(arr);
arr8View[1] = 12;
console.log(arr);
// ArrayBuffer {
//   [Uint8Contents]: <00 0c 00 00 00 00 00 00>,
//   byteLength: 8
// }
```

By creating the view with a 8-bit offset, index 1 will be the second item (as one might expect).
But you could also create a view with a 16-bit offset, setting a value at the first index and nothing would collide.

```ts
const arr16View = new Uint16Array(arr);
arr16View[1] = 45;
console.log(arr);
// ArrayBuffer {
//   [Uint8Contents]: <00 0c 2d 00 00 00 00 00>,
//   byteLength: 8
// }
```

Since the offset is now 16-bit instead of 8, index 1 for that view is the third item of the array.

This behavior looks a lot more like something an array in a low-level language might do.

## How will that help me?

Understanding the differences between these types of arrays (from JS arrays to low-level language arrays) is not just an exercise in semantics - it can profoundly impact the way you design an optimize your code. If you switch to a scenario from web dev to systems programming and programming where memory management is critical for the first time, knowing this difference will spare you a lot of headache.

So, the next time you declare `const a = []` in JavaScript, remember: you're working with a versatile object that may not align with the traditional concept of an array in computer science, but that's perfectly fine. Embrace the versatility, understand the distinctions, and choose the right tool for the job — because in the world of programming, context matters.
