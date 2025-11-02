<script lang="ts">
import {
	codeToKeyedTokens,
	createMagicMoveMachine,
	type MagicMoveDifferOptions,
	type MagicMoveRenderOptions,
} from 'shiki-magic-move/core';
import ShikiMagicMoveRenderer from './ShikiMagicMoveRenderer.svelte';
import type { HighlighterCore } from 'shiki';

interface ShikiMagicMoveProps {
	highlighter: HighlighterCore;
	lang: string;
	theme: string;
	code: string;
	options?: MagicMoveRenderOptions & MagicMoveDifferOptions;
	onStart?: () => void;
	onEnd?: () => void;
}
const { ...props }: ShikiMagicMoveProps = $props();

const machine = createMagicMoveMachine(
	(code) =>
		codeToKeyedTokens(props.highlighter, code, {
			lang: props.lang,
			theme: props.theme,
		}),
	props.options,
);
const result = $derived(machine.commit(props.code));
</script>

<ShikiMagicMoveRenderer
  animate={true}
  tokens={result.current}
  previous={result.previous}
  options={props.options}
  onStart={props.onStart}
  onEnd={props.onEnd}
/>
