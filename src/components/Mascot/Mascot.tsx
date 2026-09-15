import type { FC, KeyboardEvent, ReactNode } from 'react';
import { createElement } from 'react';
import { Box } from 'styled-system/jsx';
import type { MascotAnimation, MascotExpression, MascotProps, MascotViseme } from './types.ts';
import { useMascotAudio } from './useMascotAudio.ts';
import { useMascotFrame } from './useMascotFrame.ts';
import {
  AptipiouVector,
  type AptipiouBody,
  type AptipiouEyes,
  type AptipiouMood,
  type AptipiouMouth,
} from './vector/index.ts';
import './mascot.css';

const SPRITE_BASE = '/sprites/mascot';

const ANIM_CLASSES: Record<string, string> = {
  flydown: 'mascot-anim-flydown',
  happy: 'mascot-anim-happy',
  idle: 'mascot-anim-idle',
  celebrate: 'mascot-anim-happy',
  wave: 'mascot-anim-idle',
  thinking: 'mascot-anim-idle',
  thumbsup: 'mascot-anim-idle',
};

const VISEME_TO_MOUTH: Record<string, AptipiouMouth> = {
  o: 'round',
  u: 'round',
  woo: 'round',
  smile: 'smile',
  grin: 'smile',
  a: 'open',
  e: 'open',
  i: 'open',
  wide: 'open',
  t: 'open',
  closed: 'closed',
};

function mapVisemeToMouth(viseme?: MascotViseme, active?: MascotAnimation): AptipiouMouth {
  if (viseme && VISEME_TO_MOUTH[viseme]) {
    return VISEME_TO_MOUTH[viseme];
  }
  if (active === 'speaking' && !viseme) {
    return 'open';
  }
  return 'closed';
}

function mapExprToEyes(
  expr?: MascotExpression,
  active?: MascotAnimation,
): AptipiouEyes | undefined {
  if (expr === 'love' || expr === 'blush' || expr === 'celebrate' || active === 'happy') {
    return 'happy';
  }
  if (expr === 'thinking') return 'squint';
  if (expr === 'wink') return 'wink';
  return undefined;
}

function mapAnimToBody(active?: MascotAnimation): AptipiouBody {
  if (active === 'speaking') return 'talk';
  if (active === 'happy' || active === 'celebrate') return 'bounce';
  return 'idle';
}

function mapExprToMood(expr?: MascotExpression): AptipiouMood {
  if (expr === 'celebrate') return 'happy';
  if (expr === 'love' || expr === 'blush') return 'love';
  if (expr === 'thinking') return 'thinking';
  if (expr === 'shocked' || expr === 'surprise') return 'surprised';
  return 'neutral';
}

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
  active: MascotAnimation;
  frame: string;
  props: MascotProps;
  animClass: string;
}

function renderContent({ size, active, frame, props, animClass }: RenderMascotOptions): ReactNode {
  if (active === 'flydown' || active === 'landing') {
    return (
      <Box
        className={`mascot-sprite-wrapper ${animClass}`}
        width={`${size}px`}
        height={`${size}px`}
      >
        {createElement('img', {
          src: `${SPRITE_BASE}/${frame}.svg`,
          alt: '',
          'aria-hidden': 'true',
          className: 'mascot-sprite-img',
          draggable: false,
        })}
      </Box>
    );
  }

  return (
    <AptipiouVector
      size={size}
      mouth={mapVisemeToMouth(props.viseme, active)}
      eyes={mapExprToEyes(props.expression, active)}
      body={mapAnimToBody(active)}
      mood={mapExprToMood(props.expression)}
      className={animClass}
    />
  );
}

export const Mascot: FC<MascotProps> = (props) => {
  const size = props.size ?? 192;
  const className = props.className ?? '';
  const audio = useMascotAudio({ enabled: true });
  const { frame, active } = useMascotFrame({
    anim: props.animation ?? 'idle',
    expr: props.expression ?? 'idle',
    vis: props.viseme ?? 'closed',
    audio,
    onEnd: props.onAnimationEnd,
  });

  const animClass = ANIM_CLASSES[active] ?? '';
  const content = renderContent({ size, active, frame, props, animClass });

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
