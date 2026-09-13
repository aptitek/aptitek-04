import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Rule } from 'eslint';
import { pageArchitecturePlugin } from '../../scripts/eslint/page-architecture-plugin.js';

function collectFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        collectFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }
  } catch {
    // ignore missing directory
  }
  return fileList;
}

interface MockReportDescriptor {
  messageId: string;
  data?: Record<string, string>;
}

function createMockContext(filename: string, reports: MockReportDescriptor[]) {
  return {
    filename,
    report: (descriptor: MockReportDescriptor) => {
      reports.push(descriptor);
    },
  } as unknown as Rule.RuleContext;
}

describe('Pages Architecture: File System Invariants', () => {
  const pagesDir = resolve(process.cwd(), 'src/pages');
  const allPageFiles = collectFiles(pagesDir);

  it('contains zero .astro files in src/pages directory', () => {
    const astroFiles = allPageFiles.filter((f) => f.endsWith('.astro'));
    expect(astroFiles).toEqual([]);
  });

  it('ensures all page files in src/pages are .mdx files', () => {
    expect(allPageFiles.length).toBeGreaterThan(0);
    const nonMdxFiles = allPageFiles.filter((f) => !f.endsWith('.mdx'));
    expect(nonMdxFiles).toEqual([]);
  });
});

describe('Pages Architecture: ESLint Rule Verification', () => {
  const rule = pageArchitecturePlugin.rules['no-astro-pages'];

  it('exports the no-astro-pages ESLint rule with descriptive error message', () => {
    expect(rule).toBeDefined();
    expect(rule.meta.messages.forbiddenAstroPage).toBeDefined();
    expect(rule.meta.messages.forbiddenAstroPage).toContain(
      'All pages in src/pages must be written as MDX',
    );
  });

  it('reports a lint violation when given a file in src/pages with .astro extension', () => {
    const reports: MockReportDescriptor[] = [];
    const mockContext = createMockContext('/workspace/src/pages/example.astro', reports);

    const visitor = rule.create(mockContext);
    expect(visitor.Program).toBeDefined();
    visitor.Program?.({} as unknown as Rule.Node);

    expect(reports.length).toBe(1);
    expect(reports[0]).toMatchObject({
      messageId: 'forbiddenAstroPage',
      data: { filename: 'example.astro' },
    });
  });

  it('does not report violations for .astro files outside src/pages', () => {
    const reports: MockReportDescriptor[] = [];
    const mockContext = createMockContext('/workspace/src/layouts/Layout.astro', reports);

    const visitor = rule.create(mockContext);
    expect(visitor.Program).toBeUndefined();
    expect(reports.length).toBe(0);
  });

  it('does not report violations for .mdx files in src/pages', () => {
    const reports: MockReportDescriptor[] = [];
    const mockContext = createMockContext('/workspace/src/pages/index.mdx', reports);

    const visitor = rule.create(mockContext);
    expect(visitor.Program).toBeUndefined();
    expect(reports.length).toBe(0);
  });
});
