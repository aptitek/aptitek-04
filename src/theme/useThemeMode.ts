import { useSyncExternalStore } from 'react';

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', callback);
  return () => {
    observer.disconnect();
    mql.removeEventListener('change', callback);
  };
}

function getThemeSnapshot(): 'dark' | 'light' {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * React hook subscribing to active document theme mode changes.
 */
export function useThemeMode(): 'dark' | 'light' {
  return useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'light');
}
