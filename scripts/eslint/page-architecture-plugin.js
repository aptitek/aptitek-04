/**
 * Page Architecture Enforcement Plugin
 * Enforces that all pages in src/pages are written as MDX (.mdx) files,
 * prohibiting .astro page files in favor of content purity, i18n structure,
 * and centralized layout components.
 */

export const pageArchitecturePlugin = {
  meta: { name: 'eslint-plugin-page-architecture' },
  rules: {
    'no-astro-pages': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Prohibit .astro files in src/pages in favor of pure semantic MDX (.mdx) pages.',
        },
        messages: {
          forbiddenAstroPage:
            'Astro page "{{filename}}" is forbidden. All pages in src/pages must be written as MDX (.mdx) files for content purity and separation of concerns. Configure redirects in astro.config.mjs.',
        },
        schema: [],
      },
      create(context) {
        const filename =
          context.filename ||
          (typeof context.getFilename === 'function' ? context.getFilename() : '');
        const normalized = filename.replace(/\\/g, '/');

        if (normalized.includes('/src/pages/') && normalized.endsWith('.astro')) {
          return {
            Program(node) {
              context.report({
                node,
                messageId: 'forbiddenAstroPage',
                data: {
                  filename: normalized.split('/src/pages/')[1] || filename,
                },
              });
            },
          };
        }
        return {};
      },
    },
  },
};
