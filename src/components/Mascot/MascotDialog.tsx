import type { FC, KeyboardEvent, MouseEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box } from 'styled-system/jsx';
import { useTranslations } from '../../i18n/index.ts';
import type { DialogStep, MascotExpression, MascotViseme, MascotDialogProps } from './types.ts';
import { useMascotAudio } from './useMascotAudio.ts';

interface CharEvent {
  char: string;
  expression?: MascotExpression | undefined;
}

const CHAR_VISEME_MAP: Record<string, MascotViseme> = {
  a: 'a',
  e: 'e',
  i: 'i',
  o: 'o',
  u: 'u',
  f: 'fv',
  v: 'fv',
  l: 'lth',
  w: 'woo',
  q: 'woo',
  s: 'shch',
  z: 'shch',
  j: 'shch',
  m: 'closed',
  b: 'closed',
  p: 'closed',
  t: 't',
  d: 't',
  c: 't',
  n: 't',
  k: 'wide',
  r: 'wide',
  g: 'wide',
  h: 'wide',
  x: 'wide',
  '!': 'smile',
  '?': 'smile',
  ':': 'smile',
  ';': 'smile',
};

function charToViseme(char: string): MascotViseme {
  return CHAR_VISEME_MAP[char.toLowerCase()] || 'closed';
}

function parseTokens(raw: string): CharEvent[] {
  const regex = /\[([a-z-]+)\]/g;
  const events: CharEvent[] = [];
  let lastIndex = 0;
  let match;
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

function playSyllable(audio: ReturnType<typeof useMascotAudio>, ch: string, pitch = 520) {
  if (ch.trim()) {
    audio.playChirp(pitch, 0.035);
  }
}

function getCharDelay(ch: string): number {
  return '.!?'.includes(ch) ? 180 : 35;
}

interface TypewriterHookProps {
  step: DialogStep | undefined;
  onVis?: ((v: MascotViseme) => void) | undefined;
  onExp?: ((e: MascotExpression) => void) | undefined;
  audio: ReturnType<typeof useMascotAudio>;
}

interface TextState {
  acc: string;
  setText: (t: string) => void;
}

function applyChar(item: CharEvent, p: TypewriterHookProps, state: TextState): string {
  if (item.expression) p.onExp?.(item.expression);
  if (!item.char) return state.acc;
  const nextAcc = state.acc + item.char;
  state.setText(nextAcc);
  p.onVis?.(charToViseme(item.char));
  playSyllable(p.audio, item.char, p.step?.audioPitch);
  return nextAcc;
}

function useTypewriter(p: TypewriterHookProps) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!p.step) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (p.step.expression) p.onExp?.(p.step.expression);

    const seq = parseTokens(p.step.text);
    let idx = 0;
    let acc = '';

    const stepChar = () => {
      if (idx >= seq.length) {
        setIsTyping(false);
        p.onVis?.('closed');
        return;
      }
      const item = seq[idx++];
      if (!item) return;
      acc = applyChar(item, p, { acc, setText });
      const delay = item.char ? getCharDelay(item.char) : 0;
      timerRef.current = window.setTimeout(stepChar, delay);
    };

    const startTimer = setTimeout(() => {
      setIsTyping(true);
      stepChar();
    }, 0);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      p.onVis?.('closed');
    };
  }, [p]);

  return { text, setText, isTyping, setIsTyping, timerRef };
}

const MascotBubbleHeader: FC<{
  name: string;
  soundEnabled: boolean;
  muteLabel: string;
  onToggle?: (() => void) | undefined;
}> = ({ name, soundEnabled, muteLabel, onToggle }) => {
  return (
    <Box className="mascot-dialog-header">
      <Box as="span">{name}</Box>
      {onToggle && (
        <Box
          role="button"
          tabIndex={0}
          className="mascot-sound-btn"
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            onToggle();
          }}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onToggle();
            }
          }}
          title={muteLabel}
        >
          <Box as="span">{soundEnabled ? '🔊' : '🔇'}</Box>
        </Box>
      )}
    </Box>
  );
};

export const MascotDialog: FC<MascotDialogProps> = (props) => {
  const t = useTranslations(props.locale ?? 'en');
  const [stepIndex, setStepIndex] = useState(0);
  const soundEnabled = props.soundEnabled ?? true;
  const audio = useMascotAudio({ enabled: soundEnabled });
  const currentStep = props.script[stepIndex];
  const { text, setText, isTyping, setIsTyping, timerRef } = useTypewriter({
    step: currentStep,
    onVis: props.onVisemeChange,
    onExp: props.onExpressionChange,
    audio,
  });

  const handleAdvance = () => {
    if (isTyping && currentStep) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setText(currentStep.text.replace(/\[[a-z-]+\]/g, ''));
      setIsTyping(false);
      props.onVisemeChange?.('closed');
    } else if (stepIndex < props.script.length - 1) {
      setStepIndex((p) => p + 1);
    } else {
      props.onComplete?.();
    }
  };

  if (!currentStep) return null;

  return (
    <Box
      role="button"
      tabIndex={0}
      className="mascot-dialog-bubble"
      onClick={handleAdvance}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvance();
        }
      }}
    >
      <MascotBubbleHeader
        name={t.mascotName}
        soundEnabled={soundEnabled}
        muteLabel={soundEnabled ? t.mascotMute : t.mascotUnmute}
        onToggle={props.onSoundToggle}
      />
      <Box as="p" className="mascot-dialog-text">
        {text}
        {isTyping && <Box as="span" className="mascot-cursor" />}
      </Box>
      <Box className="mascot-dialog-footer">
        <Box as="span">
          {isTyping
            ? t.mascotSkip
            : stepIndex < props.script.length - 1
              ? t.mascotNext
              : t.mascotDone}
        </Box>
      </Box>
    </Box>
  );
};
