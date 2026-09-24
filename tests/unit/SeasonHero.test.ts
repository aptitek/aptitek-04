import { describe, it, expect } from 'vitest';
import { useTranslations } from '../../src/i18n/index.ts';

describe('SeasonHero copy & i18n specifications', () => {
  it('supplies French copy with Petit Apti and fait son nid', () => {
    const tFr = useTranslations('fr');
    expect(tFr.heroPrefix).toBe('Petit');
    expect(tFr.heroBrand).toBe('Apti');
    expect(tFr.heroSuffix).toBe('fait son nid !');
    expect(tFr.heroPhrases).toContain('le savoir');
    expect(tFr.heroPhrases).toContain('le talent');
  });

  it('supplies English copy with Step by step Apti-tude for ... takes its flight', () => {
    const tEn = useTranslations('en');
    expect(tEn.heroPrefix).toBe('Step by step,');
    expect(tEn.heroBrand).toBe('Apti');
    expect(tEn.heroBrandSuffix).toBe('-tude for');
    expect(tEn.heroSuffix).toBe('takes its flight !');
    expect(tEn.heroPhrases).toContain('knowledge');
    expect(tEn.heroPhrases).toContain('talent');
  });

  it('provides localized season names', () => {
    const tFr = useTranslations('fr');
    const tEn = useTranslations('en');

    expect(tFr.spring).toBe('Printemps');
    expect(tFr.summer).toBe('Été');
    expect(tFr.fall).toBe('Automne');
    expect(tFr.winter).toBe('Hiver');

    expect(tEn.spring).toBe('Spring');
    expect(tEn.summer).toBe('Summer');
    expect(tEn.fall).toBe('Fall');
    expect(tEn.winter).toBe('Winter');
  });

  it('ensures brand-name-milkshake enforces font-style: normal and neutral font-variation-settings in global.css', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const cssPath = resolve(process.cwd(), 'src/styles/global.css');
    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toMatch(/\.brand-name-milkshake\s*\{[^}]*font-style:\s*normal;/);
    expect(css).toMatch(/\.brand-name-milkshake\s*\{[^}]*font-variation-settings:\s*normal;/);
  });
});

describe('SeasonHero season progress & rendering', () => {
  it('defaults season background in SeasonHero to the current northern hemisphere season', async () => {
    const { createElement } = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { SeasonHero } = await import('../../src/theme/SeasonHero.tsx');
    const { getNorthernHemisphereSeasonProgress } = await import('reapti');

    const html = renderToStaticMarkup(createElement(SeasonHero, { locale: 'en' }));
    const expectedProgress = getNorthernHemisphereSeasonProgress().toFixed(2);
    expect(html).toContain(`data-season-progress="${expectedProgress}"`);
  });

  it('respects explicit season override in SeasonHero', async () => {
    const { createElement } = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { SeasonHero } = await import('../../src/theme/SeasonHero.tsx');

    const html = renderToStaticMarkup(
      createElement(SeasonHero, { locale: 'en', season: 'winter' }),
    );
    expect(html).toContain('data-season-progress="3.00"');
  });

  it('does not render manual slider card dock on top of background', async () => {
    const { createElement } = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { SeasonHero } = await import('../../src/theme/SeasonHero.tsx');

    const html = renderToStaticMarkup(createElement(SeasonHero, { locale: 'en' }));
    expect(html).not.toContain('season-slider-dock');
    expect(html).not.toContain('season-m3e-slider');
  });
});
