import fs from 'node:fs';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import expressiveCode, { ExpressiveCodeTheme } from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdx from '@astrojs/mdx';

import { pluginErrorPreview } from './src/plugins/error-preview-plugin';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
const catppuccinJsoncString = fs.readFileSync(
  new URL('./theme.jsonc', import.meta.url),
  'utf-8',
);
const catppuccin = ExpressiveCodeTheme.fromJSONString(catppuccinJsoncString);
const synthwaveJsoncString = fs.readFileSync(
  new URL('./theme2.jsonc', import.meta.url),
  'utf-8',
);
const synthwave = ExpressiveCodeTheme.fromJSONString(synthwaveJsoncString);

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/blog/': '/blog/1',
    '/blog/featured': '/blog/featured/1',
  },
  integrations: [
    tailwind(),
    expressiveCode({
      plugins: [pluginErrorPreview()],
      themes: [catppuccin, synthwave],
      themeCssRoot: 'html',
      themeCssSelector: (theme) => `[data-theme=${theme.name}]`,
      useDarkModeMediaQuery: true,
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
});
