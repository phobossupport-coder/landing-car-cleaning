import { createContext, useContext, useMemo, useState } from 'react';
import { packageMeta, whatsappLink } from './data';
import { useLang } from './i18n';

// Варіанти поля «Що потрібно зробити?». Зберігаємо id, а не текст, щоб вибір
// не губився при перемиканні мови.
export function serviceOptions(t) {
  const f = t.contact.form;
  return [
    { id: 'winter', label: f.winterOption },
    ...packageMeta.map((p) => ({ id: `package-${p.name}`, label: `${f.packagePrefix} ${p.name}` })),
    ...t.services.items.map((s, i) => ({ id: `service-${i}`, label: s.title })),
    { id: 'consult', label: f.consult },
  ];
}

const BookingContext = createContext({ service: '', setService: () => {} });

// Кнопки «Обрати…» ведуть на #contact і заодно передзаповнюють послугу у формі.
export function BookingProvider({ children }) {
  const [service, setService] = useState('');
  const value = useMemo(() => ({ service, setService }), [service]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);

// WhatsApp із готовим текстом: якщо послугу вже обрано — згадуємо її.
export function useWhatsappLink() {
  const { t } = useLang();
  const { service } = useBooking();
  const label = serviceOptions(t).find((o) => o.id === service)?.label;
  return whatsappLink(label ? t.whatsappText.service.replace('{service}', label) : t.whatsappText.hello);
}
