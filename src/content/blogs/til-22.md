---
title: More on the event loop
pubDate: 2024-03-07
tags: ['javascript', 'computer-science']
relatedPosts: ['til-6']
isDraft: false
description: It's not just the callback queue. It's macrotask vs microtask queue!
---

Last time I wrote about the event loop in Javascript, I mostly referenced this awesome [conference talk](https://www.youtube.com/watch?v=8aGhZQkoFbQ). But it's already 9 years old and some concepts are outdated.

Recently I started a great course on [Frontend Masters](https://www.frontendmasters.com) called _Advances Javascript Quiz_ that challenges my knowledge of closures, `this` and the event loop, among others. In this post I want to focus on the latter, because answering the questions of the quiz was much harder than I anticipated.

## Quick recap

The event loop is Javascripts way to run code asynchronously and concurrently. Certain callback functions get added to the task queue that then get executed if the call stack is empty. Since it's a queue, the functions are executed in order (first in, first out).

But this has some drawbacks: chaining promises should be resolved directly after each other, not after some other callback function has been executed.

## Macrotask and microtask queue

To solve this issue, the callback queue was split up into to separate queues: the _macrotask_ queue, which is pretty much the way the callback queue worked before, and the _microtask_ queue. What's the difference?

First off, very few things are added to the microtask queue:

```js {4, 7-9, 11, 13, 15, 17}
async function foo() {
    console.log("foo");
    await console.log("bar");
    console.log("baz"); // anything after `await`
}

.then(console.log("foo"))
.catch(console.log("bar"))
.finally(console.log("baz"));

queueMicrotask(console.log("foo"));

process.nextTick(console.log("bar"));

new MutationObserver(() => console.log("baz"))
```

In the examples above, of course only the callback functions are added to the microtask queue. But the list above shows **all** instances of functions that get onto the microtask queue.

What surprised me when reading this, was that every function call after an `await` gets added to the microtask queue and is not executed the moment it is added to the call stack.

All other callback functions get added to the microtask queue - either directly on the call or after the Web APIs have been doing their thing (looking at you, `setTimeout`).

The microtask queue has a higher priority, which means that as long there are functions in this queue, the macrotask queue has to wait until its content is looped onto the call stack.

## Combining both

What made me write this post were the questions that were asked in the course. I'm going to share one here, but without the great visuals from the course (to see them: do the course, it's worth it!), and it should be prefaced with the quote of Lydia Hallie, the teacher of the course:

> Don't actually write this kind of JS or you'll get fired!

A typical question when thinking about the event loop of course is something like _given this code, what's the order of the outputs?_

```js
async function foo() {
    console.log("foo");
    new Promise(() => console.log("bar"));
    await new Promise((res) => {
        setTimeout(() => console.log("baz"), 0);
        res();
    });
}

new Promise((res) => {
    console.log("oof");
    (async () => {
        console.log("rab");
        await foo();
        console.log("zab");
    })();
    res();
}).then(() => console.log("stuff"));

console.log("things"),
```

Now, what is logged when and why? Let's start with the correct order

```sh
oof
rab
foo
bar
things
stuff
zab
baz
```

It starts with the function declaration, which is skipped until the function is actually called. Next is the Promise constructor that is added to the call stack. Next is the `console.log("oof")` that gets added to the call stack and gets executed immediately.

The next step is to add the anonymous async function to the stack. `console.log("rab")` is added and executed directly. Now, the `foo()` function gets called and since it's awaited, it runs synchronously - that's why `foo` is the next thing to get logged to the console.

Again, we get to a Promise constructor, with the callback function added to the stack, `bar` gets logged. Now, finally, it's time to add something to the macrotask queue with `setTimeout(() => console.log("baz"), 0)`.
Since the `foo()` function is not yet resolved (because of an implicit return of `undefined`), the anonymous async function is now halted. This in turn means that the resolver function (or `res()`) now runs and `.then` gets executed - so `console.log("stuff")` gets added to the microtask queue.

Because the `foo()` function is not resolved, it gets the first spot in the microtask queue, `stuff` is second in the queue. Now finally, we get to the last line of this code, which is executed then and there and `things` is logged.

The call stack is now empty and it's time for the microtask queue. `foo()` gets resolved which means it returns undefined, which doesn't do a thing. But as it is resolved, the halted anonymous function gets added to the microtask queue.

With the call stack still empty, the next microtask is looped to the stack, which is `stuff`. Next is `zab` and now the microtask queue is clear.

Finally, it's time for the macrotask queue to get its function executed, the final `baz`.

## What do we learn from this?

Well. This exercise again shows how unintuitive JS can be in some cases. But learning about what exactly gets on the microtask queue might help me in the future when the order of the executions of some functions is not the way I expected.

I am looking forward to the rest of the course with iterators, generators and garbage collection, topics that don't pop up in my mind when thinking about Javascript. But
