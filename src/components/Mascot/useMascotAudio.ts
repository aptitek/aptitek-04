import { useCallback, useRef } from 'react';

export interface MascotAudioOptions {
  enabled?: boolean;
}

interface ThudParams {
  startFreq: number;
  endFreq: number;
  dur: number;
  vol: number;
}

function createChirp(ctx: AudioContext, pitch: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(pitch, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(pitch * 1.25, ctx.currentTime + duration);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function createThud(ctx: AudioContext, p: ThudParams) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(p.startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(p.endFreq, ctx.currentTime + p.dur);
  gain.gain.setValueAtTime(p.vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.dur + 0.02);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + p.dur + 0.02);
}

export function useMascotAudio(options: MascotAudioOptions = {}) {
  const { enabled = true } = options;
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const playChirp = useCallback(
    (pitch = 520, duration = 0.045) => {
      const ctx = enabled ? getCtx() : null;
      if (ctx) createChirp(ctx, pitch, duration);
    },
    [enabled, getCtx],
  );

  const playLand = useCallback(() => {
    const ctx = enabled ? getCtx() : null;
    if (ctx) createThud(ctx, { startFreq: 160, endFreq: 45, dur: 0.12, vol: 0.18 });
  }, [enabled, getCtx]);

  const playFlap = useCallback(() => {
    const ctx = enabled ? getCtx() : null;
    if (ctx) createThud(ctx, { startFreq: 320, endFreq: 180, dur: 0.06, vol: 0.06 });
  }, [enabled, getCtx]);

  const playHappy = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playChirp(freq, 0.07), i * 70);
    });
  }, [playChirp]);

  return { playChirp, playLand, playFlap, playHappy };
}
