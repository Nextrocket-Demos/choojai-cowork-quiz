import { describe, it, expect } from 'vitest';
import { pointInRect, clamp, mirrorX } from './geometry';

describe('pointInRect', () => {
  const rect = { x: 10, y: 10, width: 100, height: 50 };
  it('returns true when point is inside', () => {
    expect(pointInRect({ x: 50, y: 30 }, rect)).toBe(true);
  });
  it('returns false when point is outside left', () => {
    expect(pointInRect({ x: 5, y: 30 }, rect)).toBe(false);
  });
  it('returns false when point is outside bottom', () => {
    expect(pointInRect({ x: 50, y: 100 }, rect)).toBe(false);
  });
  it('returns true on the boundary', () => {
    expect(pointInRect({ x: 10, y: 10 }, rect)).toBe(true);
    expect(pointInRect({ x: 110, y: 60 }, rect)).toBe(true);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => { expect(clamp(0.5, 0, 1)).toBe(0.5); });
  it('clamps below min', () => { expect(clamp(-0.2, 0, 1)).toBe(0); });
  it('clamps above max', () => { expect(clamp(1.5, 0, 1)).toBe(1); });
});

describe('mirrorX', () => {
  it('mirrors a normalized x coord', () => {
    expect(mirrorX(0.2)).toBeCloseTo(0.8);
    expect(mirrorX(0.5)).toBeCloseTo(0.5);
  });
});
