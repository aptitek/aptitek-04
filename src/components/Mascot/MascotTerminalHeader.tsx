import type { FC } from 'react';
import { Box } from 'styled-system/jsx';

export interface MascotTerminalHeaderProps {
  title: string;
  stepIndex: number;
  totalSteps: number;
}

export const MascotTerminalHeader: FC<MascotTerminalHeaderProps> = ({
  title,
  stepIndex,
  totalSteps,
}) => {
  return (
    <Box className="mascot-terminal-header">
      <Box className="mascot-terminal-dots">
        <Box as="span" className="mascot-dot mascot-dot-red" />
        <Box as="span" className="mascot-dot mascot-dot-yellow" />
        <Box as="span" className="mascot-dot mascot-dot-green" />
      </Box>
      <Box as="span" className="mascot-terminal-title">
        {title}
      </Box>
      <Box className="mascot-terminal-tools">
        <Box as="span" className="mascot-step-badge">
          {stepIndex + 1} / {totalSteps}
        </Box>
      </Box>
    </Box>
  );
};
