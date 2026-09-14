/**
 * Strict Semantic Fenced Divs & Zero-HTML Enforcement Plugin
 *
 * Enforces strict separation of semantics from style:
 * 1. Prohibits raw HTML and JSX tags in Markdown/MDX content files.
 * 2. Enforces Pandoc-style fenced containers (`:::callout`, `:::hero`, `:::card`).
 * 3. Enforces an approved semantic whitelist.
 * 4. Automatically injects WCAG 2.2 AA accessibility roles and Material Design 3 / clean CSS classes.
 * 5. Translates semantic component directives (::season-hero, ::hero-ticker, ::hold-button) into components.
 */

import path from 'node:path';
import { visit } from 'unist-util-visit';

const APPROVED_SEMANTIC_CONTAINERS = new Map([
  [
    'callout',
    {
      tag: 'aside',
      className: ['doc-callout'],
      role: 'note',
    },
  ],
  [
    'note',
    {
      tag: 'aside',
      className: ['doc-callout', 'doc-callout--note'],
      role: 'note',
    },
  ],
  [
    'warning',
    {
      tag: 'aside',
      className: ['doc-callout', 'doc-callout--warning'],
      role: 'alert',
    },
  ],
  [
    'subtitle',
    {
      tag: 'p',
      className: ['doc-subtitle', 'subtitle'],
      role: null,
    },
  ],
  [
    'footer',
    {
      tag: 'footer',
      className: ['doc-footer-container'],
      role: 'contentinfo',
    },
  ],
  [
    'hero',
    {
      tag: 'header',
      className: ['hero-container'],
      role: null,
    },
  ],
  [
    'badge',
    {
      tag: 'div',
      className: ['hero-badge'],
      role: 'status',
    },
  ],
  [
    'features',
    {
      tag: 'section',
      className: ['features-grid'],
      role: 'region',
    },
  ],
  [
    'card',
    {
      tag: 'article',
      className: ['feature-card'],
      role: null,
    },
  ],
]);

const HTML_TAG_REGEX = /<\/?([a-zA-Z][a-zA-Z0-9-]*)/;

