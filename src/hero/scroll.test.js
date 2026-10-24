import { describe, expect, it } from 'vitest';
import { frameForProgress, loadOrder, nearestLoaded, stopForProgress } from './scroll';

const S = [
  { from: 0, to: 15 },
  { from: 15, to: 30 },
  { from: 30, to: 42 },
  { from: 42, to: 71 },
];
const T = true;
const F = false;

describe('stopForProgress', () => {
  it('returns -1 for the intro and 0..3 for the stops', () => {
    expect(stopForProgress(0)).toBe(-1);
    expect(stopForProgress(0.12)).toBe(0);
    expect(stopForProgress(0.5)).toBe(1);
    expect(stopForProgress(0.99)).toBe(3);
  });

  it('clamps progress beyond the end to the last stop', () => {
    expect(stopForProgress(1.5)).toBe(3);
  });
});

describe('frameForProgress', () => {
  it('holds the first frame during the intro and before the start', () => {
    expect(frameForProgress(-0.2, S)).toBe(S[0].from);
    expect(frameForProgress(0.12, S)).toBe(S[0].from);
  });

  it('reaches the last frame of a stop at its upper edge', () => {
    expect(frameForProgress(0.34 - 1e-9, S)).toBe(S[0].to);
    expect(frameForProgress(1, S)).toBe(S[3].to);
  });

  it('never returns a frame past the end on overscroll', () => {
    expect(frameForProgress(2, S)).toBe(S[3].to);
  });

  it('is monotonic over the whole scroll', () => {
    let prev = -Infinity;
    for (let p = 0; p <= 1; p += 0.0005) {
      const f = frameForProgress(p, S);
      expect(f).toBeGreaterThanOrEqual(prev);
      prev = f;
    }
  });
});

describe('loadOrder', () => {
  it('loads every 4th frame first, then the rest', () => {
    expect(loadOrder(10)).toEqual([0, 4, 8, 1, 2, 3, 5, 6, 7, 9]);
  });
});

describe('nearestLoaded', () => {
  it('returns the closest loaded frame', () => {
    expect(nearestLoaded(5, [T, F, F, F, F, F, F, T])).toBe(7);
  });

  it('prefers the lower frame on a tie', () => {
    expect(nearestLoaded(3, [T, F, F, F, F, F, T])).toBe(0);
  });

  it('returns -1 when nothing is loaded', () => {
    expect(nearestLoaded(2, [F, F, F])).toBe(-1);
  });
});
