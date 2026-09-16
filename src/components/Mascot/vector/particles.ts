import type { ParticlePlacement } from './types.ts';

const PARTICLE_MAP: Record<string, ParticlePlacement> = {
  'heart-large': {
    path: '/mascot/particles/hearts/heart-large.svg',
    x: 390,
    y: 120,
    width: 64,
    height: 64,
  },
  'heart-medium': {
    path: '/mascot/particles/hearts/heart-medium.svg',
    x: 390,
    y: 260,
    width: 48,
    height: 48,
  },
  'heart-small': {
    path: '/mascot/particles/hearts/heart-small.svg',
    x: 60,
    y: 120,
    width: 32,
    height: 32,
  },
  'heart-sparkle': {
    path: '/mascot/particles/hearts/heart-sparkle.svg',
    x: 380,
    y: 50,
    width: 64,
    height: 64,
  },
  'cloud-thought': {
    path: '/mascot/particles/clouds/cloud-thought.svg',
    x: 370,
    y: 30,
    width: 96,
    height: 72,
  },
  'dust-ground': {
    path: '/mascot/particles/clouds/dust-ground.svg',
    x: 176,
    y: 440,
    width: 160,
    height: 64,
  },
  'dust-puff-large': {
    path: '/mascot/particles/clouds/dust-puff-large.svg',
    x: 130,
    y: 440,
    width: 64,
    height: 64,
  },
  'dust-puff-medium': {
    path: '/mascot/particles/clouds/dust-puff-medium.svg',
    x: 310,
    y: 440,
    width: 48,
    height: 48,
  },
  'dust-puff-small': {
    path: '/mascot/particles/clouds/dust-puff-small.svg',
    x: 240,
    y: 460,
    width: 32,
    height: 32,
  },
  bubbles: {
    path: '/mascot/particles/bubbles/bubble-large.svg',
    x: 295,
    y: 235,
    width: 56,
    height: 56,
  },
  'bubble-large': {
    path: '/mascot/particles/bubbles/bubble-large.svg',
    x: 295,
    y: 235,
    width: 56,
    height: 56,
  },
  'bubble-medium': {
    path: '/mascot/particles/bubbles/bubble-medium.svg',
    x: 298,
    y: 238,
    width: 44,
    height: 44,
  },
  'bubble-small': {
    path: '/mascot/particles/bubbles/bubble-small.svg',
    x: 300,
    y: 242,
    width: 32,
    height: 32,
  },
  'sleep-z-large': {
    path: '/mascot/particles/bubbles/sleep-z-large.svg',
    x: 390,
    y: 50,
    width: 48,
    height: 48,
  },
  'sleep-z-medium': {
    path: '/mascot/particles/bubbles/sleep-z-medium.svg',
    x: 360,
    y: 90,
    width: 36,
    height: 36,
  },
  'sleep-z-small': {
    path: '/mascot/particles/bubbles/sleep-z-small.svg',
    x: 340,
    y: 130,
    width: 24,
    height: 24,
  },
  'bubble-question': {
    path: '/mascot/particles/emotes/bubble-question.svg',
    x: 370,
    y: 50,
    width: 72,
    height: 72,
  },
  'bubble-alert': {
    path: '/mascot/particles/emotes/bubble-alert.svg',
    x: 370,
    y: 50,
    width: 72,
    height: 72,
  },
  'bubble-dizzy': {
    path: '/mascot/particles/emotes/bubble-dizzy.svg',
    x: 370,
    y: 50,
    width: 72,
    height: 72,
  },
  sparkle: {
    path: '/mascot/particles/emotes/sparkle.svg',
    x: 380,
    y: 60,
    width: 48,
    height: 48,
  },
  'shock-lines': {
    path: '/mascot/particles/emotes/shock-lines.svg',
    x: 50,
    y: 100,
    width: 64,
    height: 64,
  },
  'drop-sweat-large': {
    path: '/mascot/particles/drops/drop-sweat-large.svg',
    x: 360,
    y: 110,
    width: 48,
    height: 64,
  },
  'drop-sweat-small': {
    path: '/mascot/particles/drops/drop-sweat-small.svg',
    x: 370,
    y: 140,
    width: 32,
    height: 40,
  },
  'drop-tear': {
    path: '/mascot/particles/drops/drop-tear.svg',
    x: 170,
    y: 250,
    width: 40,
    height: 56,
  },
  'sweat-splash': {
    path: '/mascot/particles/drops/sweat-splash.svg',
    x: 390,
    y: 120,
    width: 48,
    height: 48,
  },
};

export function resolveParticle(
  particle?: string | ParticlePlacement | undefined,
): ParticlePlacement | null {
  if (!particle) return null;
  if (typeof particle === 'object' && 'path' in particle) {
    return particle;
  }
  if (PARTICLE_MAP[particle]) {
    return PARTICLE_MAP[particle];
  }
  if (particle.startsWith('/') || particle.endsWith('.svg')) {
    return {
      path: particle,
      x: 0,
      y: 0,
      width: 512,
      height: 512,
    };
  }
  return null;
}