export function remarkFencedDivsPlugin() {
  return (tree, file) => {
    let hasInjectedReaptiImports = false;
    let hasInjectedSeasonHeroImports = false;
    let hasInjectedMiddleSectionImports = false;
    const filePath = file.path || file.history?.[0] || 'document';

    visit(tree, (node) => {
      // 1. Enforce Zero Raw HTML Tags in Markdown
      if (node.type === 'html') {
        const rawValue = (node.value || '').trim();
        // Allow HTML comments
        if (rawValue.startsWith('<!--') && rawValue.endsWith('-->')) {
          return;
        }

        const match = HTML_TAG_REGEX.exec(rawValue);
        if (match) {
          const tagName = match[1];
          throw new Error(
            `[Markdown Semantic Violation in ${filePath}]: Raw HTML tag '<${tagName}>' is prohibited. ` +
              `Content files must be purely semantic. Use standard Markdown syntax or Pandoc fenced divs (:::callout, :::card, :::hero).`,
          );
        }
      }

      // 2. Enforce Zero Raw JSX Elements in MDX (Must use directives instead)
      if (
        (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
        !node.data?.isGeneratedDirective
      ) {
        const tagName = node.name || 'Component';
        throw new Error(
          `[Markdown Semantic Violation in ${filePath}]: Raw JSX element '<${tagName}>' is prohibited. ` +
            `Content files must be purely semantic. Move infrastructure providers to Layout.astro and use Pandoc fenced divs (:::card, ::season-hero, ::hero-ticker, ::hold-button).`,
        );
      }

      // 3. Process Component Directives (Leaf Directives)
      if (node.type === 'leafDirective') {
        const directiveName = (node.name || '').toLowerCase();

        if (directiveName === 'season-hero' || directiveName === 'seasonhero') {
          const attrs = node.attributes || {};
          const locale = attrs.locale || 'en';
          const prefix = attrs.prefix;
          const brand = attrs.brand;
          const brandSuffix = attrs.brandsuffix || attrs.brandSuffix;
          const suffix = attrs.suffix;
          const phrasesRaw = attrs.phrases;
          const phrases = phrasesRaw ? phrasesRaw.split(',').map((p) => p.trim()) : undefined;

          node.type = 'mdxJsxFlowElement';
          node.name = 'SeasonHero';
          const mdxAttributes = [
            { type: 'mdxJsxAttribute', name: 'client:only', value: 'react' },
            { type: 'mdxJsxAttribute', name: 'locale', value: locale },
          ];
          if (prefix) {
            mdxAttributes.push({ type: 'mdxJsxAttribute', name: 'prefix', value: prefix });
          }
          if (brand) {
            mdxAttributes.push({ type: 'mdxJsxAttribute', name: 'brand', value: brand });
          }
          if (brandSuffix) {
            mdxAttributes.push({
              type: 'mdxJsxAttribute',
              name: 'brandSuffix',
              value: brandSuffix,
            });
          }
          if (suffix) {
            mdxAttributes.push({ type: 'mdxJsxAttribute', name: 'suffix', value: suffix });
          }
          if (phrases) {
            mdxAttributes.push({
              type: 'mdxJsxAttribute',
              name: 'phrases',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: JSON.stringify(phrases),
                data: {
                  estree: {
                    type: 'Program',
                    sourceType: 'module',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'ArrayExpression',
                          elements: phrases.map((p) => ({
                            type: 'Literal',
                            value: p,
                            raw: JSON.stringify(p),
                          })),
                        },
                      },
                    ],
                  },
                },
              },
            });
          }

          node.attributes = mdxAttributes;
          node.children = [];
          node.data = { isGeneratedDirective: true };

          injectSeasonHeroImports(tree, filePath);
          return;
        }

        if (
          directiveName === 'middle-section' ||
          directiveName === 'middlesection' ||
          directiveName === 'aptitek-section' ||
          directiveName === 'aptiteksection'
        ) {
          const attrs = node.attributes || {};
          const locale = attrs.locale || 'fr';

          node.type = 'mdxJsxFlowElement';
          node.name = 'MiddleSection';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'client:only', value: 'react' },
            { type: 'mdxJsxAttribute', name: 'locale', value: locale },
          ];
          node.children = [];
          node.data = { isGeneratedDirective: true };

          injectMiddleSectionImports(tree, filePath);
          return;
        }

        if (directiveName === 'hero-ticker' || directiveName === 'heroticker') {
          const attrs = node.attributes || {};
          const prefix = attrs.prefix || 'Welcome to';
          const phrasesRaw = attrs.phrases || 'Aptitek 04, Astro Performance, Reapti Integration';
          const phrases = phrasesRaw.split(',').map((p) => p.trim());
          const suffix = attrs.suffix || 'platform.';

          node.type = 'mdxJsxFlowElement';
          node.name = 'HeroTicker';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'client:only', value: 'react' },
            { type: 'mdxJsxAttribute', name: 'prefix', value: prefix },
            {
              type: 'mdxJsxAttribute',
              name: 'phrases',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: JSON.stringify(phrases),
                data: {
                  estree: {
                    type: 'Program',
                    sourceType: 'module',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'ArrayExpression',
                          elements: phrases.map((p) => ({
                            type: 'Literal',
                            value: p,
                            raw: JSON.stringify(p),
                          })),
                        },
                      },
                    ],
                  },
                },
              },
            },
            { type: 'mdxJsxAttribute', name: 'suffix', value: suffix },
          ];
          node.children = [];
          node.data = { isGeneratedDirective: true };

          injectReaptiImports(tree);
          return;
        }

        if (directiveName === 'hold-button' || directiveName === 'holdbutton') {
          const attrs = node.attributes || {};
          const holdingTime = Number(attrs.holdingTime || attrs.holdingtime || 1500);
          const label = attrs.label || 'Hold to Verify Architecture';

          node.type = 'mdxJsxFlowElement';
          node.name = 'HoldButton';
          node.attributes = [
            { type: 'mdxJsxAttribute', name: 'client:only', value: 'react' },
            {
              type: 'mdxJsxAttribute',
              name: 'holdingTime',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: String(holdingTime),
                data: {
                  estree: {
                    type: 'Program',
                    sourceType: 'module',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'Literal',
                          value: holdingTime,
                          raw: String(holdingTime),
                        },
                      },
                    ],
                  },
                },
              },
            },
          ];
          node.children = [
            {
              type: 'text',
              value: label,
            },
          ];
          node.data = { isGeneratedDirective: true };

          injectReaptiImports(tree);
          return;
        }
      }

      // 4. Process Container Directives (Pandoc Fenced Divs)
      if (node.type === 'containerDirective') {
        const directiveName = node.name.toLowerCase();
        const config = APPROVED_SEMANTIC_CONTAINERS.get(directiveName);

        if (!config) {
          const allowedList = [
            ...APPROVED_SEMANTIC_CONTAINERS.keys(),
            'season-hero',
            'hero-ticker',
            'hold-button',
            'middle-section',
            'aptitek-section',
          ].join(', ');
          throw new Error(
            `[Markdown Semantic Violation in ${filePath}]: ` +
              `Unknown or unapproved fenced div ':::${node.name}'. ` +
              `Only semantic containers are allowed: [${allowedList}]. ` +
              `Styles and unapproved directives are strictly prohibited.`,
          );
        }

        node.data = node.data || {};
        node.data.hName = config.tag;
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.className = [...config.className];
        if (config.role) {
          node.data.hProperties.role = config.role;
        }

        // Special handling for `:::card{title="..."}` feature cards
        if (directiveName === 'card') {
          const attrs = node.attributes || {};
          const cardTitle = attrs.title || '';
          const cardChildren = [];

          if (cardTitle) {
            cardChildren.push({
              type: 'heading',
              depth: 3,
              data: {
                hName: 'h3',
                hProperties: { className: ['feature-card__title'] },
              },
              children: [{ type: 'text', value: cardTitle }],
            });
          }

          for (const child of node.children) {
            if (child.type === 'paragraph') {
              child.data = child.data || {};
              child.data.hProperties = child.data.hProperties || {};
              child.data.hProperties.className = ['feature-card__description'];
            }
            cardChildren.push(child);
          }

          node.children = cardChildren;
          return;
        }
      }
    });

    function injectSeasonHeroImports(rootTree, currentFilePath) {
      if (hasInjectedSeasonHeroImports) return;
      hasInjectedSeasonHeroImports = true;

      const hasImport = rootTree.children.some(
        (child) =>
          child.type === 'mdxjsEsm' &&
          typeof child.value === 'string' &&
          child.value.includes('SeasonHero'),
      );

      if (!hasImport) {
        const targetFile = path.resolve('src/theme/index.ts');
        const fromDir =
          currentFilePath && currentFilePath !== 'document'
            ? path.dirname(path.resolve(currentFilePath))
            : path.resolve('src/pages');
        let relPath = path.relative(fromDir, targetFile).replace(/\\/g, '/');
        if (!relPath.startsWith('.')) {
          relPath = './' + relPath;
        }

        rootTree.children.unshift({
          type: 'mdxjsEsm',
          value: `import { SeasonHero } from '${relPath}';`,
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ImportDeclaration',
                  specifiers: [
                    {
                      type: 'ImportSpecifier',
                      imported: { type: 'Identifier', name: 'SeasonHero' },
                      local: { type: 'Identifier', name: 'SeasonHero' },
                    },
                  ],
                  source: {
                    type: 'Literal',
                    value: relPath,
                    raw: JSON.stringify(relPath),
                  },
                },
              ],
            },
          },
        });
      }
    }

    function injectMiddleSectionImports(rootTree, currentFilePath) {
      if (hasInjectedMiddleSectionImports) return;
      hasInjectedMiddleSectionImports = true;

      const hasImport = rootTree.children.some(
        (child) =>
          child.type === 'mdxjsEsm' &&
          typeof child.value === 'string' &&
          (child.value.includes('MiddleSection') || child.value.includes('AptitekSection')),
      );

      if (!hasImport) {
        const targetFile = path.resolve('src/components/MiddleSection.tsx');
        const fromDir =
          currentFilePath && currentFilePath !== 'document'
            ? path.dirname(path.resolve(currentFilePath))
            : path.resolve('src/pages');
        let relPath = path.relative(fromDir, targetFile).replace(/\\/g, '/');
        if (!relPath.startsWith('.')) {
          relPath = './' + relPath;
        }

        rootTree.children.unshift({
          type: 'mdxjsEsm',
          value: `import { MiddleSection } from '${relPath}';`,
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ImportDeclaration',
                  specifiers: [
                    {
                      type: 'ImportSpecifier',
                      imported: { type: 'Identifier', name: 'MiddleSection' },
                      local: { type: 'Identifier', name: 'MiddleSection' },
                    },
                  ],
                  source: {
                    type: 'Literal',
                    value: relPath,
                    raw: JSON.stringify(relPath),
                  },
                },
              ],
            },
          },
        });
      }
    }

    function injectReaptiImports(rootTree) {
      if (hasInjectedReaptiImports) return;
      hasInjectedReaptiImports = true;

      const hasImport = rootTree.children.some(
        (child) =>
          child.type === 'mdxjsEsm' &&
          typeof child.value === 'string' &&
          child.value.includes("from 'reapti'"),
      );

      if (!hasImport) {
        rootTree.children.unshift({
          type: 'mdxjsEsm',
          value: "import { HeroTicker, HoldButton } from 'reapti';",
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ImportDeclaration',
                  specifiers: [
                    {
                      type: 'ImportSpecifier',
                      imported: { type: 'Identifier', name: 'HeroTicker' },
                      local: { type: 'Identifier', name: 'HeroTicker' },
                    },
                    {
                      type: 'ImportSpecifier',
                      imported: { type: 'Identifier', name: 'HoldButton' },
                      local: { type: 'Identifier', name: 'HoldButton' },
                    },
                  ],
                  source: {
                    type: 'Literal',
                    value: 'reapti',
                    raw: "'reapti'",
                  },
                },
              ],
            },
          },
        });
      }
    }
  };
}

export default remarkFencedDivsPlugin;
