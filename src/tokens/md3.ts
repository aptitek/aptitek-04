/**
 * Material Design 3 Design System Tokens
 * Mathematical definitions for MD3 color roles, motion physics, elevation lattices, and spacing.
 */

export const md3Tokens = {
  radii: {
    none: { value: '0px' },
    extraSmall: { value: '4px' },
    small: { value: '8px' },
    medium: { value: '12px' },
    large: { value: '16px' },
    extraLarge: { value: '28px' },
    full: { value: '9999px' },
  },
  borderWidths: {
    none: { value: '0px' },
    thin: { value: '1px' },
    medium: { value: '2px' },
    thick: { value: '3px' },
    heavy: { value: '4px' },
  },
  spacing: {
    '0': { value: '0px' },
    '0.5': { value: '2px' },
    '1': { value: '4px' },
    '1.5': { value: '6px' },
    '2': { value: '8px' },
    '2.5': { value: '10px' },
    '3': { value: '12px' },
    '4': { value: '16px' },
    '5': { value: '20px' },
    '6': { value: '24px' },
    '7': { value: '28px' },
    '8': { value: '32px' },
    '10': { value: '40px' },
    '12': { value: '48px' },
    '14': { value: '56px' },
    '16': { value: '64px' },
    '20': { value: '80px' },
    '24': { value: '96px' },
  },
  durations: {
    short1: { value: '50ms' },
    short2: { value: '100ms' },
    short3: { value: '150ms' },
    short4: { value: '200ms' },
    medium1: { value: '250ms' },
    medium2: { value: '300ms' },
    medium3: { value: '350ms' },
    medium4: { value: '400ms' },
    long1: { value: '450ms' },
    long2: { value: '500ms' },
    long3: { value: '550ms' },
    long4: { value: '600ms' },
    extraLong1: { value: '700ms' },
    extraLong2: { value: '800ms' },
    extraLong3: { value: '900ms' },
    extraLong4: { value: '1000ms' },
  },
  easings: {
    emphasized: { value: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)' },
    emphasizedDecelerate: { value: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)' },
    emphasizedAccelerate: { value: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)' },
    standard: { value: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)' },
    standardDecelerate: { value: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)' },
    standardAccelerate: { value: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)' },
  },
  fonts: {
    logo: { value: "'Milkshake', cursive, sans-serif" },
    brand: { value: "'Recursive', sans-serif" },
  },
};

const c = (light: string, dark: string) => ({
  value: { base: light, _light: light, _dark: dark },
});

export const md3SemanticTokens = {
  colors: {
    primary: c('#006874', '#80d5e3'),
    onPrimary: c('#ffffff', '#00363d'),
    primaryContainer: c('#97f0ff', '#004f58'),
    onPrimaryContainer: c('#001f24', '#97f0ff'),
    secondary: c('#4a6267', '#b1cbd1'),
    onSecondary: c('#ffffff', '#1c3438'),
    secondaryContainer: c('#cde7ed', '#334a4f'),
    onSecondaryContainer: c('#051f23', '#cde7ed'),
    tertiary: c('#535e7d', '#bac6ea'),
    onTertiary: c('#ffffff', '#25304d'),
    tertiaryContainer: c('#dae2ff', '#3c4665'),
    onTertiaryContainer: c('#0f1b37', '#dae2ff'),
    error: c('#ba1a1a', '#ffb4ab'),
    onError: c('#ffffff', '#690005'),
    errorContainer: c('#ffdad6', '#93000a'),
    onErrorContainer: c('#410002', '#ffdad6'),
    surface: c('#f8fafb', '#191c1d'),
    onSurface: c('#191c1d', '#e1e3e4'),
    surfaceVariant: c('#dbe4e6', '#3f484a'),
    onSurfaceVariant: c('#3f484a', '#bfc8ca'),
    surfaceDim: c('#d8dadb', '#101415'),
    surfaceBright: c('#f8fafb', '#373a3b'),
    surfaceContainerLowest: c('#ffffff', '#0e1213'),
    surfaceContainerLow: c('#f2f4f5', '#171b1c'),
    surfaceContainer: c('#eceeef', '#1b1f20'),
    surfaceContainerHigh: c('#e6e9ea', '#25292a'),
    surfaceContainerHighest: c('#e1e3e4', '#303435'),
    outline: c('#6f797a', '#899294'),
    outlineVariant: c('#bfc8ca', '#3f484a'),
    shadow: c('#000000', '#000000'),
    scrim: c('#000000', '#000000'),
    inverseSurface: c('#2e3132', '#e1e3e4'),
    inverseOnSurface: c('#eff1f2', '#191c1d'),
    inversePrimary: c('#80d5e3', '#006874'),
  },
  shadows: {
    elevation0: { value: 'none' },
    elevation1: {
      value: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    },
    elevation2: {
      value: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    },
    elevation3: {
      value: '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
    },
    elevation4: {
      value: '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
    },
    elevation5: {
      value: '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
    },
  },
};
