/**
 * Holographic and Sheen Physics Tokens
 * Mathematical rainbow foil gradients, physical lighting reflections, and spring physics.
 */

import { md3Tokens } from './md3.ts';

export const holoGradient = `radial-gradient(
  circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
  rgba(255, 0, 0, 0) 0%,
  rgba(255, 0, 0, 0) 10%,
  rgba(255, 0, 0, 0.45) 20%,
  rgba(255, 165, 0, 0.45) 30%,
  rgba(255, 255, 0, 0.45) 40%,
  rgba(0, 128, 0, 0.45) 50%,
  rgba(0, 255, 255, 0.45) 60%,
  rgba(0, 0, 255, 0.45) 70%,
  rgba(138, 43, 226, 0.45) 80%,
  rgba(138, 43, 226, 0) 90%,
  rgba(138, 43, 226, 0) 100%
)`;

export const sheenGradient = `radial-gradient(
  circle at center,
  rgba(255, 255, 255, 0.15) 0%,
  transparent 60%
)`;

export const cardPhysicsTokens = {
  tilt: {
    stiffness: 300,
    damping: 30,
    mass: 1.0,
    maxAngleDeg: 15,
  },
  flip: {
    durationMs: 600,
    easing: md3Tokens.easings.emphasized.value,
  },
} as const;
