---
title: Best practices of concurrencies in Javascript
pubDate: 2023-10-24
tags: ['javascript', 'computer-science']
isDraft: true
description: Working with concurrency and asynchronous code can be difficult. Best practices can help
relatedPosts: ['til-6']
---

import Aside from '~/components/Aside.astro';

I have written about [how Javascript achieves asynchrony before](/posts/til-6) but I did not write about a crucial part of asynchronous code: how to actually write it and what pitfalls you should steer clear from.

## Error handling

A very common pattern you will encounter when working with asynchronous code is the `try...catch` block:

```js
try {
  await doSomething();
} catch (error) {
  console.error(error);
}
```

This pattern will try to execute the code in the `try` block - if an error occurs it will be handled in the `catch` block (in this example simply write it to the console).

<Aside text="A try...catch block can be used with both synchronous and asynchronous code" />

A similar pattern can be found with `Promises`.

```js
const promise = new Promise((resolve, reject) => {
  resolve(doSomething());
});

promise
  .then((val) => parseInt(val) * 2)
  .then((newVal) => console.log(newVal))
  .catch((err) => console.error(err));
```

Let's say in the example `doSomething()` does not return a string. `parseInt` would therefore throw an error which would be handled in the last `.catch()` block.

## Callback hell

Callback hell, also called _Pyramid of Doom_, described a situation where multiple nested callbacks result in a deeply-indented code, that is both hard to read and hard to maintain.

```js
fs.readFile('file1.txt', 'utf8', function (err, data1) {
  if (err) {
    console.error(err);
    return;
  }

  fs.readFile('file2.txt', 'utf8', function (err, data2) {
    if (err) {
      console.error(err);
      return;
    }

    fs.readFile('file3.txt', 'utf8', function (err, data3) {
      if (err) {
        console.error(err);
        return;
      }

      console.log('Data from file1:', data1);
      console.log('Data from file2:', data2);
      console.log('Data from file3:', data3);
    });
  });
});
```

This is not an efficient or readable way to handle asynchronous operations. Callback hell can be addressed by using modern JavaScript features like Promises or async/await, which provide a more structured and less indented way to handle asynchronous code.

## Worker threads

Javascript is a single-threaded language and although it can execute code concurrently with the event loop, it can achieve something similar to a multi-threaded approach with `Web Workers` in the browser or `Cluster` in Node.js.
