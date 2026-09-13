/**
 * Modular Theme System Type Definitions
 *
 * Defines the contract for pluggable design themes including color ramps,
 * elevation models, border radii, typography, motion physics, and spacing scales.
 */

export interface ColorRamp {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  background: string;
  surface: string;
  onSurface: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
}

export interface ElevationTokens {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export interface RadiusTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface TypographyTokens {
  titleFamily: string;
  bodyFamily: string;
  bodyVariation: string;
  baseFontSize: string;
  minFontSize: string;
  lineHeightRelaxed: string;
}

export interface MotionTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easingOrganic: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  relaxed: string;
  airy: string;
  spacious: string;
}

export interface ThemeModeTokens {
  colors: ColorRamp;
  elevation: ElevationTokens;
}

export interface ThemeTokens {
  name: string;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
  radii: RadiusTokens;
  typography: TypographyTokens;
  motion: MotionTokens;
  spacing: SpacingTokens;
}
