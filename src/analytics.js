// Статистика відвідувань через GoatCounter: без cookies, банер згоди не потрібен.
// Вмикається змінною VITE_GOATCOUNTER (код сайту, наприклад «stella» для stella.goatcounter.com).

const CODE = import.meta.env.VITE_GOATCOUNTER;

export const analyticsEnabled = Boolean(CODE);

// Яку подію рахувати для посилання: дзвінок, WhatsApp чи Telegram.
export function contactEvent(href = '') {
  if (href.startsWith('tel:')) return 'call';
  if (href.includes('wa.me/')) return 'whatsapp';
  if (href.includes('t.me/')) return 'telegram';
  return null;
}

export function trackEvent(name) {
  window.goatcounter?.count?.({ path: name, title: name, event: true });
}

export function initAnalytics() {
  if (!CODE) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
  document.head.append(script);

  document.addEventListener('click', (e) => {
    const event = contactEvent(e.target.closest?.('a')?.getAttribute('href') ?? '');
    if (event) trackEvent(event);
  });
}
