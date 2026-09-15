import type { SupportedLocale } from '../../i18n/index.ts';

export type MascotAnimation =
  | 'flydown'
  | 'landing'
  | 'happy'
  | 'idle'
  | 'speaking'
  | 'wave'
  | 'celebrate'
  | 'thinking'
  | 'thumbsup';

export type MascotExpression =
  | 'idle'
  | 'neutral'
  | 'curious'
  | 'alert'
  | 'cry'
  | 'sweat'
  | 'laugh'
  | 'shocked'
  | 'surprise'
  | 'dizzy'
  | 'love'
  | 'blush'
  | 'wink'
  | 'grin'
  | 'sleep'
  | 'wave'
  | 'thumbsup'
  | 'thinking'
  | 'celebrate';

export type MascotViseme =
  | 'closed'
  | 'a'
  | 'e'
  | 'i'
  | 'o'
  | 'u'
  | 'wide'
  | 't'
  | 'smile'
  | 'grin'
  | 'fv'
  | 'lth'
  | 'woo'
  | 'shch';

export interface DialogStep {
  text: string;
  expression?: MascotExpression | undefined;
  audioPitch?: number | undefined;
  pauseAfterMs?: number | undefined;
}

export interface MascotProps {
  animation?: MascotAnimation | undefined;
  expression?: MascotExpression | undefined;
  viseme?: MascotViseme | undefined;
  size?: number | undefined;
  className?: string | undefined;
  onAnimationEnd?: ((animation: MascotAnimation) => void) | undefined;
  onClick?: (() => void) | undefined;
}

export interface MascotDialogProps {
  script: DialogStep[];
  onVisemeChange?: ((viseme: MascotViseme) => void) | undefined;
  onExpressionChange?: ((expression: MascotExpression) => void) | undefined;
  onComplete?: (() => void) | undefined;
  soundEnabled?: boolean | undefined;
  onSoundToggle?: (() => void) | undefined;
  locale?: SupportedLocale | undefined;
}
