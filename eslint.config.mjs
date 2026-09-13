// Anti-Gravity Supreme Architectural Fortress ESLint Configuration (Astro + MD3 + Panda CSS)
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import css from '@eslint/css';

import { createA11yConfig } from './scripts/eslint/a11y-config.js';
import { m3TokensPlugin } from './scripts/eslint/m3-tokens-plugin.js';
import { cssTokensPlugin } from './scripts/eslint/css-tokens-plugin.js';
import { restrictedImportsRule, restrictedSyntaxRules } from './scripts/eslint/restricted-rules.js';

export default defineConfig([
  globalIgnores([
    'dist',
    '.astro',
    'styled-system',
    'storybook-static',
    '.agents',
    'coverage',
    '.wireit',
    'node_modules',
    'playwright-report',
    'test-results',
  ]),
  // Scripts and tooling config files run under Node.js
  {
    files: ['scripts/**', '*.config.{js,mjs,cjs,ts}', 'postcss.config.cjs', 'vitest.shims.d.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
    },
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': 'off',
      complexity: 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-nested-callbacks': 'off',
      'no-param-reassign': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Application TypeScript / React source code
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Complexity and Cognitive Strictness
      complexity: ['error', 8],
      'max-lines': ['error', { max: 256, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 64, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],
      'max-nested-callbacks': ['error', 3],

      // TypeScript Mathematical Supremacy
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react-hooks/exhaustive-deps': 'error',

      // Deprecated Library & Architecture Import Enforcements
      'no-restricted-imports': restrictedImportsRule,
    },
  },
  // Component-level tokens enforcement
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'm3-tokens': m3TokensPlugin,
    },
    rules: {
      'no-restricted-syntax': ['error', ...restrictedSyntaxRules],
      'm3-tokens/no-hardcoded-colors': 'error',
      'm3-tokens/enforce-motion-tokens': 'error',
      'm3-tokens/enforce-shape-tokens': 'error',
      'm3-tokens/enforce-typography-tokens': 'error',
    },
  },
  {
    files: ['src/tokens/**/*.{ts,tsx}', 'src/theme/**/*.{ts,tsx}'],
    rules: {
      'm3-tokens/no-hardcoded-colors': 'off',
    },
  },
  createA11yConfig(jsxA11yPlugin),
  // Astro component rules & overrides
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    rules: {
      // In Astro templates, allow intrinsic HTML tags while enforcing no hardcoded content and clean styles
      'no-restricted-syntax': ['error', ...restrictedSyntaxRules.slice(1)],
    },
  },
  // CSS Design Token & Hygiene enforcement
  {
    files: ['**/*.css'],
    language: 'css/css',
    ...css.configs.recommended,
    plugins: {
      ...css.configs.recommended.plugins,
      'css-tokens': cssTokensPlugin,
    },
    rules: {
      ...css.configs.recommended.rules,
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
      'css/prefer-logical-properties': 'error',
      'css/selector-complexity': ['error', { maxCompounds: 4, maxCombinators: 3 }],
      'css/use-baseline': 'error',
      'css-tokens/no-unscoped-component-override': 'error',
      'css-tokens/no-scoped-important': 'error',
      'css-tokens/no-raw-colors': 'error',
      'css-tokens/no-unperformant-transitions': 'error',
      'css-tokens/no-raw-font-family': 'error',
      'css-tokens/no-tailwind-directives': 'error',
    },
  },
  // Theme definitions are the designated source of truth for raw colors and fonts
  {
    files: ['src/theme/**/*.css'],
    rules: {
      'css-tokens/no-raw-colors': 'off',
      'css-tokens/no-raw-font-family': 'off',
    },
  },
]);
