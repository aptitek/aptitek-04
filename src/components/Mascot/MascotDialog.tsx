import { useRef, type FC } from 'react';
import { Box } from 'styled-system/jsx';
import type { MascotDialogProps } from './types.ts';
import { useMascotDialogState } from './useMascotDialogState.ts';
import { MascotTerminalStage } from './MascotTerminalStage.tsx';
import { MascotTerminalBubble } from './MascotTerminalBubble.tsx';
import { useFlightIntersectionObserver } from './useFlightIntersectionObserver.ts';
import './mascot.css';

export const MascotDialog: FC<MascotDialogProps> = (props) => {
  const {
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
    scrollyState,
  } = useMascotDialogState(props);

  const sectionRef = useRef<HTMLElement | null>(null);
  useFlightIntersectionObserver(sectionRef);

  const containerClass = props.className
    ? `mascot-terminal-section ${props.className}`
    : 'mascot-terminal-section';

  const isLanded =
    typeof window === 'undefined' || scrollyState.hasLanded || scrollyState.state === 'landed';

  return (
    <Box
      as="section"
      ref={sectionRef as never}
      className={containerClass}
      data-testid={props['data-testid'] ?? 'mascot-dialog-section'}
    >
      <MascotTerminalStage
        animation={isTyping ? 'speaking' : anim}
        expression={expression}
        viseme={viseme}
        alt={t.mascotAlt}
        onPoke={handlePoke}
        isLanded={isLanded}
      />
      <MascotTerminalBubble
        title={t.mascotTerminalTitle}
        displayedText={displayedText}
        isTyping={isTyping}
        stepIndex={stepIndex}
        totalSteps={activeScript.length}
        skipLabel={t.mascotSkip}
        nextLabel={t.mascotNext}
        replayLabel={t.mascotReplay}
        onAdvance={handleAdvance}
        onSelectStep={setStepIndex}
        onReplay={() => setStepIndex(0)}
      />
    </Box>
  );
};
