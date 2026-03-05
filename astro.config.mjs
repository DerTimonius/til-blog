import svelte from '@astrojs/svelte';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdx from '@astrojs/mdx';

import tailwindcss from "@tailwindcss/vite"
import { pluginErrorPreview } from './src/plugins/error-preview-plugin';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import vercel from '@astrojs/vercel';
import { pluginLanguageLogo } from "ec-lang-logo"

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },

  redirects: {
    '/blog/': '/posts/1',
  },

  integrations: [
    expressiveCode({
      plugins: [pluginErrorPreview(), pluginLanguageLogo({
        color: "mono",
        excludedLangs: ["json"]
      })],
      themes: ['catppuccin-mocha', 'catppuccin-latte'],
    }),
    svelte(),
    mdx(),
  ],

  image: {
    remotePatterns: [{protocol: "https", hostname: "**.bsky.app"}]
  },

  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },

  adapter: vercel(),
  vite: {plugins: [tailwindcss()]}
});

