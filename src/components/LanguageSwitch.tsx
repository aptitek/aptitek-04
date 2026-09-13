import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { Switch } from 'reapti';
import { Box } from 'styled-system/jsx';
import { useTranslations, type SupportedLocale } from '../i18n/index.ts';

export interface LanguageSwitchProps {
  currentLocale: SupportedLocale;
  currentPath?: string;
  ariaLabel?: string;
}

const EN_TO_FR_MAP: Record<string, string> = {
  '/': '/fr',
  '/classes': '/fr/formations',
  '/formations': '/fr/formations',
  '/aptispace': '/fr/aptispace',
  '/about': '/fr/a-propos',
  '/a-propos': '/fr/a-propos',
};

const FR_TO_EN_MAP: Record<string, string> = {
  '/fr': '/',
  '/fr/formations': '/classes',
  '/fr/classes': '/classes',
  '/fr/aptispace': '/aptispace',
  '/fr/a-propos': '/about',
  '/fr/about': '/about',
};

function getTargetLocalePath(pathname: string, targetLocale: SupportedLocale): string {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  if (targetLocale === 'fr') {
    return EN_TO_FR_MAP[cleanPath] ?? (cleanPath.startsWith('/fr') ? cleanPath : `/fr${cleanPath}`);
  }
  return FR_TO_EN_MAP[cleanPath] ?? (cleanPath.replace(/^\/fr/, '') || '/');
}

export const LanguageSwitch: FC<LanguageSwitchProps> = ({
  currentLocale,
  currentPath,
  ariaLabel,
}) => {
  const t = useTranslations(currentLocale);
  const isFrench = currentLocale === 'fr';

  const resolvedPath = useMemo(() => {
    if (currentPath !== undefined) return currentPath;
    if (typeof window !== 'undefined') return window.location.pathname;
    return isFrench ? '/fr' : '/';
  }, [currentPath, isFrench]);

  const effectiveAriaLabel = ariaLabel ?? t.localeSwitchAriaLabel;

  const handleToggle = useCallback(
    (checked: boolean) => {
      const nextLocale = checked ? 'fr' : 'en';
      const targetPath = getTargetLocalePath(resolvedPath, nextLocale);
      if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      }
    },
    [resolvedPath],
  );

  const enGlyph = t.localeEnGlyph;
  const frGlyph = t.localeFrGlyph;

  const enIcon = useMemo(
    () => (
      <Box as="span" className="switch-glyph" aria-hidden="true">
        {enGlyph}
      </Box>
    ),
    [enGlyph],
  );

  const frIcon = useMemo(
    () => (
      <Box as="span" className="switch-glyph" aria-hidden="true">
        {frGlyph}
      </Box>
    ),
    [frGlyph],
  );

  return (
    <Box className="language-switch-wrapper">
      <Switch
        checked={isFrench}
        onChange={handleToggle}
        size="medium"
        icons="both"
        ariaLabel={effectiveAriaLabel}
        dataTestId="language-switch"
        handleIconOn={frIcon}
        handleIconOff={enIcon}
        ghostIconOn={enIcon}
        ghostIconOff={frIcon}
        peekingIconOn={enIcon}
        peekingIconOff={frIcon}
      />
    </Box>
  );
};
