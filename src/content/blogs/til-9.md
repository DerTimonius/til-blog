---
title: Understanding useRef
pubDate: 2023-11-01
tags: ['web-dev', 'react']
isDraft: false
description: What exaclty is the useRef hook doing and when should you use it?
---

I recently looked at the code for the [`shadcn-ui/ui` components](https://github.com/shadcn-ui/ui) and noticed that they use `React.forwardRef` really often. I knew of the `useRef` hook before and used it sometimes in my projects, but to be honest, without knowing what it does and how to use it correctly. Finding `React.forwardRef` in pretty much every component led me to finally learn about both.

## `useRef`

Let's start with the hook:

> useRef is a React Hook that lets you reference a value that’s not needed for rendering.

[React `useRef` docs](https://react.dev/reference/react/useRef)

In other words: The `useRef` hook is a built-in hook in React that allows you to create a mutable reference to a DOM element or any other value that persists across renders without causing the component to re-render when the reference changes.

It's commonly used for low-level DOM manipulation, such as focusing on elements, scrolling, or measuring their dimensions. But `useRef` can be used with any type of value, not just DOM elements.

### Initialize ref

Call the `useRef` hook with an `initialValue` - if you don't know the type of value yet, use `null`:

```jsx title="App.tsx"
import { useRef } from 'react';

function App() {
  const ref = useRef(null);
}
```

useRef returns a `ref` object with a `current` property that is set to the initial value. If the value has not changed, the returned value will stay the same between rerenders.

### Change `ref.current`

You can now change the value stored in `ref.current` and read it later - looks like state, but this change does _not_ cause a rerender!
Therefore, you should avoid using refs to directly modify component state. Use useState or useReducer for managing and updating state that should trigger re-renders.

Let's build a quick form that uses a button to focus the input with ref:

```jsx title="App.tsx"
import { useRef, useState } from 'react';

function App() {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  const focusInput = () => {
    ref.current.focus();
  };

  return (
    <div>
      <input
        onChange={(event) => setValue(event.target.value)}
        ref={ref}
        value={value}
      />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

Another typical use case would be scrolling an image into view.

## Using `ref` of one component in a different component

The return value of `useRef` is local copy for the component it is used in. If you want to use the `ref` in a child component, you need to take a different approach, since refs are not exposed to different DOM nodes.

Let's say that in the example above you wrap the input in a separate component:

```jsx title="MyInput.tsx"
export default function MyInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}
```

If you now still want to use the button to focus the input, you need to wrap the component with `forwardRef`:

```jsx title="MyInput.tsx"
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return <input value={value} onChange={onChange} ref={ref} />;
});

export default MyInput;
```

To sum up, `forwardRef` is a higher-order component (HOC) or a function that allows you to forward refs from a parent component to a child component. It is often used in the context of functional or class components to allow the parent component to obtain a reference to a specific child component or element. This is useful when you need to access or manipulate a child component's DOM element directly from its parent.

## `useRef` and Typescript

The examples above lack types. But you most likely will write your application in Typescript and typing your `ref` will help you tremendously, but it can also be a hassle.

You can pass the type of the ref in the `useRef` call:

```tsx title="App.tsx"
const ref = useRef<HTMLInputElement>(null);
```

You can also use other types like `number` if you want to use it similarly to state, but if you want to store a reference to a DOM node, you will most likely use some sort of `HTMLElement` type.

Typing `formardRef` is a bit more complicated and expects two parameters:

```tsx title="MyInput.tsx"
import { forwardRef, type Dispatch, type SetStateAction } from 'react';

interface MyInputProps {
  value?: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const MyInput = forwardRef<HTMLInputElement, MyInputProps>(
  ({ value, onChange }, ref) => {
    return <input value={value} onChange={onChange} ref={ref} />;
  },
);

export default MyInput;
```

The first parameter is the ref you defined in the `useRef` call, and the second is the typing of the props (`forwardRef<RefType, PropsType>`).

This pretty much sums up everything you need to know about typing both `useRef` and `forwardRef`.

## Conclusion

`useRef` is a powerful React hook to manipulate DOM elements without causing rerenders. Knowing what exactly it does and how to use it correctly will for sure influence the way I will write functional components in the future.
