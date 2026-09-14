import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { MeridianSwitch } from 'reapti';
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

  const handleLanguageChange = useCallback(
    (nextLang: 'en' | 'fr') => {
      const targetPath = getTargetLocalePath(resolvedPath, nextLang);
      if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      }
    },
    [resolvedPath],
  );

  return (
    <Box className="language-switch-wrapper">
      <MeridianSwitch
        language={isFrench ? 'fr' : 'en'}
        onLanguageChange={handleLanguageChange}
        size="medium"
        ariaLabel={effectiveAriaLabel}
        dataTestId="language-switch"
      />
    </Box>
  );
};
