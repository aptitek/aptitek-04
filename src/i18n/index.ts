/**
 * Application Internationalization (i18n) Module
 *
 * Centralizes all user-facing strings, defaults, and translations.
 * Prevents hardcoding of natural language copy in layouts and components.
 */

const DEFAULT_LOCALE = 'en';

const translations = {
  en: {
    siteTitle: 'Aptitek 04 - Modern Web Architecture',
    siteDescription:
      'High performance modular web architecture combining Astro, React, and Reapti.',
    heroPrefix: 'Step by step,',
    heroBrand: 'Apti',
    heroBrandSuffix: '-tude for',
    heroPhrases: ['knowledge', 'talent', 'craftsmanship', 'ingenuity', 'passion'],
    heroSuffix: 'takes its flight !',
    holdButtonLabel: 'Hold to Verify Architecture',
    themeToggleAriaLabel: 'Toggle dark or light mode',
    seasonSliderAriaLabel: 'Seasonal cycle progress control',
    seasonProgressLabel: 'Season Cycle',
    spring: 'Spring',
    summer: 'Summer',
    fall: 'Fall',
    winter: 'Winter',
    localeSwitchLabel: 'FR',
    localeSwitchAriaLabel: 'Passer en français',
  },
  fr: {
    siteTitle: 'Aptitek 04 — Architecture Web Moderne',
    siteDescription:
      'Architecture web modulaire haute performance combinant Astro, React et Reapti.',
    heroPrefix: 'Petit',
    heroBrand: 'Apti',
    heroBrandSuffix: '',
    heroPhrases: ['le savoir', 'le talent', "l'artisanat", "l'ingéniosité", 'la passion'],
    heroSuffix: 'fait son nid !',
    holdButtonLabel: 'Maintenir pour vérifier',
    themeToggleAriaLabel: 'Basculer le mode sombre ou clair',
    seasonSliderAriaLabel: 'Curseur de test du cycle des saisons',
    seasonProgressLabel: 'Cycle des saisons',
    spring: 'Printemps',
    summer: 'Été',
    fall: 'Automne',
    winter: 'Hiver',
    localeSwitchLabel: 'EN',
    localeSwitchAriaLabel: 'Switch to English',
  },
} as const;

export type SupportedLocale = keyof typeof translations;

/**
 * Retrieves localized string dictionary for a given locale.
 */
export function useTranslations(locale: string = DEFAULT_LOCALE) {
  const safeLocale = (locale in translations ? locale : DEFAULT_LOCALE) as SupportedLocale;
  return translations[safeLocale];
}
