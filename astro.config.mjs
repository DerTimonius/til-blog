import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx({
      remarkPlugins: [remarkReadingTime],
      shikiConfig: { theme: 'catppuccin-mocha', wrap: true },
    }),
    svelte(),
  ],
});
