import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

import { pluginErrorPreview } from './src/plugins/error-preview-plugin';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    expressiveCode({
      plugins: [pluginErrorPreview()],
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
