import { useEffect, useRef, useState } from 'react';
import { deriveModularLayers, isIdleBlinkAllowed } from './mascotPresets.ts';
import type { MascotAnimation, MascotExpression, MascotViseme } from './types.ts';
import type { useMascotAudio } from './useMascotAudio.ts';

const FLIGHT_FRAMES = ['fly-upstroke', 'fly-glide', 'fly-downstroke', 'fly-bank'] as const;

interface ModularState {
  body: string;
  eyes: string;
  beak: string;
  particle?: string | undefined;
}

function runLanding(
  setLandingStep: (state: ModularState) => void,
  onLandAudio: () => void,
  onDone?: () => void,
) {
  const t0 = setTimeout(() => {
    setLandingStep({ body: 'land-touchdown', eyes: 'open', beak: 'default' });
  }, 0);

  const t1 = setTimeout(() => {
    setLandingStep({
      body: 'land-impact',
      eyes: 'squint',
      beak: 'grimace',
      particle: 'dust-ground',
    });
  }, 80);

  const t2 = setTimeout(() => {
    setLandingStep({
      body: 'land-settle',
      eyes: 'squint',
      beak: 'grimace',
      particle: 'dust-ground',
    });
    onLandAudio();
  }, 170);

  const t3 = setTimeout(() => {
    setLandingStep({ body: 'land-rebound', eyes: 'happy', beak: 'smile' });
  }, 310);

  const t4 = setTimeout(() => {
    setLandingStep({ body: 'land-stand', eyes: 'open', beak: 'default' });
  }, 420);

  const t5 = setTimeout(() => onDone?.(), 530);

  return () => [t0, t1, t2, t3, t4, t5].forEach(clearTimeout);
}

function runFlydown(setFlightBody: (b: string) => void, playFlap: () => void, onDone: () => void) {
  let step = 0;
  playFlap();
  const iv = setInterval(() => {
    setFlightBody(FLIGHT_FRAMES[step % FLIGHT_FRAMES.length] || 'fly-glide');
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

function runIdleBlink(setBlinkEyes: (e: string) => void) {
  let bTimer: number;
  let rTimer: number;
  let dTimer: number;
  let dRestoreTimer: number;

  const onRestore = (isDouble: boolean) => {
    setBlinkEyes('open');
    if (!isDouble) {
      schedule();
      return;
    }
    dTimer = window.setTimeout(() => {
      setBlinkEyes('blink');
      dRestoreTimer = window.setTimeout(() => {
        setBlinkEyes('open');
        schedule();
      }, 120);
    }, 80);
  };

  const doBlink = () => {
    setBlinkEyes('blink');
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

export interface UseMascotFrameProps {
  anim: MascotAnimation;
  expr: MascotExpression;
  vis: MascotViseme;
  audio: ReturnType<typeof useMascotAudio>;
  onEnd?: ((a: MascotAnimation) => void) | undefined;
}

export interface MascotFrameResult {
  frame: string;
  body: string;
  eyes: string;
  beak: string;
  particle?: string | undefined;
  active: MascotAnimation;
}

export function useMascotFrame({
  anim,
  expr,
  vis,
  audio,
  onEnd,
}: UseMascotFrameProps): MascotFrameResult {
  const [flightBody, setFlightBody] = useState<string>('fly-upstroke');
  const [landingState, setLandingState] = useState<ModularState>({
    body: 'land-touchdown',
    eyes: 'open',
    beak: 'default',
  });
  const [blinkEyes, setBlinkEyes] = useState<string>('open');
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
      return runFlydown(setFlightBody, audioRef.current.playFlap, () => setInternalAnim('landing'));
    }
    if (active === 'landing') {
      return runLanding(setLandingState, audioRef.current.playLand, () => {
        setInternalAnim('idle');
        onEndRef.current?.('landing');
      });
    }
    if (active === 'idle' && isIdleBlinkAllowed(expr, vis)) {
      return runIdleBlink(setBlinkEyes);
    }
  }, [active, expr, vis]);

  if (active === 'flydown') {
    return { frame: flightBody, body: flightBody, eyes: 'open', beak: 'default', active };
  }

  if (active === 'landing') {
    return {
      frame: landingState.body,
      body: landingState.body,
      eyes: landingState.eyes,
      beak: landingState.beak,
      particle: landingState.particle,
      active,
    };
  }

  const layers = deriveModularLayers({ expr, active, vis, blinkEyes });

  return {
    frame: layers.body,
    body: layers.body,
    eyes: layers.eyes,
    beak: layers.beak,
    particle: layers.particle,
    active,
  };
}
