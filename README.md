# aptitek-04

A modern web application built with [Astro](https://astro.build/) and powered by the [`reapti`](file:///home/aptitek/50-59_Code/51_Websites/aptitek-04/packages/reapti) design system and component library (integrated as a git submodule in `packages/reapti`).

## Features

- **Astro Core**: Zero-JS static site generation with selective React island hydration.
- **Strict ESLint++ Architecture**: Enforces cognitive complexity bounds, WCAG 2.2 AA accessibility, CSS design tokens, and clean separation of concerns.
- **Reapti Component Ecosystem**: Seamlessly integrates Material Design 3 components, interactive animations, and responsive navigation rails.
- **Wireit Pipelines**: Incremental, cached build, lint, and test execution with automated submodule compilation.

## Getting Started

Clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/aptitek/aptitek-04.git
```

Install dependencies:

```bash
pnpm install
```

Build the `reapti` submodule library:

```bash
pnpm run build:reapti
```

Start the local development server:

```bash
pnpm run dev
```

## Quality Assurance & Pipelines

- `pnpm run lint`: Run the full linting suite (ESLint, Prettier, Markdown, Knip, TypeScript).
- `pnpm run build`: Generate optimized production build via Wireit.
- `pnpm run test`: Run unit tests and Playwright end-to-end tests.
