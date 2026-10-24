import { createContext, useContext, useMemo, useState } from 'react';
import { packageMeta } from './data';

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
