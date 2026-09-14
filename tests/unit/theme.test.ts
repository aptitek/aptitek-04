import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  solarizedTheme,
  md3Theme,
  THEME_REGISTRY,
  getTheme,
  registerTheme,
  useThemeMode,
  useTheme,
  ThemeProvider,
} from '../../src/theme/index.ts';
import { solarizedTheme as localSolarizedTheme } from '../../src/theme/solarized.ts';
import { PROGRESS_THEME_COLORS } from '../../src/tokens/solarized.ts';
import { md3SemanticTokens } from '../../src/tokens/md3.ts';
import { holoGradient, sheenGradient } from '../../src/tokens/holo.ts';
import { cssTokensPlugin } from '../../scripts/eslint/css-tokens-plugin.js';

describe('Theme and Tokens Specifications', () => {
  it('re-exports theme constructs from reapti as single source of truth', () => {
    expect(solarizedTheme).toBeDefined();
    expect(md3Theme).toBeDefined();
    expect(THEME_REGISTRY).toBeDefined();
    expect(getTheme).toBeDefined();
    expect(registerTheme).toBeDefined();
    expect(useThemeMode).toBeDefined();
    expect(useTheme).toBeDefined();
    expect(ThemeProvider).toBeDefined();
  });

  it('validates solarized theme tokens have zero pure white or pure black', () => {
    expect(localSolarizedTheme.light.colors.primary).toBe('#859900');
    expect(localSolarizedTheme.light.colors.onPrimary).toBe('#002b36');
    expect(localSolarizedTheme.light.colors.onSecondary).toBe('#fdf6e3');
    expect(localSolarizedTheme.light.colors.onTertiary).toBe('#002b36');
    expect(localSolarizedTheme.light.colors.surface).toBe('#eee8d5');
    expect(localSolarizedTheme.light.colors.onSurface).toBe('#073642');
    expect(localSolarizedTheme.dark.colors.primary).toBe('#859900');
    expect(localSolarizedTheme.dark.colors.onPrimary).toBe('#002b36');
    expect(localSolarizedTheme.dark.colors.surface).toBe('#073642');
    expect(localSolarizedTheme.dark.colors.onSurface).toBe('#fdf6e3');

    // Confirm no pure white in light contrast
    expect(PROGRESS_THEME_COLORS.lightContrast).toBe('#fdf6e3');
  });

  it('validates MD3 semantic tokens are calibrated strictly to Solarized', () => {
    expect(md3SemanticTokens.colors.primary.value._light).toBe('#859900');
    expect(md3SemanticTokens.colors.primary.value._dark).toBe('#859900');
    expect(md3SemanticTokens.colors.onPrimary.value._light).toBe('#002b36');
    expect(md3SemanticTokens.colors.onPrimary.value._dark).toBe('#002b36');
    expect(md3SemanticTokens.colors.surface.value._light).toBe('#eee8d5');
    expect(md3SemanticTokens.colors.surface.value._dark).toBe('#073642');
  });

  it('validates holo tokens adhere to Solarized spectrum and base3 sheen', () => {
    expect(holoGradient).toContain('rgba(220, 50, 47, 0)');
    expect(holoGradient).toContain('rgba(211, 54, 130, 0)');
    expect(sheenGradient).toContain('rgba(253, 246, 227, 0.15)');
    expect(sheenGradient).not.toContain('rgba(255, 255, 255');
  });

  it('enforces that all elements except background use pure Solarized theme tokens via enforce-theme rule', () => {
    const enforceThemeRule = cssTokensPlugin.rules['enforce-theme'];
    expect(enforceThemeRule).toBeDefined();
    expect(enforceThemeRule.meta.messages.invalidThemeColor).toBeDefined();
    expect(enforceThemeRule.meta.messages.rawColorFallback).toBeDefined();
  });

  it('verifies theme.css defines purple alias for violet', () => {
    const themeCss = readFileSync(resolve(process.cwd(), 'src/theme/theme.css'), 'utf-8');
    expect(themeCss).toContain('--colors-purple: var(--colors-violet);');
  });
});
