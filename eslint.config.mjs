import globals from 'globals';
import parser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('eslint:recommended', 'plugin:astro/recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        pragma: 'h',
        version: '16.0',
      },
    },

    rules: {
      'no-mixed-spaces-and-tabs': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    ignores: ['.astro/*'],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },

    rules: {},
  },
  ...compat.extends('plugin:@typescript-eslint/recommended').map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    ignores: ['.astro/*'],
    languageOptions: {
      parser: tsParser,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    ignores: ['.astro/*'],

    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.tsx'],
    })),
  {
    files: ['**/*.tsx'],

    plugins: {
      react,
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        tsconfigRootDir: '/Users/timonjurschitsch/Coding/projects/til-blog',
        project: ['./tsconfig.json'],
      },
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.astro/*.js', '*.astro/*.js'],

    languageOptions: {
      parser: tsParser,
    },
  },
];

