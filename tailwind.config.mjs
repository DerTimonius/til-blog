function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    // Uncomment the following extend
    // if existing Tailwind color palette will be used

    extend: {
      textColor: {
        custom: {
          base: withOpacity('--color-text-base'),
          accent: withOpacity('--color-accent'),
          inverted: withOpacity('--color-fill'),
        },
      },
      backgroundColor: {
        custom: {
          fill: withOpacity('--color-fill'),
          accent: withOpacity('--color-accent'),
          inverted: withOpacity('--color-text-base'),
          card: withOpacity('--color-card'),
          'card-muted': withOpacity('--color-card-muted'),
        },
      },
      outlineColor: {
        custom: {
          fill: withOpacity('--color-accent'),
        },
      },
      borderColor: {
        custom: {
          line: withOpacity('--color-border'),
          fill: withOpacity('--color-text-base'),
          accent: withOpacity('--color-accent'),
          light: withOpacity('--color-border-dashed'),
        },
      },
      stroke: {
        custom: {
          base: withOpacity('--color-text-base'),
          accent: withOpacity('--color-accent'),
        },
        transparent: 'transparent',
      },
      fill: {
        custom: {
          base: withOpacity('--color-text-base'),
          accent: withOpacity('--color-accent'),
        },
        transparent: 'transparent',
      },
      fontFamily: {
        mono: ['Fira Mono', 'monospace'],
        neon: ['Monaspace Neon', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
