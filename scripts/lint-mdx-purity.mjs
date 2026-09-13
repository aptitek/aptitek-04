#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FORBIDDEN_PATTERNS = [
  { regex: /style\s*=\s*[{'"]/i, label: 'Inline style attribute' },
  { regex: /className\s*=\s*[{'"]/i, label: 'className attribute' },
  { regex: /class\s*=\s*[{'"]/i, label: 'class attribute' },
  { regex: /<style[\s>]/i, label: '<style> tag' },
  {
    regex: /import\s+.*['"]styled-system.*['"]/i,
    label: 'styled-system import',
  },
  { regex: /import\s+.*\.css['"]/i, label: 'CSS stylesheet import' },
];

function findMdxFiles(dir, fileList = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (
      entry.startsWith('.') ||
      entry === 'node_modules' ||
      entry === 'dist' ||
      entry === 'storybook-static' ||
      entry === 'packages'
    ) {
      continue;
    }
    const fullPath = join(dir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findMdxFiles(fullPath, fileList);
      } else if (entry.endsWith('.mdx')) {
        fileList.push(fullPath);
      }
    } catch {
      // Ignore transient files deleted during concurrent tasks
    }
  }
  return fileList;
}

const targetFiles =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2).map((f) => resolve(process.cwd(), f))
    : findMdxFiles(process.cwd());

let violationCount = 0;

for (const filePath of targetFiles) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const { regex, label } of FORBIDDEN_PATTERNS) {
      if (regex.test(line)) {
        console.error(
          `❌ [MDX Purity Error] ${filePath}:${index + 1} - ${label} detected: "${line.trim()}"`,
        );
        console.error(
          '   Violation: MDX files must be pure semantic content. Styling is strictly forbidden.',
        );
        violationCount++;
      }
    }
  });
}

function findAstroPages(dir, fileList = []) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findAstroPages(fullPath, fileList);
      } else if (entry.endsWith('.astro')) {
        fileList.push(fullPath);
      }
    }
  } catch {
    // Directory might not exist in some contexts
  }
  return fileList;
}

const pagesDir = resolve(process.cwd(), 'src/pages');
const forbiddenAstroPages = findAstroPages(pagesDir);
for (const pagePath of forbiddenAstroPages) {
  console.error(`❌ [Page Architecture Error] Forbidden .astro page found: ${pagePath}`);
  console.error(
    '   Violation: All pages in src/pages must be written as MDX (.mdx) files. Configure redirects in astro.config.mjs.',
  );
  violationCount++;
}

if (violationCount > 0) {
  console.error(
    `\nFatal: Found ${violationCount} violation(s) in MDX content & page architecture.`,
  );
  process.exit(1);
} else {
  console.log(
    `✅ MDX content purity & page architecture verified across ${targetFiles.length} file(s).`,
  );
}
