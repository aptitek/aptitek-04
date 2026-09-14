import { createElement, useMemo, type FC, type ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { useTranslations, type SupportedLocale } from '../i18n/index.ts';

export interface SocialLinksProps {
  className?: string;
  locale?: SupportedLocale;
}

interface SocialLinkConfig {
  id: 'linkedin' | 'github' | 'bluesky' | 'telegram';
  name: string;
  url: string;
  ariaKey: 'linkedinAria' | 'githubAria' | 'blueskyAria' | 'telegramAria';
  iconPath: string;
}

const LINK_CONFIGS: readonly SocialLinkConfig[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://fr.linkedin.com/in/grea09',
    ariaKey: 'linkedinAria',
    iconPath:
      'M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z',
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/aptitek',
    ariaKey: 'githubAria',
    iconPath:
      'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    url: 'https://bsky.app/profile/aptitek.bsky.social',
    ariaKey: 'blueskyAria',
    iconPath:
      'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.74-1.284 7.823-5.26 1.083 3.976 2.81 10.45 7.823 5.26 4.557-5.073 1.082-6.498-2.83-7.078-.139-.016-.277-.034-.415-.056.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    url: 'https://t.me/aptitek',
    ariaKey: 'telegramAria',
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z',
  },
] as const;

function renderSvgIcon(path: string): ReactNode {
  const pathElement = createElement('path', {
    fill: 'currentColor',
    d: path,
  });
  return createElement(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '18',
      height: '18',
      'aria-hidden': 'true',
      focusable: 'false',
      className: 'social-icon-svg',
    },
    pathElement,
  );
}

export const SocialLinks: FC<SocialLinksProps> = ({ className, locale }) => {
  const t = useTranslations(locale);

  const links = useMemo(
    () =>
      LINK_CONFIGS.map((config) => ({
        id: config.id,
        name: config.name,
        url: config.url,
        ariaLabel: t[config.ariaKey as keyof typeof t] as string,
        icon: renderSvgIcon(config.iconPath),
      })),
    [t],
  );

  return (
    <Box
      className={className ? `social-links-container ${className}` : 'social-links-container'}
      role="group"
      aria-label={t.socialLinksGroupAria}
    >
      {links.map((link) =>
        createElement(
          'a',
          {
            key: link.name,
            href: link.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: `social-icon-btn social-icon-btn--${link.id}`,
            'data-social': link.id,
            'aria-label': link.ariaLabel,
            title: link.name,
          },
          link.icon,
        ),
      )}
    </Box>
  );
};
