import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { useTranslations } from '../../src/i18n/index.ts';
import { MiddleSection } from '../../src/components/MiddleSection.tsx';

describe('MiddleSection Component & Translations', () => {
  it('exports MiddleSection correctly', () => {
    expect(MiddleSection).toBeDefined();
  });

  it('provides complete French translations for the middle section', () => {
    const tFr = useTranslations('fr');
    expect(tFr.aptitekBrandAlt).toBe('Aptitek');
    expect(tFr.middleIntroTitle).toContain("La formation tech qui vous fait gagner de l'XP");
    expect(tFr.middleIntroTitle).toContain('Explorez votre arbre de talents');
    expect(tFr.middleIntroSubtitle).toContain('Aptitek transforme');
    expect(tFr.middleIntroSubtitle).toContain('parcours interactif');
    expect(tFr.middlePartnerTitle).toContain("Le réseau d'écoles engagées");
    expect(tFr.middlePartnerAria).toBe('Carrousel des écoles et universités partenaires');
    expect(tFr.partnerEstiam).toBe('ESTIAM');
    expect(tFr.partnerGema).toBe('GEMA');
    expect(tFr.partnerIpi).toBe('IPI');
    expect(tFr.partnerIpssi).toBe('IPSSI');
    expect(tFr.partnerScienceU).toBe('Sciences-U Lyon');
    expect(tFr.partnerYnov).toBe('Ynov Campus');
  });

  it('provides complete English translations for the middle section', () => {
    const tEn = useTranslations('en');
    expect(tEn.aptitekBrandAlt).toBe('Aptitek');
    expect(tEn.middleIntroTitle).toContain('The tech training that earns you XP');
    expect(tEn.middleIntroTitle).toContain('Explore your talent tree');
    expect(tEn.middleIntroSubtitle).toContain('Aptitek transforms technical learning');
    expect(tEn.middlePartnerTitle).toContain('The network of schools engaged');
    expect(tEn.middlePartnerAria).toBe('Partner schools and universities carousel');
    expect(tEn.partnerEstiam).toBe('ESTIAM');
    expect(tEn.partnerGema).toBe('GEMA');
    expect(tEn.partnerIpi).toBe('IPI');
    expect(tEn.partnerIpssi).toBe('IPSSI');
    expect(tEn.partnerScienceU).toBe('Sciences-U Lyon');
    expect(tEn.partnerYnov).toBe('Ynov Campus');
  });
});

describe('MiddleSection Assets & Integration', () => {
  it('verifies existence of all partner school logo SVGs in public/logo', () => {
    const logos = [
      'estiam.svg',
      'gema.svg',
      'ipi.svg',
      'ipssi.svg',
      'science-u-logo.svg',
      'ynov.svg',
    ];
    for (const logo of logos) {
      const logoPath = resolve(process.cwd(), 'public/logo', logo);
      expect(existsSync(logoPath)).toBe(true);
    }
  });

  it('verifies existence of big Aptitek brand logo in public', () => {
    const brandLogoPath = resolve(process.cwd(), 'public/aptitek-logo.svg');
    expect(existsSync(brandLogoPath)).toBe(true);
  });

  it('ensures global.css defines necessary M3E styles for MiddleSection and Marquee', () => {
    const cssPath = resolve(process.cwd(), 'src/styles/global.css');
    const css = readFileSync(cssPath, 'utf-8');

    expect(css).toContain('.aptitek-middle-section');
    expect(css).toContain('.aptitek-intro-h1');
    expect(css).toContain('.aptitek-intro-h2');
    expect(css).toContain('.partner-carousel-section');
    expect(css).toContain('.partner-marquee-track');
    expect(css).toContain('.partner-logo-card');
    expect(css).toContain('@keyframes partner_marquee');
  });

  it('ensures index.mdx and fr/index.mdx reference aptitek-section directive below hero', () => {
    const frMdxPath = resolve(process.cwd(), 'src/pages/fr/index.mdx');
    const enMdxPath = resolve(process.cwd(), 'src/pages/index.mdx');

    const frMdx = readFileSync(frMdxPath, 'utf-8');
    const enMdx = readFileSync(enMdxPath, 'utf-8');

    expect(frMdx).toContain('::aptitek-section{locale="fr"}');
    expect(enMdx).toContain('::aptitek-section{locale="en"}');
  });

  it('verifies that partner schools have valid official or Lyon campus links', () => {
    const fileContent = readFileSync(
      resolve(process.cwd(), 'src/components/MiddleSection.tsx'),
      'utf-8',
    );
    expect(fileContent).toContain('https://www.estiam.education/');
    expect(fileContent).toContain('https://www.groupe-gema.com/campus/lyon/');
    expect(fileContent).toContain('https://www.ipi-ecoles.com/lyon/');
    expect(fileContent).toContain('https://ecole-ipssi.com/#');
    expect(fileContent).toContain('https://www.sciences-u-lyon.fr/');
    expect(fileContent).toContain('https://www.ynov.com/campus/lyon/');
  });
});
