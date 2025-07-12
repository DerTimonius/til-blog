---
title: "Solving API Validation with TypeScript's Weirdest Type Tricks"
pubDate: 2025-07-12
isFeatured: false
relatedPosts: ['til-35']
tags: ['typescript']
description: Once you finally understood how to leverage generics, you can build the wildest TypeScript type helpers
---

At work, I recently had to hook up an external API for a lot of different requests. And of course the request bodies did differ a lot from request to request.

To help me navigate this better, I wrote a small internal type library to match the expected bodies. And the more I dug into the docs of the API, I found special cases that I needed to cover.

For example, what if it needs at least one key of an object, but it doesn't matter which one? Or exactly one key?

## Enter the type helpers

Before I introduce the type helpers, I want to show the type we will be working with for this post. It doesn't really matter which type you would use as long as it maps to an object with exclusive keys.

```ts
interface DataSource {
  url?: string;
  path?: string;
  dataString?: string;
}
```

The first helper I needed to build (or so I thought) was the `AtLeastOne` type: it does not matter which key you pass, but it has to be at least one.

It's clear that this can only be achieved using [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) and also that some sort of type mapping has to come into play.

The main question for me: how do I remove the optionality of the individual keys? And in a way where I do not make every key required by accident?

I opened up the TypeScript playground and started with a `NonNullable` to check where this would get me.

```ts
type AtLeastOne<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

type Opts = AtLeastOne<DataSource>;
// {
//     filePath?: string | undefined;
//     dataString?: string | undefined;
//     url?: string | undefined;
// }
```

Okay, this did not really work, as `NonNullable` only removes `null` from types and nothing else. But I can remove the optionality with a `-?`, would this work?

```ts
type AtLeastOne<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

type Opts = AtLeastOne<DataSource>;
// {
//     filePath: string;
//     dataString: string;
//     url: string;
// }
```

The good news: The individual keys now are required. The bad news: All keys are now required.

So I have to dig a bit deeper. What happens when I create a mapped type of a mapped type with what I just added?

```ts
export type AtLeastOne<T> = {
  [K in keyof T]: { [L in K]-?: NonNullable<T[L]> };
};

type Opts = AtLeastOne<DataSource>;
// {
//     filePath?: {
//         filePath: string;
//     } | undefined;
//     dataString?: {
//         dataString: string;
//     } | undefined;
//     url?: {
//         url: string;
//     } | undefined;
// }
```

This is starting to look promising! With some key indexing this should achieve what I want.

```ts error-preview
export type AtLeastOne<T> = {
  [K in keyof T]: { [L in K]-?: NonNullable<T[L]> };
}[keyof T];

type Opts = AtLeastOne<DataSource>;
// {
//     filePath: string;
// } | {
//     dataString: string;
// } | {
//     url: string;
// } | undefined

const opts = {} ~~satisfies~~ Opts //! Type '{}' does not satisfy the expected type 'Opts'.
const correctOpts = { filePath: "../config.ts" } satisfies Opts;
```

Ha, this is exactly what I wanted! TypeScript complains about an empty error, but when adding at least on key, it's happy. And it still offers the correct autocomplete.

## `ExactlyOne`

Continuing to read through the docs I noticed that I made a small mistake: it's not _we accept at least one of the key, we accept exactly one of the keys_. Oops.

But I think with the type I've just built this should be pretty simple, right? Right? I mean, all I have to do is tell TypeScript that once one key has been set, the others should never be set.

Could `never` be the answer?

```ts
export type ExactlyOne<T> = {
  [K in keyof T]: {
    [L in K]-?: NonNullable<T[L]>;
  } & Record<Exclude<keyof T, K>, never>;
}[keyof T];

type Opts = ExactlyOne<DataSource>;
// ({
//     filePath: string;
// } & Record<"dataString" | "url", never>) | ({
//     dataString: string;
// } & Record<"filePath" | "url", never>) | ({
//     url: string;
// } & Record<"filePath" | "dataString", never>) | undefined
```

Excluding the key we are already using, we specify that all the other keys are supposed to be of type `never`, meaning they should not exist. And while this looks correct, it's not, because this way, every key has to exist with a value to satisfy the `never` type. Good luck with writing that object!

The solution is to wrap the `Record` in a `Partial` to remove the requirement of adding the object.

```ts error-preview
export type ExactlyOne<T> = {
  [K in keyof T]: {
    [L in K]-?: NonNullable<T[L]>;
  } & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

type Opts = ExactlyOne<DataSource>;
// ({
//     filePath: string;
// } & Partial<Record<"dataString" | "url", never>>) | ({
//     dataString: string;
// } & Partial<Record<"filePath" | "url", never>>) | ({
//     ...;
// } & Partial<...>) | undefined

const opts1 = {} ~~satisfies~~ Opts; //! Type '{}' does not satisfy the expected type 'Opts'
const opts2 = {
  url: "example.com",
  ~~filePath~~: "../config.ts" //! Type 'string' is not assignable to type 'undefined'
} satisfies Opts;

const correct = { filePath: "../config.ts" } satisfies Opts;
```

Now, TypeScript will only be happy with objects with exactly one key. And I think that the error message in this case is also pretty helpful as it's showing you where to find the issue.

## `AtMostOne`

And when I thought I was done building difficult helpers, I stumbled over the next possible iteration: What about a type with 0 or 1 keys?

Once again, we can build from the previous one by telling TypeScript that 0 keys would also be allowed. My first instinct was to create a union type with one branch being an empty object.

```ts
export type AtMostOne<T> =
  | {}
  | {
      [K in keyof T]: {
        [L in K]-?: NonNullable<T[L]>;
      } & Partial<Record<Exclude<keyof T, K>, never>>;
    }[keyof T];
```

This could work if it wasn't for the TypeScript quirk of an empty object actually being anything but `null` or `undefined`. So, you could also pass `12345` here and it would be happy, which is not ideal.

But with another mapped type this can be solved. Just tell TypeScript that every key is `never` in the alternative branch!

```ts error-preview
export type AtMostOne<T> =
  | { [K in keyof T]?: never }
  | {
      [K in keyof T]: {
        [L in K]-?: NonNullable<T[L]>;
      } & Partial<Record<Exclude<keyof T, K>, never>>;
    }[keyof T];

type Opts = AtMostOne<DataSource>;

const opts1 = {} satisfies Opts;
const opts2 = { filePath: '../config.ts' } satisfies Opts;
const incorrect = {
  url: "example.com",
  ~~filePath~~: "../config.ts" //! Type 'string' is not assignable to type 'undefined'
} satisfies Opts;
```

Finally, now I have covered every case I can imagine (okay, I could imagine that the number of necessary keys could be more than one, but I don't want to even think about this now).

And the best thing for all those types is that every single one of them offers autocomplete and will complain about incorrect fields.

## Conclusion

When I started the type library, I left a lot of `// NOTE: expects only one field` throughout the types, but it just felt wrong. Diving deeper into the type system and building much more complex and helpful types than the [type I recently wrote about](/posts/til-35), along the way I have learned a lot about mapped types and also the `-?` operator. To find that one I had to do a lot of googling.

Next time you are writing runtime checks to make sure that the constraints are met, think about write a type to do it for you. Your future self (and your colleagues) will thank you!

And if you ever find yourself in a position where you have to write a type like this, I highly suggest you go to the [TS playground](https://www.typescriptlang.org/play/), create a dummy type and maybe a variable that should satisfy that type and start playing around with the types.
