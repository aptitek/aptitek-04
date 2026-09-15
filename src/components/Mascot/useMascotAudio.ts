import { useCallback, useMemo, useRef } from 'react';

export interface MascotAudioOptions {
  enabled?: boolean;
}

interface ThudParams {
  startFreq: number;
  endFreq: number;
  dur: number;
  vol: number;
}

interface PhonemeProfile {
  pitchMult: number;
  toneLength: number;
}

const VOWELS = 'aeiouyéèêëàâîïôùû';
const SIBILANTS = 'szfvcjxç';
const PLOSIVES = 'bdgptk';
const HAPPY_FREQS = [523.25, 659.25, 783.99, 1046.5] as const;
const PUNCT_SKIP = new Set('.!?,:;-_"\'()[]{}«»');

function shouldSkipCheep(enabled: boolean, char: string | undefined): boolean {
  if (!enabled || !char || !char.trim()) return true;
  return PUNCT_SKIP.has(char);
}

function getPhonemeProfile(char: string): PhonemeProfile {
  const lower = char.toLowerCase();
  if (VOWELS.includes(lower)) {
    return { pitchMult: 1.16, toneLength: 0.038 };
  }
  if (SIBILANTS.includes(lower)) {
    return { pitchMult: 1.25, toneLength: 0.03 };
  }
  if (PLOSIVES.includes(lower)) {
    return { pitchMult: 0.94, toneLength: 0.026 };
  }
  return { pitchMult: 1.04, toneLength: 0.032 };
}

function computeCheepPitch(basePitch: number, profile: PhonemeProfile): number {
  const jitter = 1 + (Math.random() * 0.05 - 0.025);
  return basePitch * profile.pitchMult * jitter;
}

function createChirp(ctx: AudioContext, pitch: number, length: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(pitch, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(pitch * 1.25, ctx.currentTime + length);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + length);
}

function createCheepVoice(ctx: AudioContext, pitch: number, length: number) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(pitch, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(pitch * 1.32, ctx.currentTime + length * 0.7);
  osc.frequency.exponentialRampToValueAtTime(pitch * 1.15, ctx.currentTime + length);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2600, ctx.currentTime);

  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + length + 0.005);
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
  const lastCheepTimeRef = useRef<number>(0);

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

  const playCheepVoice = useCallback(
    (char: string, basePitch = 680) => {
      if (shouldSkipCheep(enabled, char)) return;

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (now - lastCheepTimeRef.current < 28) return;
      lastCheepTimeRef.current = now;

      const ctx = getCtx();
      if (!ctx) return;

      const profile = getPhonemeProfile(char);
      const targetPitch = computeCheepPitch(basePitch, profile);
      createCheepVoice(ctx, targetPitch, profile.toneLength);
    },
    [enabled, getCtx],
  );

  const playChirp = useCallback(
    (pitch = 520, length = 0.045) => {
      const ctx = enabled ? getCtx() : null;
      if (ctx) createChirp(ctx, pitch, length);
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
    HAPPY_FREQS.forEach((freq, i) => {
      setTimeout(() => playChirp(freq, 0.07), i * 70);
    });
  }, [playChirp]);

  return useMemo(
    () => ({ playCheepVoice, playChirp, playLand, playFlap, playHappy }),
    [playCheepVoice, playChirp, playLand, playFlap, playHappy],
  );
}
