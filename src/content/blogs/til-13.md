---
title: Building a search filter using Svelte
pubDate: 2023-11-22
tags: ['web-dev', 'astro', 'svelte']
isDraft: false
description: I already knew how to build a search filter with React. But since I wanted to learn something new, I built in with a framework I never used before - Svelte
---

This post is a bit special, because you can actually try the results of my latest learnings right here in this blog!

I wanted to add a search filter to this blog so that readers don't have to click through (hopefully) a lot of pages to get to a specific blog post. The problem: Astro, the framework I chose, does not run client side code. Well, it's not a problem, they choose to send as little JavaScript as possible to the client.

## Astro islands

But Astro provides a solution for this problem: [_islands_](https://docs.astro.build/en/concepts/islands/). In short, an island is an interactive UI component on the page like a counter (the typical example of state).

If you're working with React (using only client components) and change the value of some state, the page gets `hydrated` and receives the correct HTML content. But this results in a total rerender of the page, which can lead to performance issues if the page is large or if the device is slow.

Astro islands allow for `partial hydration` - if a state changes, only the island will get `hydrated`, not the whole page! You can also define, when the island should be loaded:

```astro
<!-- The standard way of defining a component as loaded on the client -->
<MyIsland client:load />

<!-- This component will only load when the browser becomes idle -->
<MyIsland client:idle />

<!-- This will only load when the component enters the viewport -->
<MyIsland client:visible />
```

## Framework options

Another great thing about this island structure is that you can use a lot of different client side frameworks: React, Preact, SolidJS, Vue, to name a few.

It's even possible to mix and match these different components. And using `nanostores` (or built-in stores like `svelte/store`), state can be shared between islands, even if one is a Vue component and the other is a React component.

To build the search filter I went with [Svelte](https://svelte.dev). Why? I never used it before, but it was on my list of frameworks to try for a while now. I may have underestimated the differences in syntax though. Because I'm mostly using React I will compare both frameworks.

## The Goal: search filter

Before I started, I did some research on what I should use for a fuzzy finding (people, myself included, make typos a lot) and decided to use `fuse.js` - actively maintained, overall good metrics on npm and GitHub. It needs the list to search (in my case just the posts) and the term to search for. Simple enough.

Next, I had to figure out how props and state works in Svelte. Even though it's a canary release, I decided to go with Svelte 5 to use the new [_runes_](https://svelte-5-preview.vercel.app/docs/runes) like `$state` or `$props`. I like that a bit more than just using `let` to define both.

Lastly, I needed to think about the design. But as I'm more of a backend than frontend guy, I actually did this along the way.

## Svelte surprises

### Syntax

The way `.svelte` components are written is not that different from a `.astro` component: write JavaScript (or TypeScript in my case) above, define the necessary variables, perform the logic - write the HTML with the correct use of the variables below.

```svelte
<script>
  // logic goes here
</script>

<div>
  <!-- content goes here -->
</div>
```

### State

The first thing to do next of course was to create the input and the state associated with the input element. And here I was surprised the first time: it's pretty easy to change the value of the state. Let's compare it to React:

```tsx
export default const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <input value={searchTerm} onChange={(e) => setSearchItem(e.target.value)}>
  )
}
```

Looks fine, is much more complicated than in Svelte:

```svelte
<script>
  let searchTerm = $state('');
</script>

<input bind:value={searchTerm} />
```

More concise, no need for additional imports. I also needed a function that actually does the searching, which I called on the `input` event:

```svelte
<input bind:value={searchTerm} on:input={handleSearch} />
```

The input event happens with every keystroke, a change event would only fire on enter.

### Conditional rendering

Okay, the searchTerm is now working as intended, now it's time to use it in some way. My first idea was to check if the searchTerm exists with a length of at least 2 and if the length of the foundPosts array is 0 (meaning that nothing was found).

I expected to be able to use ternaries for conditional rendering like in React:

```tsx
{searchTerm.length > 2 && !foundPosts.length
  ? <p>Nothing found</p>
  : // other stuff
}
```

Svelte is a bit more verbose in that sense, but I think once you get used to it also more readable:

```svelte title="SearchBar.svelte"
{#if searchTerm.length > 2 && !foundPosts.length}
  <p>Sorry, I wasn't able to find anything!</p>
{:else}
  <SearchResults {foundPosts} />
{/if}
```

Nested ternaries can become very hard to read at some point, but with Svelte this should not be an issue. You can use `{#if}` also with `{:else if}` and thus chain your conditionals with ease.

### Looping over an array

Next step is to display the elements of the search result, which is of course saved in an array of objects. In React, the correct thing to do would be to call `.map` on the array and return JSX:

```tsx
<div>
  {
    foundPosts.map((post) => {
      return (
        <div key={post.index}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
        </div>
      );
    });
  }
</div>
```

Svelte is different, and because I'm stubborn I did not look up how to do this in Svelte before. I just tried the way I knew and had to live with the consequences: of course the app crashed.

To loop over the array a similar syntax to the conditional rendering is needed:

```svelte title="SearchResults.svelte"
<div>
  {#each foundPosts as foundPost}
    <h2>{foundPost.title}</h2>
    <p>{foundPost.description}</p>
  {/each}
</div>
```

Notice the ending block statement in both `{/if}` and `{/each}`. I like the `.map()` approach a bit better, but seeing `{/each}` as an indicator that the looping ends there is a great way to not get lost in the code.

## Conclusion

Building the search filter with Svelte took me much longer than I probably would have needed with React. But it was still a great experience to dip my toes into this very different framework.

Hopefully I will build something larger with Svelte at some point, there are a lot of parts of the framework I never even touched!

For everyone who kept reading until the end, I want to share a great website where you can see the differences of framework syntax side-by-side: [Component party](https://component-party.dev/)!
