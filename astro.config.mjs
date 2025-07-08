import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdx from '@astrojs/mdx';

import { pluginErrorPreview } from './src/plugins/error-preview-plugin';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },

  redirects: {
    '/blog/': '/posts/1',
  },

  integrations: [
    tailwind(),
    expressiveCode({
      plugins: [pluginErrorPreview()],
      themes: ['catppuccin-macchiato', 'catppuccin-latte'],
    }),
    svelte(),
    mdx(),
  ],

  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },

  adapter: vercel(),
});

