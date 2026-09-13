import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'dist/**',
        '.astro/**',
        'storybook-static/**',
        '**/*.stories.*',
        '**/*.config.*',
        '.storybook/**',
      ],
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.{test,spec}.{ts,tsx}'],
          environment: 'node',
        },
      },
    ],
  },
});
