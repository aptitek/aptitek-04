/**
 * Application Internationalization (i18n) Module
 *
 * Centralizes all user-facing strings, defaults, and translations.
 * Prevents hardcoding of natural language copy in layouts and components.
 */

import { en } from './en.ts';
import { fr } from './fr.ts';

const DEFAULT_LOCALE = 'en';

const translations = {
  en,
  fr,
} as const;

export type SupportedLocale = keyof typeof translations;

/**
 * Retrieves localized string dictionary for a given locale.
 */
export function useTranslations(locale: string = DEFAULT_LOCALE) {
  const safeLocale = (locale in translations ? locale : DEFAULT_LOCALE) as SupportedLocale;
  return translations[safeLocale];
}
