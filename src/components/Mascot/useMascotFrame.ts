import { useEffect, useRef, useState } from 'react';
import type { MascotAnimation, MascotExpression, MascotViseme } from './types.ts';
import type { useMascotAudio } from './useMascotAudio.ts';

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
  wave: 'action-wave',
  thumbsup: 'action-thumbsup',
  thinking: 'action-thinking',
  celebrate: 'action-celebrate',
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
  fv: 'talk-fv',
  lth: 'talk-lth',
  woo: 'talk-woo',
  shch: 'talk-shch',
};

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

function runFlydown(setFrame: (f: string) => void, playFlap: () => void, onDone: () => void) {
  let step = 0;
  playFlap();
  const frames = ['fly-1', 'fly-2', 'fly-3', 'fly-4'];
  const iv = setInterval(() => {
    setFrame(frames[step % frames.length] || 'fly-1');
    if (step % 2 === 0) playFlap();
    step++;
  }, 100);
  const t = setTimeout(() => {
    clearInterval(iv);
    onDone();
  }, 900);
  return () => {
    clearInterval(iv);
    clearTimeout(t);
  };
}

function runIdleBlink(setFrame: (f: string) => void) {
  let bTimer: number;
  let rTimer: number;
  let dTimer: number;
  let dRestoreTimer: number;

  const onRestore = (isDouble: boolean) => {
    setFrame('idle');
    if (!isDouble) {
      schedule();
      return;
    }
    dTimer = window.setTimeout(() => {
      setFrame('eye-closed');
      dRestoreTimer = window.setTimeout(() => {
        setFrame('idle');
        schedule();
      }, 120);
    }, 80);
  };

  const doBlink = () => {
    setFrame('eye-closed');
    const isDouble = Math.random() < 0.22;
    rTimer = window.setTimeout(() => onRestore(isDouble), 130);
  };

  const schedule = () => {
    bTimer = window.setTimeout(doBlink, 2000 + Math.random() * 2500);
  };

  schedule();
  return () => {
    clearTimeout(bTimer);
    clearTimeout(rTimer);
    clearTimeout(dTimer);
    clearTimeout(dRestoreTimer);
  };
}

interface ResolveFrameOptions {
  frame: string;
  active: MascotAnimation;
  expr: MascotExpression;
  vis: MascotViseme;
}

function getVisemeOrExpressionFrame(vis: MascotViseme, expr: MascotExpression): string | null {
  if (vis && vis !== 'closed') {
    return VISEME_MAP[vis] || 'talk-closed';
  }
  if (expr && expr !== 'idle' && expr !== 'neutral') {
    return EXPRESSION_MAP[expr] || 'idle';
  }
  return null;
}

function resolveFrame({ frame, active, expr, vis }: ResolveFrameOptions): string {
  if (active === 'flydown' || active === 'landing') {
    return frame;
  }
  const custom = getVisemeOrExpressionFrame(vis, expr);
  if (custom) return custom;
  if (active === 'speaking') {
    return VISEME_MAP[vis] || 'talk-closed';
  }
  return frame;
}

function isIdleBlinkAllowed(expr: MascotExpression, vis: MascotViseme): boolean {
  const isNeutralExpr = !expr || expr === 'idle' || expr === 'neutral';
  const isClosedVis = !vis || vis === 'closed';
  return isNeutralExpr && isClosedVis;
}

export interface UseMascotFrameProps {
  anim: MascotAnimation;
  expr: MascotExpression;
  vis: MascotViseme;
  audio: ReturnType<typeof useMascotAudio>;
  onEnd?: ((a: MascotAnimation) => void) | undefined;
}

export function useMascotFrame({ anim, expr, vis, audio, onEnd }: UseMascotFrameProps) {
  const [frame, setFrame] = useState<string>('idle');
  const [internalAnim, setInternalAnim] = useState<MascotAnimation | null>(null);
  const [prevAnim, setPrevAnim] = useState<MascotAnimation>(anim);

  if (prevAnim !== anim) {
    setPrevAnim(anim);
    setInternalAnim(null);
  }

  const active = internalAnim ?? anim;
  const audioRef = useRef(audio);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    audioRef.current = audio;
    onEndRef.current = onEnd;
  });

  useEffect(() => {
    if (active === 'flydown') {
      return runFlydown(setFrame, audioRef.current.playFlap, () => setInternalAnim('landing'));
    }
    if (active === 'landing') {
      return runLanding(setFrame, audioRef.current.playLand, () => {
        setInternalAnim('idle');
        onEndRef.current?.('landing');
      });
    }
    if (active === 'idle' && isIdleBlinkAllowed(expr, vis)) {
      return runIdleBlink(setFrame);
    }
  }, [active, expr, vis]);

  return { frame: resolveFrame({ frame, active, expr, vis }), active };
}
