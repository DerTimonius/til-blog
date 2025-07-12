---
title: The most satisfying (and useless) TypeScript type
pubDate: 2025-06-11
relatedPosts: ['til-36']
isFeatured: false
tags: ['typescript']
description: Type indexing and template literals lead to the creation of the most satisfying and useless TypeScript type I ever wrote
---

Look, TypeScript is great. Having it warn us of invalid types or non-existing methods is one of the main selling points of using TS in favor of JS.

But another great feature of TypeScript is the LSP (_language server protocol_) which editors use to know about errors and offer autocomplete.

And the autocomplete was the main reason I wrote this type:

```ts
export type Color = 'orange' | 'green' | 'pink' | 'brown';
export type Location = 'border' | 'bg' | 'text' | 'stroke';

type ThemeColors = {
  [C in Color]: { [L in Location]: `${L}-${'theme' | 'accent'}-${C}` };
};
```

## What for?

With this type, when writing an object that satisfies the `ThemeColors` type, gives us not only autocomplete for the `Color` or `Location`, but also for the actual color string.

```ts
const colors = {
  orange: {
    // hitting ctrl+space in the `orange` object shows "border" | "bg" | "text" | "stroke"
    stroke: 'stroke-accent-orange',
    // hitting ctrl+space after adding `border` shows us "border-accent-orange" | "border-theme-orange"
    border: 'border-accent-orange',
    // ...
  },
  // ...
} satisfies ThemeColors;
```

And getting type safety on the string is actually pretty neat. One reason is that in situations like these, where we define certain colors, typos can not only be annoying but lead to unwanted consequences.

The other reason is that you can also be sure that the string you pass is always correct.

But how did I come up with this type? Let's break it down.

## Index accessing & mapped types

Since the `Color` and `Location` types are pretty standard string type unions, I am going to skip them. The meat is in the `ThemeColor` and `ThemeColors` type.

The indexing into the `Color` and `Location` types is what brings the spice to the table.

Let's take this type for example:

```ts
type User = {
  name: string;
  age: number;
  role: 'admin' | 'user';
};
```

You can index into the type to extract the type from the individual values, so `User["name"]` would then equal a string, `User["age"]` would be number etc.

But we can take this one step further. When using an object with `[K in Type]` as the keys, we also have access to the name of the key.

```ts
type GetUser = {
  [K in keyof User]: () => User[K];
};
// in the end, this is
// {
//   name: () => string,
//   age: () => number,
//   role: () => "admin" | "user"
// }
```

This can not only be done on object types, but also on union types. If we take the `Color` type from above, the `{ [C in Color]: () => C }` would create an object where the values are functions that return the keys.

Pretty useless, but the concept can be built upon.

## Template literals

It wasn't too long ago that I learnt that you can also use template literals in TypeScript types!

If we look at the `GetUser` type again, we could even rename the key for the type to be `getName` etc.

```ts
type GetUser = {
  [K in keyof User as `get${Capitalize<K>}`]: () => User[K];
};
// in the end, this is
// {
//   getName: () => string,
//   getAge: () => number,
//   getRole: () => "admin" | "user"
// }
```

Therefore, the weird type from the start takes the color, saves it in `C` as the key, which has itself an object with `L` of the locations as keys, where the strings are then created to be `<some-location>-<accent-or-theme>-<color>`.

When creating an object that satisfies said type, you get type-safety and autocomplete all the way through!

## Conclusion

Is this type useful? Well, sort of. To be honest, creating it did save me maybe 30 seconds of typing, but it probably took one minute to create the type itself.

But is it satisfying to just hit control+space to get the correct autocomplete for every single string for this type? Oh yes!
