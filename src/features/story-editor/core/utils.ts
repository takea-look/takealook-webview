import type { LayerId, Transform, Vec2 } from './types';

export function createId(prefix: string = 'layer'): LayerId {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function defaultTransform(at: Vec2): Transform {
  return {
    position: { x: at.x, y: at.y },
    scale: 1,
    rotation: 0,
  };
}
