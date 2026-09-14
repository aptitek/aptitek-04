import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeSwitch } from '../../src/theme/ThemeSwitch.tsx';
import { LanguageSwitch } from '../../src/components/LanguageSwitch.tsx';

describe('Appbar Fancy Switches Specifications', () => {
  it('renders ThemeSwitch using ZenithSwitch with data-testid="theme-switch"', () => {
    const html = renderToString(createElement(ThemeSwitch, { ariaLabel: 'Toggle color theme' }));
    expect(html).toContain('data-testid="theme-switch"');
    expect(html).toContain('fancy_switch_zenith');
    expect(html).toContain('fancy_celestial_arc');
    expect(html).toContain('aria-label="Toggle color theme"');
  });

  it('renders LanguageSwitch in English with MeridianSwitch and data-testid="language-switch"', () => {
    const html = renderToString(
      createElement(LanguageSwitch, {
        currentLocale: 'en',
        currentPath: '/',
      }),
    );
    expect(html).toContain('data-testid="language-switch"');
    expect(html).toContain('fancy_switch_meridian');
    expect(html).toContain('Passer en français');
  });

  it('renders LanguageSwitch in French with MeridianSwitch and English aria-label', () => {
    const html = renderToString(
      createElement(LanguageSwitch, {
        currentLocale: 'fr',
        currentPath: '/fr',
      }),
    );
    expect(html).toContain('data-testid="language-switch"');
    expect(html).toContain('fancy_switch_meridian');
    expect(html).toContain('Switch to English');
  });
});
