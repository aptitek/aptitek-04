import { useEffect, type FC, type ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import type {
  AptipiouEyes as EyesType,
  AptipiouMouth as MouthType,
  AptipiouVectorProps,
  ParticlePlacement,
} from './types.ts';
import { G, Svg, SvgImage } from './svg-primitives.ts';
import { AptipiouEyes } from './AptipiouEyes.tsx';
import { AptipiouMouth } from './AptipiouMouth.tsx';
import { resolveParticle } from './particles.ts';
import { useAptipiouAnimation } from './useAptipiouAnimation.ts';
import { prefetchBodies, useBodySvg } from './useBodySvg.ts';
import './aptipiou-vector.css';

const COMMON_BODIES = [
  'standing',
  'action-wave',
  'action-celebrate',
  'action-thinking',
  'action-thumbsup',
  'fly-upstroke',
  'fly-glide',
  'fly-downstroke',
  'fly-bank',
  'land-touchdown',
  'land-impact',
  'land-settle',
  'land-rebound',
  'land-stand',
  'happy-bounce',
];

const BODY_MAP: Record<string, string> = {
  idle: 'standing',
  talk: 'standing',
  bounce: 'happy-bounce',
  think: 'action-thinking',
  wave: 'action-wave',
};

const EYES_LOOKUP: Record<string, { asset: string; inline: EyesType }> = {
  happy: { asset: 'happy', inline: 'happy' },
  laugh: { asset: 'laugh', inline: 'happy' },
  love: { asset: 'love', inline: 'happy' },
  blink: { asset: 'blink', inline: 'blink' },
  sleepy: { asset: 'sleepy', inline: 'blink' },
  wink: { asset: 'wink', inline: 'wink' },
  'wink-left': { asset: 'wink-left', inline: 'wink' },
  squint: { asset: 'squint', inline: 'squint' },
  dizzy: { asset: 'dizzy', inline: 'squint' },
  shocked: { asset: 'shocked', inline: 'squint' },
  cry: { asset: 'cry', inline: 'squint' },
  open: { asset: 'open', inline: 'open' },
};

const BEAK_LOOKUP: Record<string, { asset: string; inline: MouthType }> = {
  'talk-a': { asset: 'talk-a', inline: 'open' },
  'talk-e': { asset: 'talk-e', inline: 'open' },
  'talk-wide': { asset: 'talk-wide', inline: 'open' },
  laugh: { asset: 'laugh', inline: 'open' },
  'talk-o': { asset: 'talk-o', inline: 'round' },
  'talk-u': { asset: 'talk-u', inline: 'round' },
  surprise: { asset: 'surprise', inline: 'round' },
  smile: { asset: 'smile', inline: 'smile' },
  grin: { asset: 'grin', inline: 'smile' },
  smirk: { asset: 'smirk', inline: 'smile' },
  'talk-i': { asset: 'talk-i', inline: 'smile' },
  'talk-closed': { asset: 'talk-closed', inline: 'closed' },
  default: { asset: 'default', inline: 'closed' },
  pout: { asset: 'pout', inline: 'closed' },
  dizzy: { asset: 'dizzy', inline: 'closed' },
  grimace: { asset: 'grimace', inline: 'closed' },
  sleep: { asset: 'sleep', inline: 'closed' },
  'talk-t': { asset: 'talk-t', inline: 'closed' },
  'talk-fv': { asset: 'talk-fv', inline: 'closed' },
};

const MOUTH_LOOKUP: Record<string, { asset: string; inline: MouthType }> = {
  open: { asset: 'talk-a', inline: 'open' },
  a: { asset: 'talk-a', inline: 'open' },
  round: { asset: 'talk-o', inline: 'round' },
  o: { asset: 'talk-o', inline: 'round' },
  smile: { asset: 'smile', inline: 'smile' },
  i: { asset: 'smile', inline: 'smile' },
  closed: { asset: 'talk-closed', inline: 'closed' },
};

function resolveBodyAsset(body?: string): string {
  if (!body) return 'standing';
  return BODY_MAP[body] ?? body;
}

function resolveEyesAsset(eyes?: string): { asset: string; inline: EyesType } {
  if (!eyes) return { asset: 'open', inline: 'open' };
  return EYES_LOOKUP[eyes] ?? { asset: eyes, inline: 'open' };
}

function resolveBeakAsset(beak?: string, mouth?: string): { asset: string; inline: MouthType } {
  if (beak) {
    return BEAK_LOOKUP[beak] ?? { asset: beak, inline: 'closed' };
  }
  if (mouth) {
    return MOUTH_LOOKUP[mouth] ?? { asset: 'talk-closed', inline: 'closed' };
  }
  return { asset: 'default', inline: 'closed' };
}

interface RenderSvgOptions {
  body: string;
  bodyMarkup: string;
  eyesAsset: string;
  inlineEyes: EyesType;
  beakAsset: string;
  inlineMouth: MouthType;
  particle: ParticlePlacement | null;
  particleId?: string | undefined;
  bodyAnimClass: string;
}

const InlineFallback: FC<{ eyes: EyesType; mouth: MouthType }> = ({ eyes, mouth }) => (
  <G className="aptipiou-vector-inline-fallback" aria-hidden="true">
    <AptipiouEyes state={eyes} />
    <AptipiouMouth viseme={mouth} />
  </G>
);

function renderSvg({
  body,
  bodyMarkup,
  eyesAsset,
  inlineEyes,
  beakAsset,
  inlineMouth,
  particle,
  particleId,
  bodyAnimClass,
}: RenderSvgOptions): ReactNode {
  return (
    <Svg
      viewBox="0 0 512 512"
      width="100%"
      height="100%"
      className={`aptipiou-vector-svg ${bodyAnimClass}`}
      data-body={body}
      data-beak={beakAsset}
      data-eyes={eyesAsset}
      data-particle={particleId}
      aria-hidden="true"
    >
      {bodyMarkup ? (
        <G dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
      ) : (
        <SvgImage href={`/mascot/body/${body}.svg`} x="0" y="0" width="512" height="512" />
      )}
      <G className="mascot-asset-references" aria-hidden="true">
        <SvgImage href={`/mascot/body/${body}.svg`} x="0" y="0" width="512" height="512" />
        <SvgImage href={`/mascot/eyes/${eyesAsset}.svg`} x="0" y="0" width="512" height="512" />
        <SvgImage href={`/mascot/beak/${beakAsset}.svg`} x="0" y="0" width="512" height="512" />
        {particle && (
          <SvgImage
            href={particle.path}
            x={particle.x}
            y={particle.y}
            width={particle.width}
            height={particle.height}
          />
        )}
      </G>
      <InlineFallback eyes={inlineEyes} mouth={inlineMouth} />
    </Svg>
  );
}

export const AptipiouVector: FC<AptipiouVectorProps> = (props) => {
  const animated = useAptipiouAnimation({
    mouth: props.mouth,
    eyes: props.eyes,
    body: props.body,
    mood: props.mood,
  });

  const bodyAsset = resolveBodyAsset(props.body ?? animated.body);
  const bodyMarkup = useBodySvg(bodyAsset);
  const { asset: eyesAsset, inline: inlineEyes } = resolveEyesAsset(props.eyes ?? animated.eyes);
  const { asset: beakAsset, inline: inlineMouth } = resolveBeakAsset(
    props.beak,
    props.mouth ?? animated.mouth,
  );
  const particle = resolveParticle(props.particle);

  useEffect(() => {
    prefetchBodies(COMMON_BODIES);
  }, []);

  const size = props.size ?? 192;
  const bodyAnimClass = `aptipiou-body-${animated.body}`;
  const particleId = typeof props.particle === 'string' ? props.particle : undefined;
  const svgContent = renderSvg({
    body: bodyAsset,
    bodyMarkup,
    eyesAsset,
    inlineEyes,
    beakAsset,
    inlineMouth,
    particle,
    particleId,
    bodyAnimClass,
  });
  const className = `aptipiou-vector-container ${props.className ?? ''}`;

  if (props.onClick) {
    return (
      <Box
        role="button"
        tabIndex={0}
        className={className}
        width={`${size}px`}
        height={`${size}px`}
        onClick={props.onClick}
        onKeyDown={props.onKeyDown}
        aria-label={props['aria-label']}
      >
        {svgContent}
      </Box>
    );
  }

  return (
    <Box
      className={className}
      width={`${size}px`}
      height={`${size}px`}
      aria-label={props['aria-label']}
    >
      {svgContent}
    </Box>
  );
};
