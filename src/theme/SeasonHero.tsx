import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { SeasonBackground, HeroTicker, SegmentedChip } from 'reapti';
import { Box, Flex } from '../../styled-system/jsx';
import { M3eSlider, M3eSliderThumb } from '@m3e/react/slider';
import { M3eIcon } from '@m3e/react/icon';
import { useTranslations } from '../i18n/index.ts';
import { useThemeMode } from './useThemeMode.ts';

import '@m3e/icons/rounded/spa';
import '@m3e/icons/rounded/sunny';
import '@m3e/icons/rounded/eco';
import '@m3e/icons/rounded/ac_unit';

export interface SeasonHeroProps {
  locale?: string;
  prefix?: string;
  brand?: string;
  brandSuffix?: string;
  phrases?: string[];
  suffix?: string;
}

interface ActiveSeasonInfo {
  id: 'spring' | 'summer' | 'fall' | 'winter';
  icon: string;
  name: string;
}

function resolveActiveSeason(
  progress: number,
  names: Record<'spring' | 'summer' | 'fall' | 'winter', string>,
): ActiveSeasonInfo {
  if (progress < 1) return { id: 'spring', icon: 'spa', name: names.spring };
  if (progress < 2) return { id: 'summer', icon: 'sunny', name: names.summer };
  if (progress < 3) return { id: 'fall', icon: 'eco', name: names.fall };
  return { id: 'winter', icon: 'ac_unit', name: names.winter };
}

function SeasonStatusBar({
  icon,
  name,
  progress,
}: {
  icon: string;
  name: string;
  progress: number;
}): ReactElement {
  return (
    <Flex className="season-slider-status-bar">
      <Flex className="season-status-pill" role="status">
        <M3eIcon name={icon} variant="rounded" />
        <Box as="span" className="season-status-name">
          {name}
        </Box>
        <Box as="span" className="season-status-number">
          {progress.toFixed(2)}
        </Box>
      </Flex>
    </Flex>
  );
}

function SeasonSliderTrack({
  progress,
  ariaLabel,
  onInput,
}: {
  progress: number;
  ariaLabel: string;
  onInput: (event: Event) => void;
}): ReactElement {
  return (
    <Box className="season-slider-track-container">
      <Box data-override="" className="season-slider-wrapper">
        <M3eSlider min={0} max={4} step={0.05} onInput={onInput} data-testid="season-m3e-slider">
          <M3eSliderThumb value={progress} aria-label={ariaLabel} />
        </M3eSlider>
      </Box>
    </Box>
  );
}

function buildChipItems(
  names: Record<'spring' | 'summer' | 'fall' | 'winter', string>,
  onSelectPreset: (value: number) => void,
) {
  return [
    { id: 'spring', label: names.spring, icon: 'spa', onClick: () => onSelectPreset(0.0) },
    { id: 'summer', label: names.summer, icon: 'sunny', onClick: () => onSelectPreset(1.0) },
    { id: 'fall', label: names.fall, icon: 'eco', onClick: () => onSelectPreset(2.0) },
    { id: 'winter', label: names.winter, icon: 'ac_unit', onClick: () => onSelectPreset(3.0) },
  ];
}

function SeasonControlsDock({
  seasonProgress,
  activeSeason,
  ariaLabel,
  onSliderInput,
  onSelectPreset,
  names,
}: {
  seasonProgress: number;
  activeSeason: ActiveSeasonInfo;
  ariaLabel: string;
  onSliderInput: (event: Event) => void;
  onSelectPreset: (value: number) => void;
  names: Record<'spring' | 'summer' | 'fall' | 'winter', string>;
}): ReactElement {
  const chipItems = useMemo(() => buildChipItems(names, onSelectPreset), [names, onSelectPreset]);

  return (
    <Box
      className="season-slider-dock"
      role="region"
      aria-label={ariaLabel}
      data-testid="season-slider-dock"
    >
      <SeasonStatusBar
        icon={activeSeason.icon}
        name={activeSeason.name}
        progress={seasonProgress}
      />
      <SeasonSliderTrack progress={seasonProgress} ariaLabel={ariaLabel} onInput={onSliderInput} />
      <Box className="season-chips-container">
        <SegmentedChip
          variant="outlined"
          size="small"
          ariaLabel={ariaLabel}
          items={chipItems}
          dataTestId="season-presets-chip"
        />
      </Box>
    </Box>
  );
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
 * Combines SeasonBackground with centered HeroTicker and M3e seasonal test slider.
 */
export function SeasonHero(props: SeasonHeroProps): ReactElement {
  const t = useTranslations(props.locale);
  const themeMode = useThemeMode();
  const [seasonProgress, setSeasonProgress] = useState<number>(0.0);

  const { prefixNode, phrases, suffix } = useHeroCopy(props, t);
  const seasonNames = useMemo(
    () => ({ spring: t.spring, summer: t.summer, fall: t.fall, winter: t.winter }),
    [t.spring, t.summer, t.fall, t.winter],
  );
  const activeSeason = useMemo(
    () => resolveActiveSeason(seasonProgress, seasonNames),
    [seasonProgress, seasonNames],
  );

  const handleSliderInput = useCallback((event: Event) => {
    const target = event.target as HTMLElement & { value?: number | string };
    if (target?.value !== undefined && target.value !== null) {
      setSeasonProgress(Number(target.value));
    }
  }, []);

  return (
    <Box className="season-hero-wrapper" data-testid="season-hero">
      <SeasonBackground
        seasonProgress={seasonProgress}
        mode={themeMode}
        interactive={true}
        className="season-hero-canvas-container"
      >
        <Flex className="season-hero-content-stack">
          <SeasonHeroTickerBox prefixNode={prefixNode} phrases={phrases} suffix={suffix} />

          <SeasonControlsDock
            seasonProgress={seasonProgress}
            activeSeason={activeSeason}
            ariaLabel={t.seasonSliderAriaLabel}
            onSliderInput={handleSliderInput}
            onSelectPreset={setSeasonProgress}
            names={seasonNames}
          />
        </Flex>
      </SeasonBackground>
    </Box>
  );
}
