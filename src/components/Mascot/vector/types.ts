import type { KeyboardEvent } from 'react';

export type AptipiouMouth = 'closed' | 'open' | 'round' | 'smile' | 'a' | 'o' | 'i';

export type AptipiouEyes = 'open' | 'blink' | 'happy' | 'wink' | 'squint';

export type AptipiouBody = 'idle' | 'talk' | 'bounce' | 'think' | 'wave';

export type AptipiouMood = 'neutral' | 'happy' | 'thinking' | 'surprised' | 'love';

export interface ParticlePlacement {
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AptipiouVectorProps {
  mouth?: AptipiouMouth | string | undefined;
  eyes?: AptipiouEyes | string | undefined;
  body?: AptipiouBody | string | undefined;
  beak?: string | undefined;
  particle?: string | ParticlePlacement | undefined;
  mood?: AptipiouMood | undefined;
  size?: number | undefined;
  className?: string | undefined;
  onClick?: (() => void) | undefined;
  onKeyDown?: ((e: KeyboardEvent) => void) | undefined;
  'aria-label'?: string | undefined;
}
