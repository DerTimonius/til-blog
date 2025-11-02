<script lang="ts">
import ShikiMagicMove from './ShikiMagicMove.svelte';
import { createHighlighter } from 'shiki';

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

let code = $state(previous);
let container: Element | undefined = $state();
let animating = $state(false);

const highlighter = createHighlighter({
	themes: ['catppuccin-mocha', 'synthwave-84'],
	langs: ['svelte', 'rs', 'ts', 'go', 'css'],
});

const theme =
	document.documentElement.getAttribute('data-theme') === 'dark'
		? 'catppuccin-mocha'
		: 'synthwave-84';

const reducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)',
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
  <div bind:this={container} class="relative" id="animateContainer">
    <ShikiMagicMove
      options={{ duration, stagger: 3, animateContainer: true }}
      onStart={() => (animating = true)}
      onEnd={() => (animating = false)}
      {theme}
      {highlighter}
      {code}
      {lang}
    />
    {#if !animating}
      <button
        class="border-1 absolute right-0 top-0 m-2 rounded-md border border-slate-600 p-1 text-custom-base hover:bg-slate-600/50"
        onclick={() => (code === previous ? (code = next) : (code = previous))}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
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
