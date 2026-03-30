import svelte from '@astrojs/svelte';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import { pluginErrorPreview } from './src/plugins/error-preview-plugin';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import vercel from '@astrojs/vercel';
import { pluginLanguageLogo } from 'ec-lang-logo';
import { pluginMagicMove } from 'ec-magic-move';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	devToolbar: { enabled: false },
	prefetch: {
		prefetchAll: true,
	},

	redirects: {
		'/blog/': '/posts/1',
	},

	integrations: [
		expressiveCode({
			plugins: [
				pluginErrorPreview(),
				pluginLanguageLogo({
					color: 'theme',
					excludedLangs: ['json'],
				}),
				pluginMagicMove({
					theme: 'poimandres',
					duration: 400,
					stagger: 5,
				}),
			],
			styleOverrides: {
				codeFontFamily:
					"'Monaspace Neon', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
			},
			themes: ['poimandres', 'rose-pine-dawn'],
			themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
		}),
		svelte(),
		mdx(),
		icon({ iconDir: 'src/icon' }),
	],

	image: {
		remotePatterns: [{ protocol: 'https', hostname: '**.bsky.app' }],
	},

	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [
			rehypeHeadingIds,
			[rehypeAutolinkHeadings, { behavior: 'wrap' }],
		],
	},

	adapter: vercel(),
	vite: { plugins: [tailwindcss()] },
});

