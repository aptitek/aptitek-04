import type { FC, KeyboardEvent } from 'react';
import { Box } from 'styled-system/jsx';
import { MascotTerminalHeader } from './MascotTerminalHeader.tsx';
import { MascotTerminalToolbar } from './MascotTerminalToolbar.tsx';

export interface MascotTerminalBubbleProps {
  title: string;
  displayedText: string;
  isTyping: boolean;
  stepIndex: number;
  totalSteps: number;
  skipLabel: string;
  nextLabel: string;
  replayLabel: string;
  onAdvance: () => void;
  onSelectStep: (index: number) => void;
  onReplay: () => void;
}

export const MascotTerminalBubble: FC<MascotTerminalBubbleProps> = ({
  title,
  displayedText,
  isTyping,
  stepIndex,
  totalSteps,
  skipLabel,
  nextLabel,
  replayLabel,
  onAdvance,
  onSelectStep,
  onReplay,
}) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onAdvance();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      className="mascot-terminal-bubble mascot-speech-bubble mascot-dialog-bubble"
      onClick={onAdvance}
      onKeyDown={handleKeyDown}
    >
      <Box className="mascot-bubble-tail" />
      <MascotTerminalHeader title={title} stepIndex={stepIndex} totalSteps={totalSteps} />
      <Box className="mascot-bubble-body">
        <Box as="p" className="mascot-dialog-mono-text">
          {displayedText}
          {isTyping && <Box as="span" className="mascot-cursor" />}
        </Box>
      </Box>
      <MascotTerminalToolbar
        totalSteps={totalSteps}
        stepIndex={stepIndex}
        isTyping={isTyping}
        skipLabel={skipLabel}
        nextLabel={nextLabel}
        replayLabel={replayLabel}
        onSelectStep={onSelectStep}
        onAdvance={onAdvance}
        onReplay={onReplay}
      />
    </Box>
  );
};
