import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { Switch, useThemeMode } from 'reapti';
import { M3eIcon } from '@m3e/react/icon';
import '@m3e/icons/rounded/dark_mode';
import '@m3e/icons/rounded/light_mode';
import '@m3e/icons/rounded/sunny';
import '@m3e/icons/rounded/nightlight';

export interface ThemeSwitchProps {
  ariaLabel?: string;
}

/**
 * Material Design 3 Theme Switch
 *
 * Utilizes Reapti's Switch with M3e rounded icons:
 * - Handle icon: dark_mode when checked, light_mode when unchecked
 * - Ghost icon: sunny when checked, nightlight when unchecked
 * - Peeking icon: reveals contrasting celestial icon on hover
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
    <Switch
      {...accessibleProps}
      checked={isDark}
      onChange={handleToggle}
      size="medium"
      icons="both"
      dataTestId="theme-switch"
      handleIconOn={<M3eIcon name="dark_mode" variant="rounded" />}
      handleIconOff={<M3eIcon name="light_mode" variant="rounded" />}
      ghostIconOn={<M3eIcon name="sunny" variant="rounded" />}
      ghostIconOff={<M3eIcon name="nightlight" variant="rounded" />}
      peekingIconOn={<M3eIcon name="light_mode" variant="rounded" />}
      peekingIconOff={<M3eIcon name="dark_mode" variant="rounded" />}
    />
  );
}
