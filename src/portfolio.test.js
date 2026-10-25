// @vitest-environment node
import { existsSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { portfolioCases } from './data';

const file = (id, n, w) => new URL(`../public/portfolio/${id}/${n}-${w}.webp`, import.meta.url);

describe('portfolioCases', () => {
  it('has five cases with two or three photos each', () => {
    expect(portfolioCases).toHaveLength(5);
    portfolioCases.forEach((c) => {
      expect(c.photos.length).toBeGreaterThanOrEqual(2);
      expect(c.photos.length).toBeLessThanOrEqual(3);
    });
  });

  it('has every photo on disk in both widths, 1080 px within 160 KB', () => {
    portfolioCases.forEach((c) =>
      c.photos.forEach((n) => {
        expect(existsSync(file(c.id, n, 640)), `${c.id}/${n}-640`).toBe(true);
        expect(existsSync(file(c.id, n, 1080)), `${c.id}/${n}-1080`).toBe(true);
        expect(statSync(file(c.id, n, 1080)).size).toBeLessThanOrEqual(160 * 1024);
      }),
    );
  });
});
