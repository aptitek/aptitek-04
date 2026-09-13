import type { ThemeTokens } from './types.ts';
import { solarizedTheme } from './solarized.ts';

export type {
  ThemeTokens,
  ColorRamp,
  ElevationTokens,
  RadiusTokens,
  TypographyTokens,
  MotionTokens,
  SpacingTokens,
  ThemeModeTokens,
} from './types.ts';

export { solarizedTheme } from './solarized.ts';

export const THEME_REGISTRY: Record<string, ThemeTokens> = {
  solarized: solarizedTheme,
};

export const DEFAULT_THEME_NAME = 'solarized';

/**
 * Retrieves theme definition by name, falling back to Solarized.
 */
export function getTheme(name: string = DEFAULT_THEME_NAME): ThemeTokens {
  return THEME_REGISTRY[name] ?? solarizedTheme;
}

export { ThemeSwitch } from './ThemeSwitch.tsx';
export type { ThemeSwitchProps } from './ThemeSwitch.tsx';

export { SeasonHero } from './SeasonHero.tsx';
export type { SeasonHeroProps } from './SeasonHero.tsx';
