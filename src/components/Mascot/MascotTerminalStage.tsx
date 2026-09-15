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
}

export const MascotTerminalStage: FC<MascotTerminalStageProps> = ({
  animation,
  expression,
  viseme,
  alt,
  onPoke,
}) => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPoke();
    }
  };

  return (
    <Box className="mascot-stage-wrapper">
      <Box
        role="button"
        tabIndex={0}
        className="mascot-stage"
        onClick={onPoke}
        onKeyDown={handleKey}
        aria-label={alt}
        title={alt}
      >
        <Mascot animation={animation} expression={expression} viseme={viseme} size={192} />
      </Box>
    </Box>
  );
};
