import { describe, expect, it } from 'vitest';
import { countAt, formatStat, parseStat, yearsSince } from './stats';

describe('parseStat / formatStat', () => {
  it.each(['1 200+', '1,200+', '1 200+', '100%', '9'])('round-trips %s', (v) => {
    const parsed = parseStat(v);
    expect(formatStat(parsed.number, parsed)).toBe(v);
  });

  it('extracts the number, prefix and suffix', () => {
    expect(parseStat('1 200+')).toMatchObject({ number: 1200, prefix: '', suffix: '+' });
    expect(parseStat('100%')).toMatchObject({ number: 100, suffix: '%' });
  });

  it('formats intermediate values with the same separator', () => {
    expect(formatStat(950, parseStat('1,200+'))).toBe('950+');
    expect(formatStat(1050, parseStat('1,200+'))).toBe('1,050+');
  });
});

describe('countAt', () => {
  it('starts at 0 and lands exactly on the target', () => {
    expect(countAt(1200, 0)).toBe(0);
    expect(countAt(1200, 1)).toBe(1200);
    expect(countAt(1200, 2)).toBe(1200);
  });

  it('only grows', () => {
    let prev = -1;
    for (let t = 0; t <= 1; t += 0.01) {
      const v = countAt(1200, t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('yearsSince', () => {
  it('counts full calendar years from the start year', () => {
    expect(yearsSince(2017, new Date(2026, 9, 25))).toBe(9);
    expect(yearsSince(2017, new Date(2027, 0, 1))).toBe(10);
  });
});
