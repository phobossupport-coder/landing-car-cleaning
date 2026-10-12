// Базові ціни зберігаються в NOK (src/data.js). Для інших мов перераховуємо за курсом
// і округлюємо до «гарних» чисел. Курси оновлюйте тут (мід-маркет, жовтень 2026).
export const currencies = {
  NOK: { rate: 1, symbol: 'kr', step: 1, locale: 'nb-NO' },
  EUR: { rate: 0.091, symbol: '€', step: 10, locale: 'de-DE' },
  UAH: { rate: 4.4, symbol: '₴', step: 50, locale: 'uk-UA' },
};

const group = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// formatPrice(5500, 'EUR') → "500 €"; formatPrice(5500, 'NOK') → "5 500 kr"
export function formatPrice(nok, code = 'NOK') {
  const c = currencies[code] || currencies.NOK;
  const raw = nok * c.rate;
  // Дрібні суми округлюємо дрібніше, великі (від 10 000) — крупніше.
  const step = raw < 100 ? Math.min(c.step, 5) : raw >= 10000 ? c.step * 10 : c.step;
  const value = Math.round(raw / step) * step;
  return `${group(value)} ${c.symbol}`;
}
