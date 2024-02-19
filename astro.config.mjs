import fs from 'node:fs';

import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import expressiveCode, { ExpressiveCodeTheme } from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

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
  integrations: [
    tailwind(),
    expressiveCode({
      plugins: [pluginErrorPreview()],

      themes: [catppuccin, synthwave],
    }),
    svelte(),
  ],
  markdown: { remarkPlugins: [remarkReadingTime] },
});
