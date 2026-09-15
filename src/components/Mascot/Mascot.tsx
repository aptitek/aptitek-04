import type { FC, KeyboardEvent } from 'react';
import { createElement, useEffect, useState, useRef } from 'react';
import { Box } from 'styled-system/jsx';
import type { MascotAnimation, MascotExpression, MascotProps, MascotViseme } from './types.ts';
import { useMascotAudio } from './useMascotAudio.ts';
import './mascot.css';

const SPRITE_BASE = '/sprites/mascot';

const ANIM_CLASSES: Record<string, string> = {
  flydown: 'mascot-anim-flydown',
  happy: 'mascot-anim-happy',
  idle: 'mascot-anim-idle',
};

const EXPRESSION_MAP: Record<MascotExpression, string> = {
  idle: 'idle',
  neutral: 'idle',
  curious: 'expr-curious',
  alert: 'expr-alert',
  cry: 'expr-cry',
  sweat: 'expr-sweat',
  laugh: 'expr-laugh',
  shocked: 'expr-shocked',
  surprise: 'expr-surprise',
  dizzy: 'expr-dizzy',
  love: 'expr-love',
  blush: 'expr-blush-hearts',
  wink: 'expr-wink',
  grin: 'talk-grin',
  sleep: 'eye-sleep',
};

const VISEME_MAP: Record<MascotViseme, string> = {
  closed: 'talk-closed',
  a: 'talk-a',
  e: 'talk-e',
  i: 'talk-i',
  o: 'talk-o',
  u: 'talk-u',
  wide: 'talk-wide',
  t: 'talk-t',
  smile: 'talk-smile',
  grin: 'talk-grin',
};

function runBlink(setFrame: (f: string) => void, schedule: () => void) {
  setFrame('eye-closed');
  const t1 = setTimeout(() => {
    setFrame('idle');
    schedule();
  }, 140);
  return () => clearTimeout(t1);
}

function runLanding(setFrame: (f: string) => void, onLandAudio: () => void, onDone?: () => void) {
  const t0 = setTimeout(() => setFrame('land-1'), 0);
  const t1 = setTimeout(() => setFrame('land-2'), 80);
  const t2 = setTimeout(() => {
    setFrame('land-3');
    onLandAudio();
  }, 170);
  const t3 = setTimeout(() => setFrame('land-4'), 310);
  const t4 = setTimeout(() => setFrame('land-5'), 420);
  const t5 = setTimeout(() => onDone?.(), 530);
  return () => [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
}

interface FrameHookProps {
  anim: MascotAnimation;
  expr: MascotExpression;
  vis: MascotViseme;
  audio: ReturnType<typeof useMascotAudio>;
  onEnd?: ((a: MascotAnimation) => void) | undefined;
}

function useMascotFrame(p: FrameHookProps) {
  const [frame, setFrame] = useState<string>('idle');
  const [active, setActive] = useState<MascotAnimation>(p.anim);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setActive(p.anim), 0);
    return () => clearTimeout(t);
  }, [p.anim]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (active === 'flydown') {
      let step = 0;
      p.audio.playFlap();
      const frames = ['fly-1', 'fly-2', 'fly-3', 'fly-4'];
      const iv = setInterval(() => {
        setFrame(frames[step % frames.length] || 'fly-1');
        if (step % 2 === 0) p.audio.playFlap();
        step++;
      }, 100);
      timerRef.current = window.setTimeout(() => {
        clearInterval(iv);
        setActive('landing');
      }, 900);
      return () => {
        clearInterval(iv);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
    if (active === 'landing') {
      return runLanding(setFrame, p.audio.playLand, () => {
        setActive('idle');
        p.onEnd?.('landing');
      });
    }
    if (active === 'speaking') {
      const s = setTimeout(() => setFrame(VISEME_MAP[p.vis] || 'talk-closed'), 0);
      return () => clearTimeout(s);
    }
    if (p.expr && p.expr !== 'idle' && p.expr !== 'neutral') {
      const s = setTimeout(() => setFrame(EXPRESSION_MAP[p.expr] || 'idle'), 0);
      return () => clearTimeout(s);
    }
    let blinkTimer: number;
    const schedule = () => {
      blinkTimer = window.setTimeout(
        () => runBlink(setFrame, schedule),
        2500 + Math.random() * 3500,
      );
    };
    const s = setTimeout(() => {
      setFrame('idle');
      schedule();
    }, 0);
    return () => {
      clearTimeout(s);
      clearTimeout(blinkTimer);
    };
  }, [active, p]);

  return { frame, active };
}

function handleKey(cb: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cb();
    }
  };
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

  const animClass = ANIM_CLASSES[active] || '';
  const spriteImg = createElement('img', {
    src: `${SPRITE_BASE}/${frame}.png`,
    alt: '',
    'aria-hidden': 'true',
    className: 'mascot-sprite-img',
    draggable: false,
  });

  const imgContent = (
    <Box className={`mascot-sprite-wrapper ${animClass}`} width={`${size}px`} height={`${size}px`}>
      {spriteImg}
    </Box>
  );

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
        {imgContent}
      </Box>
    );
  }

  return (
    <Box className={`mascot-container ${className}`} width={`${size}px`} height={`${size}px`}>
      {imgContent}
    </Box>
  );
};
