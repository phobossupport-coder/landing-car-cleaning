import { describe, expect, it } from 'vitest';
import { leadText } from './lead';

const labels = { name: 'Navn', phone: 'Telefon', service: 'Tjeneste', car: 'Bil', message: 'Kommentar' };

describe('leadText', () => {
  it('lists filled fields line by line', () => {
    expect(leadText({ name: 'Ola', phone: '+47 900 00 000', service: 'Pakke Gold' }, labels)).toBe('Navn: Ola\nTelefon: +47 900 00 000\nTjeneste: Pakke Gold');
  });

  it('skips empty and whitespace-only fields and trims values', () => {
    expect(leadText({ name: ' Ola ', phone: '1', service: '', car: '  ', message: 'Hei' }, labels)).toBe('Navn: Ola\nTelefon: 1\nKommentar: Hei');
  });
});
