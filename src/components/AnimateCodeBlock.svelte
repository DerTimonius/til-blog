<script lang="ts">
  import { getHighlighter } from 'shiki';
  import ShikiMagicMove from './ShikiMagicMove.svelte';

  let {
    previous,
    next,
    lang,
  }: { previous: string; next: string; lang: string } = $props();

  let code = $state(previous);
  let container: Element | undefined = $state();
  let animating = $state(false);

  const highlighter = getHighlighter({
    themes: ['catppuccin-mocha', 'synthwave-84'],
    langs: [lang],
  });

  const theme =
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'catppuccin-mocha'
      : 'synthwave-84';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setTimeout(() => {
            code = next;
          }, 500);
        }
      });
    },
    {
      root: null,
      rootMargin: `0px 0px -${window.innerHeight / 8}px 0px`,
      threshold: 1,
    },
  );

  $effect(() => {
    if (container) {
      observer.observe(container);
    }
  });
</script>

{#await highlighter then highlighter}
  <div bind:this={container} class="relative">
    <ShikiMagicMove
      options={{ duration: 600, stagger: 3, animateContainer: true }}
      onStart={() => (animating = true)}
      onEnd={() => (animating = false)}
      {theme}
      {highlighter}
      {code}
      {lang}
    />
    {#if !animating}
      <button
        class="absolute top-0 right-0 m-2 border-1 border rounded-md p-1 border-slate-600 text-custom-base hover:bg-slate-600/50"
        onclick={() => (code === previous ? (code = next) : (code = previous))}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </button>
    {/if}
  </div>
{/await}
