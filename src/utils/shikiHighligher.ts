import { createHighlighter } from 'shiki';

export const highlighter = createHighlighter({
	themes: ['catppuccin-mocha', 'synthwave-84'],
	langs: ['svelte', 'rs', 'ts', 'go', 'css'],
});

export const getHighlighter = () => {
	return highlighter;
};
