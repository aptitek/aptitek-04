import type { FC, KeyboardEvent } from 'react';
import { Box } from 'styled-system/jsx';
import type { MascotAnimation, MascotExpression, MascotViseme } from './types.ts';
import { Mascot } from './Mascot.tsx';

export interface MascotTerminalStageProps {
  animation: MascotAnimation;
  expression: MascotExpression;
  viseme: MascotViseme;
  alt: string;
  onPoke: () => void;
  isLanded?: boolean;
}

export const MascotTerminalStage: FC<MascotTerminalStageProps> = ({
  animation,
  expression,
  viseme,
  alt,
  onPoke,
  isLanded = true,
}) => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPoke();
    }
  };

  const stageClass = isLanded
    ? 'mascot-stage mascot-stage--landed'
    : 'mascot-stage mascot-stage--waiting';

  return (
    <Box className="mascot-stage-wrapper">
      <Box
        role="button"
        tabIndex={0}
        className={stageClass}
        onClick={onPoke}
        onKeyDown={handleKey}
        aria-label={alt}
        title={alt}
      >
        {isLanded ? (
          <Mascot animation={animation} expression={expression} viseme={viseme} size={192} />
        ) : (
          <Box className="mascot-stage-target-perch" aria-hidden="true" />
        )}
      </Box>
    </Box>
  );
};
