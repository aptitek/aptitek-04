import { defineConfig } from '@pandacss/dev';
import { md3Tokens, md3SemanticTokens } from './src/tokens/md3.ts';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}', './pages/**/*.{js,jsx,ts,tsx,astro}'],

  // Files to exclude
  exclude: [],

  // Material Design 3 Theme Customization
  theme: {
    extend: {
      tokens: md3Tokens,
      semanticTokens: md3SemanticTokens,
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',

  // Enable React JSX atomic components (Box, Flex, Stack, Grid, etc.)
  jsxFramework: 'react',
  jsxFactory: 'panda',
});
