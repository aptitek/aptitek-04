# Rule: Pure MDX Pages Architecture (No .astro Pages)

## Purpose & Architectural Principle
In this project, all user-facing pages must be authored as MDX (`.mdx`) files rather than `.astro` files. This enforces:
1. **Semantic Content Purity**: Page files remain purely declarative, containing semantic markdown, MDX components, and structured frontmatter.
2. **Separation of Concerns**: Presentation, layout wrappers, and navigation chrome live in `src/layouts/` (e.g. `src/layouts/Layout.astro`) and React/MD3 components (`src/components/`), rather than inline template scripts.
3. **i18n Symmetry**: Content pages in `src/pages/` and `src/pages/fr/` are strictly structured as MDX documents with identical frontmatter schemas.

## Requirements & Constraints

### 1. No `.astro` Pages in `src/pages/`
- **NEVER** create `.astro` files inside `src/pages/` (e.g., `src/pages/example.astro` or `src/pages/fr/example.astro`).
- Always use `.mdx` for page definitions (e.g., `src/pages/example.mdx`).
- Specify layout via frontmatter:
  ```yaml
  ---
  layout: ../layouts/Layout.astro
  title: "Page Title"
  description: "Page description"
  locale: "en"
  ---
  ```

### 2. Centralized URL Redirects in `astro.config.mjs`
- **NEVER** create redirect stub files in `src/pages/` (such as `return Astro.redirect('/target')`).
- Configure all route aliases and canonical redirects in `astro.config.mjs` under the `redirects` key:
  ```javascript
  export default defineConfig({
    redirects: {
      '/formations': '/classes',
      '/a-propos': '/about',
      '/fr/classes': '/fr/formations',
      '/fr/about': '/fr/a-propos',
    },
    // ...
  });
  ```

### 3. Automated Enforcement
This rule is strictly enforced by:
- **ESLint**: `page-architecture/no-astro-pages` flags any `.astro` file under `src/pages/**`.
- **Lint MDX**: `pnpm lint:mdx` scans `src/pages/` and halts on any `.astro` files.
- **Unit Tests**: `tests/unit/pages-architecture.test.ts` validates that 100% of pages in `src/pages/` are `.mdx`.
