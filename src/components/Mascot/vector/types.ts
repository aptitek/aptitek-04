import type { KeyboardEvent } from 'react';

export type AptipiouMouth = 'closed' | 'open' | 'round' | 'smile' | 'a' | 'o' | 'i';

export type AptipiouEyes = 'open' | 'blink' | 'happy' | 'wink' | 'squint';

export type AptipiouBody = 'idle' | 'talk' | 'bounce' | 'think' | 'wave';

export type AptipiouMood = 'neutral' | 'happy' | 'thinking' | 'surprised' | 'love';

export interface AptipiouVectorProps {
  mouth?: AptipiouMouth | undefined;
  eyes?: AptipiouEyes | undefined;
  body?: AptipiouBody | undefined;
  mood?: AptipiouMood | undefined;
  size?: number | undefined;
  className?: string | undefined;
  onClick?: (() => void) | undefined;
  onKeyDown?: ((e: KeyboardEvent) => void) | undefined;
  'aria-label'?: string | undefined;
}
