// Цифри для тахометрів: розбір рядка «1 200+» і «накручування» до нього.

// prefix + число з роздільником тисяч + suffix. Роздільник (пробіл, NBSP, кома) зберігаємо як є.
export function parseStat(value) {
  const m = /^(\D*)(\d[\d\s,.\u00A0\u202F]*\d|\d)(\D*)$/.exec(value);
  if (!m) return { number: 0, prefix: value, suffix: '', separator: '' };
  const [, prefix, digits, suffix] = m;
  const separator = digits.replace(/\d/g, '')[0] ?? '';
  return { number: Number(digits.replace(/\D/g, '')), prefix, suffix, separator };
}

export function formatStat(n, { prefix, suffix, separator }) {
  const body = separator ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, separator) : String(n);
  return `${prefix}${body}${suffix}`;
}

export const easeOutCubic = (t) => 1 - (1 - t) ** 3;

export function countAt(target, t) {
  return Math.round(target * easeOutCubic(Math.min(1, Math.max(0, t))));
}

// Роки досвіду рахуються від року початку роботи, щоб цифра не застарівала.
export const yearsSince = (year, now = new Date()) => now.getFullYear() - year;
