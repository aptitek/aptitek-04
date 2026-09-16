export interface Point2D {
  x: number;
  y: number;
}

export interface FlightCoordinates {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  angle: number;
}

export interface MascotFrameConfig {
  body: string;
  eyes: string;
  beak: string;
  particle?: string | undefined;
}

export interface LandingPoseTransform {
  offsetY: number;
  scaleX: number;
  scaleY: number;
  rotateDeg: number;
}

/**
 * Computes aerodynamic cubic bezier flight path coordinates with banking angle
 */
export function computeFlightCoordinates(
  progress: number,
  p0: Point2D,
  p3: Point2D,
): FlightCoordinates {
  const t = Math.max(0, Math.min(progress, 1));
  const dx = p3.x - p0.x;

  const p1: Point2D = {
    x: p0.x + Math.max(100, dx * 0.38),
    y: Math.max(40, p0.y - 190),
  };
  const p2: Point2D = {
    x: p0.x + dx * 0.72 + 40,
    y: Math.max(60, Math.min(p0.y - 110, p3.y - 240)),
  };

  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  const dX = 3 * uu * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * tt * (p3.x - p2.x);
  const dY = 3 * uu * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * tt * (p3.y - p2.y);
  const rad = Math.atan2(dY, dX);
  const deg = (rad * 180) / Math.PI;

  return {
    startX: p0.x,
    startY: p0.y,
    targetX: p3.x,
    targetY: p3.y,
    currentX: x,
    currentY: y,
    angle: Math.max(-25, Math.min(deg, 35)),
  };
}

export function resolveFlightFrame(progress: number): MascotFrameConfig {
  if (progress < 0.28) {
    return { body: 'fly-upstroke', eyes: 'open', beak: 'default' };
  }
  if (progress < 0.78) {
    return { body: 'fly-glide', eyes: 'open', beak: 'smile' };
  }
  return { body: 'fly-downstroke', eyes: 'open', beak: 'surprise' };
}

export function resolveLandingTransform(landingStep: string): LandingPoseTransform {
  switch (landingStep) {
    case 'happy-land':
      return { offsetY: -32, scaleX: 0.95, scaleY: 1.06, rotateDeg: -2 };
    case 'impact':
      return { offsetY: 14, scaleX: 1.3, scaleY: 0.75, rotateDeg: 0 };
    case 'rebound':
      return { offsetY: -28, scaleX: 0.85, scaleY: 1.22, rotateDeg: 3 };
    case 'settle':
      return { offsetY: 4, scaleX: 1.08, scaleY: 0.94, rotateDeg: -1 };
    case 'standing':
    default:
      return { offsetY: 0, scaleX: 1.0, scaleY: 1.0, rotateDeg: 0 };
  }
}

export function resolveLandingFrame(landingStep: string): MascotFrameConfig {
  switch (landingStep) {
    case 'happy-land':
      return { body: 'happy-land', eyes: 'happy', beak: 'laugh' };
    case 'impact':
      return { body: 'land-impact', eyes: 'squint', beak: 'default', particle: 'dust-ground' };
    case 'rebound':
      return { body: 'land-rebound', eyes: 'open', beak: 'smile', particle: 'shock-lines' };
    case 'settle':
      return { body: 'land-settle', eyes: 'open', beak: 'smile' };
    case 'standing':
    default:
      return { body: 'standing', eyes: 'open', beak: 'default' };
  }
}

export function resolveFlightDeformation(progress: number): LandingPoseTransform {
  const flightOffsetY = Math.sin(progress * Math.PI * 3) * 8;
  if (progress < 0.28) {
    return { offsetY: flightOffsetY, scaleX: 0.94, scaleY: 1.06, rotateDeg: 0 };
  }
  if (progress < 0.78) {
    return { offsetY: flightOffsetY, scaleX: 1.04, scaleY: 0.96, rotateDeg: 0 };
  }
  return { offsetY: flightOffsetY, scaleX: 1.05, scaleY: 0.94, rotateDeg: 0 };
}
