import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { ZenithSwitch, useThemeMode } from 'reapti';

export interface ThemeSwitchProps {
  ariaLabel?: string;
}

/**
 * Material Design 3 Theme Switch
 *
 * Utilizes Reapti's ZenithSwitch fancy preset:
 * - Sun on daytime zenith arc when light
 * - Moon on midnight zenith arc when dark
 * - Peeking celestial icon on hover with smooth arc trajectory
 */
export function ThemeSwitch({ ariaLabel }: ThemeSwitchProps): ReactElement {
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const handleToggle = useCallback((checked: boolean) => {
    const targetTheme = checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', targetTheme);
    try {
      localStorage.setItem('aptitek-theme', targetTheme);
    } catch {
      // Ignore storage restrictions if disabled
    }
  }, []);

  const accessibleProps = ariaLabel ? { ariaLabel } : {};

  return (
    <ZenithSwitch
      {...accessibleProps}
      checked={isDark}
      onChange={handleToggle}
      size="medium"
      dataTestId="theme-switch"
    />
  );
}
