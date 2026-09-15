import type { FC, KeyboardEvent, ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import type { MascotProps } from './types.ts';
import { useMascotAudio } from './useMascotAudio.ts';
import { useMascotFrame } from './useMascotFrame.ts';
import { AptipiouVector } from './vector/index.ts';
import './mascot.css';

const ANIM_CLASSES: Record<string, string> = {
  flydown: 'mascot-anim-flydown',
  happy: 'mascot-anim-happy',
  idle: 'mascot-anim-idle',
  celebrate: 'mascot-anim-happy',
  wave: 'mascot-anim-idle',
  thinking: 'mascot-anim-idle',
  thumbsup: 'mascot-anim-idle',
};

function handleKey(cb: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cb();
    }
  };
}

interface RenderMascotOptions {
  size: number;
  body: string;
  eyes: string;
  beak: string;
  particle?: string | undefined;
  animClass: string;
}

function renderContent({
  size,
  body,
  eyes,
  beak,
  particle,
  animClass,
}: RenderMascotOptions): ReactNode {
  return (
    <AptipiouVector
      size={size}
      body={body}
      eyes={eyes}
      beak={beak}
      particle={particle}
      className={animClass}
    />
  );
}

export const Mascot: FC<MascotProps> = (props) => {
  const size = props.size ?? 192;
  const className = props.className ?? '';
  const audio = useMascotAudio({ enabled: true });
  const { body, eyes, beak, particle, active } = useMascotFrame({
    anim: props.animation ?? 'idle',
    expr: props.expression ?? 'idle',
    vis: props.viseme ?? 'closed',
    audio,
    onEnd: props.onAnimationEnd,
  });

  const animClass = ANIM_CLASSES[active] ?? '';
  const content = renderContent({ size, body, eyes, beak, particle, animClass });

  if (props.onClick) {
    return (
      <Box
        role="button"
        tabIndex={0}
        className={`mascot-container ${className}`}
        width={`${size}px`}
        height={`${size}px`}
        onClick={props.onClick}
        onKeyDown={handleKey(props.onClick)}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box className={`mascot-container ${className}`} width={`${size}px`} height={`${size}px`}>
      {content}
    </Box>
  );
};
