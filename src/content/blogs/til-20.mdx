---
title: How does the satisfies keyword in TypeScript work?
pubDate: 2024-01-25
tags: ['typescript']
isDraft: false
description: as, as const, satisfies - different ways to type variables in TypeScript. What's the best way?
---

I have been using `satisfies` wrong. And I can safely state that because every time I tried it, I never got it work correctly.
After growing frustrated a bit and thinking that it's just another tool in the TypeScript toolkit, I did what every developer does: I forgot about it.

But there were always some cases where I tried to incorporate it. And it still didn't work. It's time to learn how `satisfies` actually works and how my workflow could benefit from using it.

## Prior mistakes

Before diving into the topic, I should describe how I used it. It will become clear why this did not work once we know, how to use `satisfies`.

I always tried to use it as a replacement for `as`. Let's look at the following code:

```ts
type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  invitees: Invitee[];
};

type Invitee = {
  id: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

const invitees = [
  {
    id: '1',
    user: {
      id: 'user_1',
      firstName: 'Tom',
    },
  },
  {
    id: '2',
    user: {
      id: 'user_2',
      firstName: 'Bob',
    },
  },
];

const event: Event = {
  id: 'event_1',
  title: "The best event",
  start: 2024-01-26,
  end: 2024-01-27,
  invitees: invitees satisfies Invitee[] // bad red squiggly will happen here
};
```

In this case, I did not add the `status` property to the invitees and with `satisfies` I thought I could tell TypeScript _hey, I know, there's a property missing, but it's okay, don't worry!_ `As` does work this way, so I thought this would be okay.

But apparently it is not okay. When using GraphQL, it might happen that you do not have to query every single property of a specific type, but you may have used the specific type in a different type definition. Coercing the queried values with `as` can be a valid path to achieve this. And I was under the impression that `satisfies` works the same.

## Actual usage

The correct way of using `satisfies` is not coercing types. It's actually the opposite: you can further restrict the type than with "conventional" methods.

Let's start with defining some types and a variable:

```ts
type Routes = Record<string, Route>;
type Route = { path: string; children?: Routes };

const routes = {
  events: {
    path: '/events',
  },
  team: {
    path: '/team',
    children: {
      assistants: {
        path: '/team/assistants',
      },
      clients: {
        path: '/team/clients',
      },
    },
  },
};
```

The best way to type this is actually to not type it at all. TypeScript is very good at inferring the type from the value. But for the sake of this article, we have to type it.

The first instinct would be to do the following:

```ts
type Routes = Record<string, Route>;
type Route = { path: string; children?: Routes };

const routes: Routes = {
  events: {
    path: '/events',
  },
  team: {
    path: '/team',
    children: {
      assistants: {
        path: '/team/assistants',
      },
      clients: {
        path: '/team/clients',
      },
    },
  },
};

routes.events.path; // works
routes.settings.path; // still works?
```

Here two things happen:

1. autocomplete disappears
2. if you try to access a property that does not exist, it does not display an error

Trying `routes.settings.path` should trigger a bad red squiggly, but it doesn't. Next, we try to use `as` instead:

```ts
type Routes = Record<string, Route>;
type Route = { path: string; children?: Routes };

const routes = {
  events: {
    path: '/events',
  },
  team: {
    path: '/team',
    children: {
      assistants: {
        path: '/team/assistants',
      },
      clients: {
        path: '/team/clients',
      },
    },
  },
  settings: {
    URL: '/settings', // error happens here
  },
} as Routes;
```

That doesn't look good. The complete variable gets a bad red squiggly (which would not happen with the first method). Imagine this variable is much larger, with more properties. It will take some time to find the erroneous property that needs to be fixed. And even if you fix the issue, the same two issues persist.

It's time for `satisfies` to enter the chat:

```ts
type Routes = Record<string, Route>;
type Route = { path: string; children?: Routes };

const routes = {
  events: {
    path: '/events',
  },
  team: {
    path: '/team',
    children: {
      assistants: {
        path: '/team/assistants',
      },
      clients: {
        path: '/team/clients',
      },
    },
  },
} satisfies Routes;

routes.events.path; // works
routes.settings.path; // finally a bad red squiggly
```

TypeScript now knows the properties of the `routes` variable: autocomplete returns, accessing issues that do not exist will trigger TypeScript to start complaining. Nice! But it would be even better if `routes.events.path` would not only be typed as `string` but actually as `/events`.

## `as const` + `satisfies` = superpower

There's a way to achieve this: combining `as const` and `satisfies`.

```ts
type Routes = Record<string, Route>;
type Route = { path: string; children?: Routes };

const routes = {
  events: {
    path: '/events',
  },
  team: {
    path: '/team',
    children: {
      assistants: {
        path: '/team/assistants',
      },
      clients: {
        path: '/team/clients',
      },
    },
  },
} as const satisfies Routes;

// will now actually be inferred with the string values!
// const routes: {
//     readonly events: {
//         readonly path: "/events";
//     };
//     readonly team: {
//         readonly path: "/team";
//         readonly children: {
//             readonly assistants: {
//                 readonly path: "/team/assistants";
//             };
//             readonly clients: {
//                 readonly path: "/team/clients";
//             };
//         };
//     };
// };
```

This combination is so good that it even beats not typing the variable at all! If you just use `as const` the path gets inferred correctly, but if you mess up a property, TypeScript won't warn you. But using `as const` with `satisfies` feels like a hidden superpower.

## Conclusion

Finally looking into the docs and learning how `satisfies` works showed me, that my initial assumption was flat out wrong. Knowing how to use it now will certainly come in handy in tricky situation that normally would need larger amounts of TypeScript gymnastics.
