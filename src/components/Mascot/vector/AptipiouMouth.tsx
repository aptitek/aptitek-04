import type { FC } from 'react';
import { G, Path, Ellipse } from './svg-primitives.ts';
import type { AptipiouMouth as MouthType } from './types.ts';

interface AptipiouMouthProps {
  viseme: MouthType;
}

const BEAK_SCALE_TRANSFORM = 'translate(281, 242) scale(1.45) translate(-281, -242)';

// Authentic Aptipiou upper beak geometry from original vector design
const UPPER_BEAK_D =
  'm 280.22,241.43 c -10.47,-1.10 -18.41,-4.86 -18.41,-8.71 0.00,-2.14 5.03,-7.76 9.71,-10.83 7.93,-5.21 16.14,-4.15 25.84,3.34 4.42,3.42 6.85,6.09 7.80,8.58 0.68,1.79 0.68,1.89 -0.12,2.97 -0.45,0.61 -1.60,1.55 -2.55,2.08 -3.71,2.07 -14.79,3.35 -22.26,2.56 z';

const ClosedMouth: FC = () => (
  <G id="mouth-shape-closed" className="aptipiou-mouth-closed" transform={BEAK_SCALE_TRANSFORM}>
    {/* Lower yellow beak connected at corners */}
    <Path
      d="M 262 238 Q 281 258 300 238 Z"
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Upper beak */}
    <Path
      d={UPPER_BEAK_D}
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Center seam */}
    <Path
      d="M 262 239 Q 281 243 300 239"
      fill="none"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </G>
);

const OpenMouth: FC = () => (
  <G id="mouth-shape-open" className="aptipiou-mouth-open" transform={BEAK_SCALE_TRANSFORM}>
    {/* Lower yellow beak connected at corners */}
    <Path
      d="M 262 238 Q 281 265 300 238 Z"
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Open oral cavity inside connected beak */}
    <Path d="M 264 240 C 264 257 298 257 298 240 Z" fill="var(--colors-base03)" />
    <Path
      d="M 269 246 C 274 243 288 243 293 246 C 293 255 269 255 269 246 Z"
      fill="var(--colors-red)"
    />
    {/* Upper beak */}
    <Path
      d={UPPER_BEAK_D}
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </G>
);

const RoundMouth: FC = () => (
  <G id="mouth-shape-round" className="aptipiou-mouth-round" transform={BEAK_SCALE_TRANSFORM}>
    {/* Lower yellow beak connected at corners */}
    <Path
      d="M 262 238 Q 281 262 300 238 Z"
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Round cavity inside connected beak */}
    <Ellipse cx="281" cy="246" rx="8.5" ry="9.5" fill="var(--colors-base03)" />
    <Ellipse cx="281" cy="248" rx="5" ry="5" fill="var(--colors-red)" />
    {/* Upper beak */}
    <Path
      d={UPPER_BEAK_D}
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </G>
);

const SmileMouth: FC = () => (
  <G id="mouth-shape-smile" className="aptipiou-mouth-smile" transform={BEAK_SCALE_TRANSFORM}>
    {/* Lower yellow beak connected at corners */}
    <Path
      d="M 262 238 Q 281 261 300 238 Z"
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Smile cavity inside connected beak */}
    <Path d="M 265 240 Q 281 253 297 240 Z" fill="var(--colors-base03)" />
    <Path d="M 268 245 Q 281 252 294 245 Z" fill="var(--colors-red)" />
    {/* Upper beak */}
    <Path
      d={UPPER_BEAK_D}
      fill="var(--colors-yellow)"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </G>
);

export const AptipiouMouth: FC<AptipiouMouthProps> = ({ viseme }) => {
  if (viseme === 'open' || viseme === 'a') {
    return <OpenMouth />;
  }
  if (viseme === 'round' || viseme === 'o') {
    return <RoundMouth />;
  }
  if (viseme === 'smile' || viseme === 'i') {
    return <SmileMouth />;
  }
  return <ClosedMouth />;
};
