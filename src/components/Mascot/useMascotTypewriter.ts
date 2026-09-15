import { useState, useEffect, useRef, useCallback } from 'react';
import type { DialogStep, MascotExpression, MascotViseme } from './types.ts';
import type { useMascotAudio } from './useMascotAudio.ts';

interface RefHolder<T> {
  current: T;
}

interface CharEvent {
  char: string;
  expression?: MascotExpression | undefined;
}

interface CharContext {
  audio: ReturnType<typeof useMascotAudio>;
  pitch: number | undefined;
  onVis?: ((v: MascotViseme) => void) | undefined;
  onExp?: ((e: MascotExpression) => void) | undefined;
}

interface TypewriterRunParams {
  seq: CharEvent[];
  stepPitch: number | undefined;
  stepExpr: MascotExpression | undefined;
  audioRef: RefHolder<ReturnType<typeof useMascotAudio>>;
  onVisemeRef: RefHolder<((v: MascotViseme) => void) | undefined>;
  onExpRef: RefHolder<((e: MascotExpression) => void) | undefined>;
  timerRef: RefHolder<number | null>;
  setDisplayedText: (s: string) => void;
  setIsTyping: (b: boolean) => void;
}

// Simplified iconic visemes: only the main speech shapes
const MAIN_VISEME_MAP: Record<string, MascotViseme> = {
  // Open A vowels
  a: 'a',
  à: 'a',
  â: 'a',
  // Rounded O / U vowels
  o: 'o',
  ô: 'o',
  u: 'o',
  ù: 'o',
  û: 'o',
  w: 'o',
  // Narrow / front I / E vowels
  i: 'i',
  î: 'i',
  ï: 'i',
  y: 'i',
  e: 'i',
  é: 'i',
  è: 'i',
  ê: 'i',
  ë: 'i',
  // Exclamations / happy punctuation
  '!': 'smile',
  '?': 'smile',
};

const CLOSING_CHARS = new Set([' ', '-', '_', '.', ',', ';', ':', '…', 'm', 'p', 'b']);
const VISEME_COOLDOWN_MS = 150;

function getTargetViseme(char: string): MascotViseme | null {
  const lower = char.toLowerCase();
  if (CLOSING_CHARS.has(lower)) return 'closed';
  return MAIN_VISEME_MAP[lower] ?? null;
}

function parseTokens(raw: string): CharEvent[] {
  const regex = /\[([a-z-]+)\]/g;
  const events: CharEvent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      for (const ch of raw.slice(lastIndex, match.index)) events.push({ char: ch });
    }
    events.push({ char: '', expression: match[1] as MascotExpression });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < raw.length) {
    for (const ch of raw.slice(lastIndex)) events.push({ char: ch });
  }
  return events;
}

function getCharDelay(ch: string): number {
  if (',;:'.includes(ch)) return 140;
  if ('.!?'.includes(ch)) return 240;
  return 36;
}

interface VisemeThrottleState {
  current: MascotViseme;
  lastTime: number;
}

function shouldUpdateViseme(
  target: MascotViseme | null,
  state: VisemeThrottleState,
  ch: string,
): boolean {
  if (!target || target === state.current) return false;
  if (target === 'closed' && ' .,;:!?'.includes(ch)) return true;
  return Date.now() - state.lastTime >= VISEME_COOLDOWN_MS;
}

function processChar(item: CharEvent, ctx: CharContext, state: VisemeThrottleState): string {
  if (item.expression) ctx.onExp?.(item.expression);
  if (!item.char) return '';

  const target = getTargetViseme(item.char);
  if (shouldUpdateViseme(target, state, item.char) && target) {
    state.current = target;
    state.lastTime = Date.now();
    ctx.onVis?.(target);
  }

  ctx.audio.playCheepVoice(item.char, ctx.pitch ?? 680);
  return item.char;
}

function runTypewriter(p: TypewriterRunParams) {
  let acc = '';
  let idx = 0;
  const visemeState: VisemeThrottleState = {
    current: 'closed',
    lastTime: 0,
  };

  const stepChar = () => {
    if (idx >= p.seq.length) {
      p.setIsTyping(false);
      p.onVisemeRef.current?.('closed');
      window.setTimeout(() => {
        p.onExpRef.current?.('idle');
      }, 1800);
      return;
    }
    const item = p.seq[idx++];
    if (!item) return;

    const charAdded = processChar(
      item,
      {
        audio: p.audioRef.current,
        pitch: p.stepPitch,
        onVis: p.onVisemeRef.current,
        onExp: p.onExpRef.current,
      },
      visemeState,
    );
    if (charAdded) {
      acc += charAdded;
      p.setDisplayedText(acc);
    }
    const delay = item.char ? getCharDelay(item.char) : 0;
    p.timerRef.current = window.setTimeout(stepChar, delay);
  };

  const startTimer = window.setTimeout(() => {
    p.setDisplayedText('');
    p.setIsTyping(true);
    p.onVisemeRef.current?.('closed');
    if (p.stepExpr) p.onExpRef.current?.(p.stepExpr);
    stepChar();
  }, 40);

  return () => {
    clearTimeout(startTimer);
    if (p.timerRef.current) clearTimeout(p.timerRef.current);
    p.onVisemeRef.current?.('closed');
  };
}

export interface TypewriterOptions {
  step: DialogStep | undefined;
  audio: ReturnType<typeof useMascotAudio>;
  onVisemeChange?: ((v: MascotViseme) => void) | undefined;
  onExpressionChange?: ((e: MascotExpression) => void) | undefined;
}

export function useMascotTypewriter({
  step,
  audio,
  onVisemeChange,
  onExpressionChange,
}: TypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<number | null>(null);

  const audioRef = useRef(audio);
  const onVisemeRef = useRef(onVisemeChange);
  const onExpRef = useRef(onExpressionChange);

  useEffect(() => {
    audioRef.current = audio;
    onVisemeRef.current = onVisemeChange;
    onExpRef.current = onExpressionChange;
  }, [audio, onVisemeChange, onExpressionChange]);

  const stepText = step?.text;
  const stepPitch = step?.audioPitch;
  const stepExpr = step?.expression;

  useEffect(() => {
    if (!stepText) return;
    const seq = parseTokens(stepText);
    return runTypewriter({
      seq,
      stepPitch,
      stepExpr,
      audioRef,
      onVisemeRef,
      onExpRef,
      timerRef,
      setDisplayedText,
      setIsTyping,
    });
  }, [stepText, stepPitch, stepExpr]);

  const fastForward = useCallback(() => {
    if (!stepText) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedText(stepText.replace(/\[[a-z-]+\]/g, ''));
    setIsTyping(false);
    onVisemeRef.current?.('closed');
    window.setTimeout(() => {
      onExpRef.current?.('idle');
    }, 1800);
  }, [stepText]);

  return { displayedText, isTyping, fastForward, timerRef };
}
