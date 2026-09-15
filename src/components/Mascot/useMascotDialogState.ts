import { useState, useCallback, useMemo } from 'react';
import type {
  DialogStep,
  MascotAnimation,
  MascotExpression,
  MascotViseme,
  MascotDialogProps,
} from './types.ts';
import { useTranslations } from '../../i18n/index.ts';
import { useMascotAudio } from './useMascotAudio.ts';
import { useMascotTypewriter } from './useMascotTypewriter.ts';
import { useSoundState } from './useSoundState.ts';

function useDialogueScript(propScript?: DialogStep[], locale = 'fr') {
  const t = useTranslations(locale);
  const defaultScript = useMemo<DialogStep[]>(
    () => [
      { text: t.mascotDialogueStep1, audioPitch: 680 },
      { text: t.mascotDialogueStep2, audioPitch: 720 },
      { text: t.mascotDialogueStep3, audioPitch: 700 },
    ],
    [t],
  );
  const activeScript = propScript && propScript.length > 0 ? propScript : defaultScript;
  return { t, activeScript };
}

function useMascotPosing(
  onVis?: ((v: MascotViseme) => void) | undefined,
  onExp?: ((e: MascotExpression) => void) | undefined,
) {
  const [viseme, setViseme] = useState<MascotViseme>('closed');
  const [expression, setExpression] = useState<MascotExpression>('idle');
  const [anim, setAnim] = useState<MascotAnimation>('idle');

  const handleVisChange = useCallback(
    (v: MascotViseme) => {
      setViseme(v);
      onVis?.(v);
    },
    [onVis],
  );

  const handleExpChange = useCallback(
    (e: MascotExpression) => {
      setExpression(e);
      onExp?.(e);
      if (['wave', 'celebrate', 'thinking', 'thumbsup'].includes(e)) {
        setAnim(e as MascotAnimation);
      } else if (e === 'idle' || e === 'neutral') {
        setAnim('idle');
      }
    },
    [onExp],
  );

  return { viseme, expression, anim, handleVisChange, handleExpChange };
}

export function useMascotDialogState(props: MascotDialogProps) {
  const { t, activeScript } = useDialogueScript(props.script, props.locale);
  const { soundEnabled } = useSoundState(props.soundEnabled, props.onSoundToggle);
  const audio = useMascotAudio({ enabled: soundEnabled });
  const [stepIndex, setStepIndex] = useState(0);

  const { viseme, expression, anim, handleVisChange, handleExpChange } = useMascotPosing(
    props.onVisemeChange,
    props.onExpressionChange,
  );

  const currentStep = activeScript[stepIndex] || activeScript[0];
  const { displayedText, isTyping, fastForward } = useMascotTypewriter({
    step: currentStep,
    audio,
    onVisemeChange: handleVisChange,
    onExpressionChange: handleExpChange,
  });

  const handleAdvance = useCallback(() => {
    if (isTyping) {
      fastForward();
    } else if (stepIndex < activeScript.length - 1) {
      setStepIndex((p) => p + 1);
    } else {
      props.onComplete?.();
    }
  }, [isTyping, fastForward, stepIndex, activeScript.length, props]);

  const handlePoke = useCallback(() => {
    audio.playHappy();
    handleExpChange('celebrate');
    setTimeout(() => handleExpChange('idle'), 1800);
  }, [audio, handleExpChange]);

  return {
    t,
    stepIndex,
    setStepIndex,
    activeScript,
    anim,
    expression,
    viseme,
    displayedText,
    isTyping,
    handleAdvance,
    handlePoke,
  };
}
