import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    expressiveCode({
      styleOverrides: {
        frames: {
          editorTabBarBackground: ({ theme }) =>
            theme.colors['tab.activeBackground'],
        },
      },
      themes: ['poimandres'],
    }),
    svelte(),
  ],
  markdown: { remarkPlugins: [remarkReadingTime] },
});
