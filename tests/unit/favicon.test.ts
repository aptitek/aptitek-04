import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Favicon & App Icon Assets', () => {
  const publicDir = resolve(process.cwd(), 'public');

  it('provides high-visibility SVG favicon with squircle badge', () => {
    const svgPath = resolve(publicDir, 'favicon.svg');
    expect(existsSync(svgPath)).toBe(true);

    const svgContent = readFileSync(svgPath, 'utf8');
    expect(svgContent).toContain('<svg');
    expect(svgContent).toContain('rx="112"');
    expect(svgContent).toContain('#002b36');
    expect(svgContent).toContain('#2aa198');
  });

  it('provides multi-resolution raster icons for retina and standard tabs', () => {
    expect(existsSync(resolve(publicDir, 'favicon-16x16.png'))).toBe(true);
    expect(existsSync(resolve(publicDir, 'favicon-32x32.png'))).toBe(true);
    expect(existsSync(resolve(publicDir, 'favicon.ico'))).toBe(true);
  });

  it('provides apple-touch-icon for iOS web clips', () => {
    expect(existsSync(resolve(publicDir, 'apple-touch-icon.png'))).toBe(true);
  });

  it('links all favicon formats and apple-touch-icon in Layout.astro', () => {
    const layoutPath = resolve(process.cwd(), 'src/layouts/Layout.astro');
    const layoutContent = readFileSync(layoutPath, 'utf8');

    expect(layoutContent).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
    expect(layoutContent).toContain(
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />',
    );
    expect(layoutContent).toContain(
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />',
    );
    expect(layoutContent).toContain(
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
    );
    expect(layoutContent).toContain('<link rel="shortcut icon" href="/favicon.ico" />');
  });
});
