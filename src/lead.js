// Заявка з форми. Якщо задано VITE_WEB3FORMS_KEY, вона йде на пошту через Web3Forms.
// Без ключа відкриваємо WhatsApp з уже написаною заявкою, щоб вона не губилась.

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

// Текст заявки: тільки заповнені поля, кожне з нового рядка.
export function leadText({ name, phone, service, car, message }, labels) {
  return [
    [labels.name, name],
    [labels.phone, phone],
    [labels.service, service],
    [labels.car, car],
    [labels.message, message],
  ]
    .filter(([, value]) => value?.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join('\n');
}

export const canSendLead = () => Boolean(WEB3FORMS_KEY);

export async function sendLead(fields, text) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `Ny forespørsel: ${fields.name}`,
      from_name: 'Stella Detailing',
      message: text,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
}
