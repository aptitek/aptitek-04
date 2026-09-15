import type { MascotAnimation, MascotExpression, MascotViseme } from './types.ts';

export interface ExpressionPreset {
  body: string;
  eyes: string;
  beak: string;
  particle?: string | undefined;
}

const VISEME_BEAK_MAP: Record<MascotViseme, string> = {
  closed: 'talk-closed',
  a: 'talk-a',
  e: 'talk-e',
  i: 'talk-i',
  o: 'talk-o',
  u: 'talk-u',
  wide: 'talk-wide',
  t: 'talk-t',
  smile: 'smile',
  grin: 'grin',
  fv: 'talk-fv',
  lth: 'talk-t',
  woo: 'talk-u',
  shch: 'talk-e',
};

const EXPRESSION_PRESETS: Record<MascotExpression, ExpressionPreset> = {
  idle: { body: 'standing', eyes: 'open', beak: 'default' },
  neutral: { body: 'standing', eyes: 'open', beak: 'default' },
  curious: { body: 'standing', eyes: 'open', beak: 'smirk', particle: 'bubble-question' },
  alert: { body: 'standing', eyes: 'open', beak: 'surprise', particle: 'bubble-alert' },
  cry: { body: 'standing', eyes: 'cry', beak: 'pout', particle: 'drop-tear' },
  sweat: { body: 'standing', eyes: 'squint', beak: 'grimace', particle: 'drop-sweat-large' },
  laugh: { body: 'happy-bounce', eyes: 'laugh', beak: 'laugh', particle: 'sparkle' },
  shocked: { body: 'standing', eyes: 'shocked', beak: 'shocked', particle: 'shock-lines' },
  surprise: { body: 'standing', eyes: 'open', beak: 'surprise', particle: 'shock-lines' },
  dizzy: { body: 'standing', eyes: 'dizzy', beak: 'dizzy', particle: 'bubble-dizzy' },
  love: { body: 'standing', eyes: 'love', beak: 'smile', particle: 'heart-large' },
  blush: { body: 'standing', eyes: 'happy', beak: 'smile', particle: 'heart-sparkle' },
  wink: { body: 'standing', eyes: 'wink', beak: 'grin' },
  grin: { body: 'standing', eyes: 'happy', beak: 'grin' },
  sleep: { body: 'sleep', eyes: 'blink', beak: 'sleep', particle: 'sleep-z-large' },
  wave: { body: 'action-wave', eyes: 'happy', beak: 'smile' },
  thumbsup: { body: 'action-thumbsup', eyes: 'happy', beak: 'smile' },
  thinking: { body: 'action-thinking', eyes: 'squint', beak: 'smirk', particle: 'cloud-thought' },
  celebrate: { body: 'action-celebrate', eyes: 'happy', beak: 'laugh', particle: 'sparkle' },
};

const ANIMATION_OVERRIDES: Partial<Record<MascotAnimation, ExpressionPreset>> = {
  wave: { body: 'action-wave', eyes: 'happy', beak: 'smile' },
  thumbsup: { body: 'action-thumbsup', eyes: 'happy', beak: 'smile' },
  thinking: {
    body: 'action-thinking',
    eyes: 'squint',
    beak: 'smirk',
    particle: 'cloud-thought',
  },
  celebrate: { body: 'action-celebrate', eyes: 'happy', beak: 'laugh', particle: 'sparkle' },
  happy: { body: 'happy-bounce', eyes: 'happy', beak: 'smile' },
};

export function isIdleBlinkAllowed(expr: MascotExpression, vis: MascotViseme): boolean {
  const isNeutralExpr = !expr || expr === 'idle' || expr === 'neutral';
  const isClosedVis = !vis || vis === 'closed';
  return isNeutralExpr && isClosedVis;
}

function resolveSpeechBeak(vis: MascotViseme, active: MascotAnimation, fallback: string): string {
  if (vis && vis !== 'closed') {
    return VISEME_BEAK_MAP[vis] || 'talk-closed';
  }
  if (active === 'speaking') {
    return VISEME_BEAK_MAP[vis] || 'talk-a';
  }
  return fallback;
}

function getBasePreset(expr: MascotExpression, active: MascotAnimation): ExpressionPreset {
  const override = ANIMATION_OVERRIDES[active];
  if (override) return override;
  return EXPRESSION_PRESETS[expr] || EXPRESSION_PRESETS.idle;
}

function resolveEyes(baseEyes: string, blinkEyes: string, shouldBlink: boolean): string {
  if (shouldBlink) {
    return blinkEyes;
  }
  return baseEyes;
}

interface DeriveOptions {
  expr: MascotExpression;
  active: MascotAnimation;
  vis: MascotViseme;
  blinkEyes: string;
}

export function deriveModularLayers({
  expr,
  active,
  vis,
  blinkEyes,
}: DeriveOptions): ExpressionPreset {
  const base = getBasePreset(expr, active);
  const beak = resolveSpeechBeak(vis, active, base.beak);
  const shouldBlink = active === 'idle' && isIdleBlinkAllowed(expr, vis);
  const eyes = resolveEyes(base.eyes, blinkEyes, shouldBlink);

  return {
    body: base.body,
    eyes,
    beak,
    particle: base.particle,
  };
}
