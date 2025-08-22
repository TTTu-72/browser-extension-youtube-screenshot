import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import solidPlugin from 'eslint-plugin-solid';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        location: 'readonly',
        MutationObserver: 'readonly',
        HTMLElement: 'readonly',
        HTMLVideoElement: 'readonly',
        HTMLButtonElement: 'readonly',
        // WebExtension globals
        browser: 'readonly',
        // WXT globals
        defineBackground: 'readonly',
        defineContentScript: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      solid: solidPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Solid.js rules
      ...solidPlugin.configs.typescript.rules,

      // Prettier integration
      'prettier/prettier': 'error',

      // General rules
      'no-console': 'off', // For development
      // 'no-unused-vars': 'off', // Use TypeScript version
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  prettierConfig,
  {
    ignores: [
      'dist/**',
      '.wxt/**',
      'node_modules/**',
    ],
  },
];
