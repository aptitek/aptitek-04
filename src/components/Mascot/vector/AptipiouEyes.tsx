import type { FC } from 'react';
import { G, Path, Circle, Ellipse } from './svg-primitives.ts';
import type { AptipiouEyes as EyesType } from './types.ts';

interface AptipiouEyesProps {
  state: EyesType;
}

const LeftPupil: FC = () => (
  <G id="eye-left-pupil">
    <Ellipse cx="206" cy="216" rx="20" ry="24" fill="var(--colors-base03)" />
    <Circle cx="210" cy="207" r="6.5" fill="var(--colors-base3)" />
    <Circle cx="202" cy="223" r="2.8" fill="var(--colors-base3)" opacity="0.85" />
  </G>
);

const RightPupil: FC = () => (
  <G id="eye-right-pupil">
    <Ellipse cx="346" cy="204" rx="19" ry="23" fill="var(--colors-base03)" />
    <Circle cx="341" cy="196" r="6" fill="var(--colors-base3)" />
    <Circle cx="349" cy="211" r="2.6" fill="var(--colors-base3)" opacity="0.85" />
  </G>
);

const LeftBlink: FC = () => (
  <Path
    d="M 172 222 Q 194 238 218 222"
    fill="none"
    stroke="var(--colors-base03)"
    strokeWidth="6.5"
    strokeLinecap="round"
  />
);

const RightBlink: FC = () => (
  <Path
    d="M 330 209 Q 352 225 374 209"
    fill="none"
    stroke="var(--colors-base03)"
    strokeWidth="6.5"
    strokeLinecap="round"
  />
);

const LeftHappy: FC = () => (
  <Path
    d="M 174 226 Q 195 200 216 226"
    fill="none"
    stroke="var(--colors-base03)"
    strokeWidth="6.5"
    strokeLinecap="round"
  />
);

const RightHappy: FC = () => (
  <Path
    d="M 332 213 Q 353 188 373 213"
    fill="none"
    stroke="var(--colors-base03)"
    strokeWidth="6.5"
    strokeLinecap="round"
  />
);

const SquintEyes: FC = () => (
  <G id="eyes-squint-group">
    <Path
      d="M 174 220 Q 196 226 218 216"
      fill="none"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <Ellipse cx="198" cy="222" rx="10" ry="8" fill="var(--colors-base03)" />
    <Path
      d="M 330 207 Q 352 213 374 203"
      fill="none"
      stroke="var(--colors-base03)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <Ellipse cx="352" cy="209" rx="10" ry="8" fill="var(--colors-base03)" />
  </G>
);

export const AptipiouEyes: FC<AptipiouEyesProps> = ({ state }) => {
  if (state === 'blink') {
    return (
      <G id="eyes-group" className="aptipiou-eyes aptipiou-eyes-blink">
        <LeftBlink />
        <RightBlink />
      </G>
    );
  }

  if (state === 'happy') {
    return (
      <G id="eyes-group" className="aptipiou-eyes aptipiou-eyes-happy">
        <LeftHappy />
        <RightHappy />
      </G>
    );
  }

  if (state === 'wink') {
    return (
      <G id="eyes-group" className="aptipiou-eyes aptipiou-eyes-wink">
        <LeftPupil />
        <RightHappy />
      </G>
    );
  }

  if (state === 'squint') {
    return (
      <G id="eyes-group" className="aptipiou-eyes aptipiou-eyes-squint">
        <SquintEyes />
      </G>
    );
  }

  return (
    <G id="eyes-group" className="aptipiou-eyes aptipiou-eyes-open">
      <LeftPupil />
      <RightPupil />
    </G>
  );
};
