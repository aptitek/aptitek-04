import type { FC, ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import type {
  AptipiouEyes as EyesType,
  AptipiouMouth as MouthType,
  AptipiouVectorProps,
} from './types.ts';
import { Svg } from './svg-primitives.ts';
import { AptipiouBaseSvg } from './AptipiouBaseSvg.tsx';
import { AptipiouEyes } from './AptipiouEyes.tsx';
import { AptipiouMouth } from './AptipiouMouth.tsx';
import { useAptipiouAnimation } from './useAptipiouAnimation.ts';
import './aptipiou-vector.css';

function renderSvg(eyes: EyesType, mouth: MouthType, bodyAnimClass: string): ReactNode {
  return (
    <Svg
      viewBox="0 0 512 512"
      width="100%"
      height="100%"
      className={`aptipiou-vector-svg ${bodyAnimClass}`}
      aria-hidden="true"
    >
      <AptipiouBaseSvg />
      <AptipiouEyes state={eyes} />
      <AptipiouMouth viseme={mouth} />
    </Svg>
  );
}

export const AptipiouVector: FC<AptipiouVectorProps> = (props) => {
  const animated = useAptipiouAnimation({
    mouth: props.mouth,
    eyes: props.eyes,
    body: props.body,
    mood: props.mood,
  });

  const size = props.size ?? 192;
  const bodyAnimClass = `aptipiou-body-${animated.body}`;
  const svgContent = renderSvg(animated.eyes, animated.mouth, bodyAnimClass);
  const className = `aptipiou-vector-container ${props.className ?? ''}`;

  if (props.onClick) {
    return (
      <Box
        role="button"
        tabIndex={0}
        className={className}
        width={`${size}px`}
        height={`${size}px`}
        onClick={props.onClick}
        onKeyDown={props.onKeyDown}
        aria-label={props['aria-label']}
      >
        {svgContent}
      </Box>
    );
  }

  return (
    <Box
      className={className}
      width={`${size}px`}
      height={`${size}px`}
      aria-label={props['aria-label']}
    >
      {svgContent}
    </Box>
  );
};
