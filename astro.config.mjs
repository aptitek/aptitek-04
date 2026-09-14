// @ts-check
import path from 'node:path';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import { remarkFencedDivsPlugin } from './scripts/remark/fenced-divs.js';

const reaptiPath = path.resolve('packages/reapti');

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/formations': '/classes',
    '/a-propos': '/about',
    '/fr/classes': '/fr/formations',
    '/fr/about': '/fr/a-propos',
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkFencedDivsPlugin],
    }),
  },
  integrations: [react(), mdx()],
  vite: {
    resolve: {
      alias: [
        {
          find: 'reapti/style.css',
          replacement: path.join(reaptiPath, 'dist/style.css'),
        },
        {
          find: 'reapti',
          replacement: path.join(reaptiPath, 'src/index.ts'),
        },
      ],
      dedupe: ['react', 'react-dom'],
    },
    server: {
      fs: {
        allow: ['.', reaptiPath],
      },
      watch: {
        ignored: ['!**/packages/reapti/**'],
      },
    },
    optimizeDeps: {
      exclude: ['reapti'],
    },
  },
});
