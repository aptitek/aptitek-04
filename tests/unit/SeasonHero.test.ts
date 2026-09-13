import { describe, it, expect } from 'vitest';
import { useTranslations } from '../../src/i18n/index.ts';

describe('SeasonHero & i18n specifications', () => {
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

  it('provides localized season names and slider aria labels', () => {
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

    expect(tFr.seasonSliderAriaLabel).toBeTruthy();
    expect(tEn.seasonSliderAriaLabel).toBeTruthy();
  });
});
