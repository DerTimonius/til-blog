<script lang="ts">
import { MagicMoveRenderer } from 'shiki-magic-move/renderer';
import type {
	KeyedTokensInfo,
	MagicMoveRenderOptions,
} from 'shiki-magic-move/types';

interface ShikiMagicMoveRendererProps {
	class?: string;
	animate?: boolean;
	tokens: KeyedTokensInfo;
	previous?: KeyedTokensInfo;
	options?: MagicMoveRenderOptions;
	onStart?: () => void;
	onEnd?: () => void;
}
const { ...props }: ShikiMagicMoveRendererProps = $props();

let container: HTMLPreElement;
let renderer: MagicMoveRenderer;
let isMounted = $state(false);

$effect(() => {
	if (!container) return;
	container.innerHTML = '';
	isMounted = true;
	renderer = new MagicMoveRenderer(container);
});

$effect(() => {
	async function render() {
		if (!renderer) return;
		Object.assign(renderer.options, props.options);
		if (props.animate) {
			if (props.previous) renderer.replace(props.previous);
			props.onStart?.();
			await renderer.render(props.tokens);
			props.onEnd?.();
		} else {
			renderer.replace(props.tokens);
		}
	}
	render();
});
</script>

<pre bind:this={container} class="shiki-magic-move-container">
  {#if !isMounted}
    {#each props.tokens.tokens as token}
      {#if token.content === '\n'}
        <br />
      {/if}
      <span class="shiki-magic-move-item">
        {token.content}
      </span>
    {/each}
  {/if}
</pre>
