import type { ShapeName } from '@m3e/web/shape';
import shapePathsData from './shape-paths.json' with { type: 'json' };

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ExpressiveShapeName = ShapeName;

export const SHAPE_PATHS: Record<string, string> = shapePathsData;

/**
 * Checks whether a given shape name is a recognized M3 expressive shape.
 */
export function isExpressiveShape(shape: string | undefined): shape is ExpressiveShapeName {
  if (!shape) return false;
  return Object.prototype.hasOwnProperty.call(SHAPE_PATHS, shape);
}

/**
 * Normalizes a shape or button shape to an expressive shape name.
 */
export function toExpressiveShape(shape: string | undefined): ExpressiveShapeName {
  if (!shape || shape === 'rounded') return 'pill';
  if (shape === 'square') return 'square';
  return isExpressiveShape(shape) ? shape : 'pill';
}

/**
 * Computes a rounded rectangle SVG path starting from top center and moving clockwise.
 */
export function getRoundedRectPath(bounds: RectBounds, radius: number): string {
  const { x, y, width: w, height: h } = bounds;
  if (w <= 0 || h <= 0) return '';

  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (r <= 0) {
    return `M ${x + w / 2} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y} Z`;
  }

  const right = x + w;
  const bottom = y + h;

  return [
    `M ${x + w / 2} ${y}`,
    `L ${right - r} ${y}`,
    `A ${r} ${r} 0 0 1 ${right} ${y + r}`,
    `L ${right} ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `L ${x + r} ${bottom}`,
    `A ${r} ${r} 0 0 1 ${x} ${bottom - r}`,
    `L ${x} ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    'Z',
  ].join(' ');
}

/**
 * Scales an M3 Expressive shape path (normalized to 0..1) to target bounds.
 */
export function scaleNormalizedPath(pathStr: string, bounds: RectBounds): string {
  const { x, y, width: w, height: h } = bounds;
  return pathStr.replace(
    /([A-DF-Za-df-z])([^A-DF-Za-df-z]*)/g,
    (_, cmd: string, coordsStr: string) => {
      const trimmed = coordsStr.trim();
      if (!trimmed) return cmd;
      const nums = trimmed.match(/-?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?/gi) ?? [];
      const scaled: string[] = [];
      for (let i = 0; i < nums.length; i += 2) {
        const nx = nums[i]!;
        const ny = nums[i + 1];
        if (ny !== undefined) {
          const px = Number((parseFloat(nx) * w + x).toFixed(2));
          const py = Number((parseFloat(ny) * h + y).toFixed(2));
          scaled.push(`${px} ${py}`);
        } else {
          scaled.push(nx);
        }
      }
      return `${cmd}${scaled.join(' ')}`;
    },
  );
}

export interface ResolveBorderPathOptions {
  shape?: string;
  bounds: RectBounds;
  radius?: number;
}

/**
 * Resolves the perimeter SVG path for a button given its shape and bounds.
 * Uses the same unified normalized 0..1 path calculation for all shapes.
 */
export function resolveBorderPath({ shape, bounds }: ResolveBorderPathOptions): string {
  const shapeName = toExpressiveShape(shape);
  const rawPath = SHAPE_PATHS[shapeName] ?? SHAPE_PATHS['rounded-rectangle'] ?? '';
  return scaleNormalizedPath(rawPath, bounds);
}
