import type { FC } from 'react';
import { Box } from 'styled-system/jsx';
import { Svg, Path } from './vector/svg-primitives.ts';

const LEAF_BODY_PATH = 'M12 2C8 6 4 11 6 17C8 23 15 22 18 17C21 12 16 6 12 2Z';
const LEAF_RIB_PATH = 'M12 4V19';

function LeafSvg({ className }: { className: string }): React.ReactNode {
  return (
    <Svg viewBox="0 0 24 24" className={className}>
      <Path d={LEAF_BODY_PATH} stroke="currentColor" strokeWidth="1.2" />
      <Path d={LEAF_RIB_PATH} stroke="currentColor" strokeWidth="0.8" />
    </Svg>
  );
}

export const FlightLeaves: FC = () => (
  <Box className="mascot-flight-leaf-stream" aria-hidden="true">
    <LeafSvg className="mascot-flight-leaf leaf-1" />
    <LeafSvg className="mascot-flight-leaf leaf-2" />
    <LeafSvg className="mascot-flight-leaf leaf-3" />
    <LeafSvg className="mascot-flight-leaf leaf-4" />
    <LeafSvg className="mascot-flight-leaf leaf-5" />
  </Box>
);
