import { describe, expect, it } from 'vitest';
import { contactEvent } from './analytics';

describe('contactEvent', () => {
  it.each([
    ['tel:+4793938230', 'call'],
    ['https://wa.me/4793938230?text=Hei', 'whatsapp'],
    ['https://t.me/+4793938230', 'telegram'],
    ['#contact', null],
    ['', null],
  ])('%s → %s', (href, event) => {
    expect(contactEvent(href)).toBe(event);
  });
});
