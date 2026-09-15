import type { FC, KeyboardEvent, MouseEvent } from 'react';
import { Box } from 'styled-system/jsx';

export interface MascotTerminalToolbarProps {
  totalSteps: number;
  stepIndex: number;
  isTyping: boolean;
  skipLabel: string;
  nextLabel: string;
  replayLabel: string;
  onSelectStep: (index: number) => void;
  onAdvance: () => void;
  onReplay: () => void;
}

const ActionBtn: FC<{
  isReplay: boolean;
  label: string;
  onClick: () => void;
}> = ({ isReplay, label, onClick }) => {
  const cls = isReplay
    ? 'mascot-action-btn mascot-action-btn-replay'
    : 'mascot-action-btn mascot-action-btn-next';

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      className={cls}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={handleKey}
    >
      {label}
    </Box>
  );
};

export const MascotTerminalToolbar: FC<MascotTerminalToolbarProps> = ({
  totalSteps,
  stepIndex,
  isTyping,
  skipLabel,
  nextLabel,
  replayLabel,
  onSelectStep,
  onAdvance,
  onReplay,
}) => {
  const isLastStep = stepIndex >= totalSteps - 1;
  const isReplay = isLastStep && !isTyping;
  const label = isReplay ? replayLabel : isTyping ? skipLabel : nextLabel;
  const onAction = isReplay ? onReplay : onAdvance;

  const handleStepKey = (i: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      onSelectStep(i);
    }
  };

  return (
    <Box className="mascot-terminal-toolbar">
      <Box className="mascot-step-dots" role="tablist">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Box
            key={i}
            role="tab"
            tabIndex={0}
            aria-selected={i === stepIndex}
            aria-label={`Step ${i + 1}`}
            className={`mascot-step-dot ${i === stepIndex ? 'mascot-step-dot--active' : ''}`}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              onSelectStep(i);
            }}
            onKeyDown={handleStepKey(i)}
          />
        ))}
      </Box>

      <Box className="mascot-toolbar-buttons">
        <ActionBtn isReplay={isReplay} label={label} onClick={onAction} />
      </Box>
    </Box>
  );
};
