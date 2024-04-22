<script lang="ts">
  import { getHighlighter } from 'shiki';
  import ShikiMagicMove from './ShikiMagicMove.svelte';

  let {
    previous,
    next,
    lang,
  }: { previous: string; next: string; lang: string } = $props();

  let code = $state(previous);

  const highlighter = getHighlighter({
    themes: ['catppuccin-mocha', 'synthwave-84'],
    langs: [lang],
  });

  const theme =
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'catppuccin-mocha'
      : 'synthwave-84';
</script>

{#await highlighter then highlighter}
  <ShikiMagicMove
    options={{ duration: 600, stagger: 3, animateContainer: true }}
    {theme}
    {highlighter}
    {code}
    {lang}
  />
  <button
    class="text-custom-base hover:text-custom-accent"
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
    Animate code
  </button>
{/await}
