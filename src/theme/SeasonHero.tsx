import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { SeasonBackground, HeroTicker, resolveSeasonProgress } from 'reapti';
import type { SeasonVariant } from 'reapti';
import { Box, Flex } from '../../styled-system/jsx';
import { useTranslations } from '../i18n/index.ts';
import { useThemeMode } from './useThemeMode.ts';
import { MascotBranchPerch, MascotFlightActor } from '../components/Mascot/index.ts';

export interface SeasonHeroProps {
  locale?: string;
  prefix?: string;
  brand?: string;
  brandSuffix?: string;
  phrases?: string[];
  suffix?: string;
  season?: SeasonVariant;
  seasonProgress?: number;
}

function HeroBrandPrefix({
  prefix,
  brand,
  brandSuffix,
}: {
  prefix: string;
  brand: string;
  brandSuffix?: string;
}): ReactElement {
  return (
    <Box as="span" className="hero-ticker-brand-prefix">
      <Box as="span">{prefix}</Box>
      <Box as="span" className="hero-brand-compound">
        <Box as="span" className="font-milkshake brand-name-milkshake">
          {brand}
        </Box>
        {brandSuffix ? <Box as="span">{brandSuffix}</Box> : null}
      </Box>
    </Box>
  );
}

function SeasonHeroTickerBox({
  prefixNode,
  phrases,
  suffix,
}: {
  prefixNode: ReactElement;
  phrases: string[];
  suffix: string;
}): ReactElement {
  return (
    <Box className="season-hero-ticker-box">
      <HeroTicker
        prefix={prefixNode as unknown as string}
        phrases={phrases}
        suffix={suffix}
        size="large"
        animationMode="cursive-draw"
        showNib={true}
        dataTestId="season-hero-ticker"
      />
    </Box>
  );
}

function useHeroCopy(props: SeasonHeroProps, t: ReturnType<typeof useTranslations>) {
  const prefix = props.prefix ?? t.heroPrefix;
  const brand = props.brand ?? t.heroBrand;
  const brandSuffix = props.brandSuffix ?? t.heroBrandSuffix;
  const phrases = props.phrases ?? [...t.heroPhrases];
  const suffix = props.suffix ?? t.heroSuffix;

  const prefixNode = useMemo(
    () => <HeroBrandPrefix prefix={prefix} brand={brand} brandSuffix={brandSuffix} />,
    [prefix, brand, brandSuffix],
  );

  return { prefixNode, phrases, suffix };
}

/**
 * Seasonal Hero Organism
 * Combines SeasonBackground with centered HeroTicker.
 */
export function SeasonHero(props: SeasonHeroProps): ReactElement {
  const t = useTranslations(props.locale);
  const themeMode = useThemeMode();
  const seasonProgress = useMemo(
    () => resolveSeasonProgress(props.season, props.seasonProgress),
    [props.season, props.seasonProgress],
  );

  const { prefixNode, phrases, suffix } = useHeroCopy(props, t);

  return (
    <Box
      className="season-hero-wrapper"
      data-testid="season-hero"
      data-season-progress={seasonProgress.toFixed(2)}
    >
      <SeasonBackground
        seasonProgress={seasonProgress}
        mode={themeMode}
        interactive={true}
        className="season-hero-canvas-container"
        treeOverlay={
          <MascotBranchPerch ariaLabel={t.mascotSleepingAriaLabel} title={t.mascotSleepingTitle} />
        }
      >
        <Flex className="season-hero-content-stack">
          <SeasonHeroTickerBox prefixNode={prefixNode} phrases={phrases} suffix={suffix} />
        </Flex>
      </SeasonBackground>
      <MascotFlightActor />
    </Box>
  );
}
