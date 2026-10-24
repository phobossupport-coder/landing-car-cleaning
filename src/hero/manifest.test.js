import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const dir = new URL('../../public/hero/', import.meta.url);
const file = (name) => new URL(name, dir);
const frameName = (i) => `frames/${String(i + 1).padStart(4, '0')}.webp`;

describe('public/hero/manifest.json', () => {
  const manifest = existsSync(file('manifest.json')) ? JSON.parse(readFileSync(file('manifest.json'), 'utf8')) : null;

  it('exists', () => {
    expect(manifest).not.toBeNull();
  });

  it('describes four stops in story order that tile the whole clip', () => {
    const { stops, count } = manifest;
    expect(stops.map((s) => s.id)).toEqual(['paint', 'ceramic', 'wheels', 'interior']);
    expect(stops[0].from).toBe(0);
    expect(stops[3].to).toBe(count - 1);
    stops.forEach((s, i) => {
      expect(s.from).toBeLessThan(s.to);
      if (i > 0) expect(s.from).toBe(stops[i - 1].to);
    });
  });

  it('has every frame on disk within the 2.5 MB budget', () => {
    let total = 0;
    for (let i = 0; i < manifest.count; i++) {
      expect(existsSync(file(frameName(i))), frameName(i)).toBe(true);
      total += statSync(file(frameName(i))).size;
    }
    expect(existsSync(file(frameName(manifest.count)))).toBe(false);
    expect(total).toBeLessThanOrEqual(2.5 * 1024 * 1024);
  });

  it('has a poster of at most 80 KB', () => {
    expect(statSync(file('poster.jpg')).size).toBeLessThanOrEqual(80 * 1024);
  });
});
