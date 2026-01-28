<script lang="ts">
  import { createHighlighter } from "shiki";
  import { ShikiMagicMove } from "shiki-magic-move/svelte";

  import "shiki-magic-move/dist/style.css";

  let {
    previous,
    next,
    lang,
    autoanimate = true,
    duration = 600,
  }: {
    previous: string;
    next: string;
    lang: string;
    autoanimate?: boolean;
    duration?: number;
  } = $props();

  const highlighter = createHighlighter({
    themes: ["catppuccin-mocha"],
    langs: ["svelte", "rs", "ts", "go", "css"],
  });

  let code = $state(previous);
  let container: Element | undefined = $state();
  let animating = $state(false);

  function animate() {
    code === previous ? (code = next) : (code = previous);
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (reducedMotion || !autoanimate) return;

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
      options={{ duration, stagger: 0.3, lineNumbers: true }}
      onStart={() => (animating = true)}
      onEnd={() => (animating = false)}
      theme="catppuccin-mocha"
      {lang}
      {highlighter}
      {code}
    />
    {#if !animating}
      <button
        class="border absolute right-0 top-0 m-2 rounded-md border-slate-600 p-1 text-custom-base hover:bg-slate-600/50"
        onclick={animate}
        aria-label="Animate"
      >
        <svg
          aria-hidden={true}
          class="h-6 w-6"
          fill="none"
          stroke-width="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
