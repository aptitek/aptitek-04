/**
 * Holographic and Sheen Physics Tokens
 * Mathematical rainbow foil gradients, physical lighting reflections, and spring physics.
 * Adheres strictly to Solarized spectral harmonies and base3 highlights.
 */

import { md3Tokens } from './md3.ts';

export const holoGradient = `radial-gradient(
  circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
  rgba(220, 50, 47, 0) 0%,
  rgba(220, 50, 47, 0) 10%,
  rgba(220, 50, 47, 0.45) 20%,
  rgba(203, 75, 22, 0.45) 30%,
  rgba(181, 137, 0, 0.45) 40%,
  rgba(133, 153, 0, 0.45) 50%,
  rgba(42, 161, 152, 0.45) 60%,
  rgba(38, 139, 210, 0.45) 70%,
  rgba(108, 113, 196, 0.45) 80%,
  rgba(211, 54, 130, 0) 90%,
  rgba(211, 54, 130, 0) 100%
)`;

export const sheenGradient = `radial-gradient(
  circle at center,
  rgba(253, 246, 227, 0.15) 0%,
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
