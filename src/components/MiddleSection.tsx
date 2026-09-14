import { createElement, useMemo, type FC, type ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { useTranslations, type SupportedLocale } from '../i18n/index.ts';

export interface MiddleSectionProps {
  locale?: SupportedLocale;
  className?: string;
  'data-testid'?: string;
}

interface PartnerSchoolConfig {
  id: string;
  nameKey:
    | 'partnerEstiam'
    | 'partnerGema'
    | 'partnerIpi'
    | 'partnerIpssi'
    | 'partnerScienceU'
    | 'partnerYnov';
  logoSrc: string;
  url: string;
}

const PARTNER_SCHOOLS: readonly PartnerSchoolConfig[] = [
  {
    id: 'estiam',
    nameKey: 'partnerEstiam',
    logoSrc: '/logo/estiam.svg',
    url: 'https://www.estiam.education/',
  },
  {
    id: 'gema',
    nameKey: 'partnerGema',
    logoSrc: '/logo/gema.svg',
    url: 'https://www.groupe-gema.com/campus/lyon/',
  },
  {
    id: 'ipi',
    nameKey: 'partnerIpi',
    logoSrc: '/logo/ipi.svg',
    url: 'https://www.ipi-ecoles.com/lyon/',
  },
  {
    id: 'ipssi',
    nameKey: 'partnerIpssi',
    logoSrc: '/logo/ipssi.svg',
    url: 'https://ecole-ipssi.com/#',
  },
  {
    id: 'sciences-u',
    nameKey: 'partnerScienceU',
    logoSrc: '/logo/science-u-logo.svg',
    url: 'https://www.sciences-u-lyon.fr/',
  },
  {
    id: 'ynov',
    nameKey: 'partnerYnov',
    logoSrc: '/logo/ynov.svg',
    url: 'https://www.ynov.com/campus/lyon/',
  },
] as const;

function renderAptitekLogo(altText: string): ReactNode {
  return createElement('img', {
    src: '/aptitek-logo.svg',
    alt: altText,
    width: 380,
    height: 111,
    className: 'aptitek-brand-hero-logo-img',
  });
}

function renderPartnerLogoImg(src: string, altText: string): ReactNode {
  return createElement('img', {
    src,
    alt: altText,
    loading: 'lazy',
    className: 'partner-logo-img',
  });
}

interface PartnerCardItem {
  key: string;
  id: string;
  name: string;
  logoSrc: string;
  url: string;
}

function renderPartnerCardLink(item: PartnerCardItem): ReactNode {
  return createElement(
    'a',
    {
      key: item.key,
      href: item.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      className: `partner-logo-card partner-logo-card--${item.id}`,
      'aria-label': item.name,
      title: item.name,
    },
    renderPartnerLogoImg(item.logoSrc, item.name),
  );
}

interface AptitekIntroProps {
  brandAlt: string;
  title: string;
  subtitle: string;
}

function AptitekIntro({ brandAlt, title, subtitle }: AptitekIntroProps): ReactNode {
  return (
    <Box className="aptitek-intro-container">
      <Box className="aptitek-brand-hero-logo-wrapper">{renderAptitekLogo(brandAlt)}</Box>
      <Box as="h1" className="aptitek-intro-h1">
        {title}
      </Box>
      <Box as="h2" className="aptitek-intro-h2">
        {subtitle}
      </Box>
    </Box>
  );
}

interface PartnerCarouselProps {
  title: string;
  ariaLabel: string;
  t: ReturnType<typeof useTranslations>;
}

function PartnerCarousel({ title, ariaLabel, t }: PartnerCarouselProps): ReactNode {
  const marqueeItems = useMemo(() => {
    // Duplicate the partner schools array for seamless infinite marquee loop
    return [...PARTNER_SCHOOLS, ...PARTNER_SCHOOLS].map((school, index) => ({
      key: `${school.id}-${index}`,
      id: school.id,
      name: t[school.nameKey],
      logoSrc: school.logoSrc,
      url: school.url,
    }));
  }, [t]);

  return (
    <Box as="section" className="partner-carousel-section" aria-label={ariaLabel}>
      <Box as="h3" className="partner-carousel-title">
        {title}
      </Box>
      <Box className="partner-carousel-viewport">
        <Box className="partner-marquee-track" role="list">
          {marqueeItems.map(renderPartnerCardLink)}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Aptitek Middle Section Organism
 * Displays big brand logo, XP & talent tree introduction text,
 * and an infinite marquee carousel of partner schools.
 */
export const MiddleSection: FC<MiddleSectionProps> = ({
  locale = 'fr',
  className,
  'data-testid': dataTestId = 'aptitek-middle-section',
}) => {
  const t = useTranslations(locale);

  const containerClass = className
    ? `aptitek-middle-section ${className}`
    : 'aptitek-middle-section';

  return (
    <Box as="section" className={containerClass} data-testid={dataTestId}>
      <AptitekIntro
        brandAlt={t.aptitekBrandAlt}
        title={t.middleIntroTitle}
        subtitle={t.middleIntroSubtitle}
      />
      <PartnerCarousel title={t.middlePartnerTitle} ariaLabel={t.middlePartnerAria} t={t} />
    </Box>
  );
};
