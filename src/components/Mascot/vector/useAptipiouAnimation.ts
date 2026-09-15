import { useEffect, useRef, useState } from 'react';
import type { AptipiouBody, AptipiouEyes, AptipiouMood, AptipiouMouth } from './types.ts';

export interface UseAptipiouAnimationOptions {
  mouth?: AptipiouMouth | string | undefined;
  eyes?: AptipiouEyes | string | undefined;
  body?: AptipiouBody | string | undefined;
  mood?: AptipiouMood | undefined;
  isTyping?: boolean | undefined;
  disableBlink?: boolean | undefined;
}

const BLINK_DURATION_MS = 130;
const MIN_BLINK_INTERVAL_MS = 2200;
const MAX_BLINK_INTERVAL_MS = 4400;

function getRandomBlinkInterval(): number {
  const range = MAX_BLINK_INTERVAL_MS - MIN_BLINK_INTERVAL_MS;
  return MIN_BLINK_INTERVAL_MS + Math.floor(Math.random() * range);
}

function scheduleDoubleBlink(setBlink: (b: boolean) => void, onDone: () => void) {
  return setTimeout(() => {
    setBlink(true);
    setTimeout(() => {
      setBlink(false);
      onDone();
    }, BLINK_DURATION_MS);
  }, 90);
}

function handleBlinkClose(setBlink: (b: boolean) => void, onDone: () => void) {
  return setTimeout(() => {
    setBlink(false);
    if (Math.random() < 0.25) {
      scheduleDoubleBlink(setBlink, onDone);
    } else {
      onDone();
    }
  }, BLINK_DURATION_MS);
}

function runBlinkCycle(setBlink: (b: boolean) => void) {
  let timer: ReturnType<typeof setTimeout>;

  const schedule = () => {
    timer = setTimeout(() => {
      setBlink(true);
      timer = handleBlinkClose(setBlink, schedule);
    }, getRandomBlinkInterval());
  };

  schedule();
  return () => {
    clearTimeout(timer);
  };
}

function deriveEyes(
  propEyes: AptipiouEyes | string | undefined,
  isBlinking: boolean,
  mood: AptipiouMood,
): string {
  if (propEyes) return propEyes;
  if (isBlinking) return 'blink';
  if (mood === 'happy' || mood === 'love') return 'happy';
  if (mood === 'thinking') return 'squint';
  return 'open';
}

function deriveMouth(propMouth: AptipiouMouth | string | undefined, mood: AptipiouMood): string {
  if (propMouth) return propMouth;
  if (mood === 'happy' || mood === 'love') return 'smile';
  if (mood === 'surprised') return 'round';
  return 'closed';
}

function deriveBody(
  propBody: AptipiouBody | string | undefined,
  isTyping: boolean,
  mood: AptipiouMood,
): string {
  if (propBody) return propBody;
  if (isTyping) return 'talk';
  if (mood === 'thinking') return 'think';
  if (mood === 'happy') return 'bounce';
  return 'idle';
}

export function useAptipiouAnimation(options: UseAptipiouAnimationOptions = {}) {
  const {
    mouth: propMouth,
    eyes: propEyes,
    body: propBody,
    mood = 'neutral',
    isTyping = false,
    disableBlink = false,
  } = options;

  const [isBlinking, setIsBlinking] = useState(false);
  const isTypingRef = useRef(isTyping);
  const disableBlinkRef = useRef(disableBlink);

  useEffect(() => {
    isTypingRef.current = isTyping;
    disableBlinkRef.current = disableBlink;
  });

  useEffect(() => {
    if (disableBlink || isTyping) {
      return undefined;
    }
    return runBlinkCycle(setIsBlinking);
  }, [disableBlink, isTyping]);

  return {
    mouth: deriveMouth(propMouth, mood),
    eyes: deriveEyes(propEyes, isBlinking, mood),
    body: deriveBody(propBody, isTyping, mood),
    mood,
  };
}
