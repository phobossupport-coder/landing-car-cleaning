// Мовно-незалежні дані: бренд, контакти, фото, марки. Усі тексти — у src/i18n/<мова>.js.

const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const brand = {
  name: 'STELLA',
  tagline: 'Detailing Studio',
  phone: '+380 67 000 00 00', // TODO: замініть на реальний номер (для Норвегії — формат +47 ...)
  phoneHref: 'tel:+380670000000',
  email: 'hello@stella-detailing.no',
  address: 'Verkstedveien 12, Oslo', // TODO: замініть на реальну адресу студії
  instagram: 'https://instagram.com/',
  whatsapp: 'https://wa.me/380670000000',
  since: 2017,
};

// Посилання на WhatsApp з готовим текстом повідомлення.
export const whatsappLink = (text) => `${brand.whatsapp}?text=${encodeURIComponent(text)}`;

export const images = {
  hero: img('photo-1617814076367-b759c7d7e738', 2400),
  beforeAfter: img('photo-1503376780353-7e6692767b70', 1800),
  studio: img('photo-1607860108855-64acf2078ed9', 1400),
  winter: img('photo-1485291571150-772bcfc10da5', 1800),
  yacht: img('photo-1567899378494-47b22a2ae96a', 2400),
};

// Бігова дорожка: марки авто (верхній ряд) і яхтові верфі (нижній ряд).
export const carBrands = [
  'Rolls-Royce',
  'Bentley',
  'Ferrari',
  'Lamborghini',
  'Porsche',
  'Mercedes-Maybach',
  'Aston Martin',
  'McLaren',
  'Range Rover',
  'Bugatti',
  'Maserati',
  'Cadillac Escalade',
];

// Якорі навігації та секцій — однакові для всіх мов.
// Порядок секцій сторінки — з нього беруться номери надзаголовків «02 — ПОСЛУГИ».
export const sectionOrder = ['mobile', 'services', 'winter', 'results', 'packages', 'yachts', 'process', 'gallery', 'reviews', 'faq', 'contact'];

export const navHrefs = ['#services', '#winter', '#packages', '#yachts', '#gallery', '#reviews', '#faq'];

// Ціни в NOK (інші валюти перераховуються автоматично, див. src/i18n/currency.js).
// Базу взято з прайсів студій Осло (жовтень 2026) мінус 15 %:
//   2-стегс лакокорекція ринок ≈ 6 500 → 5 500; кераміка 3–5 р. ≈ 8 900 → 7 500;
//   дипренс салону ≈ 4 500 → 3 800; детейлінг-мийка ≈ 1 200 → 990;
//   фари ≈ 1 500 → 1 290; яхта ≈ 180 kr/фут → 149; зима (Full Shine) ≈ 7 000 → 5 900;
//   пакети: 1-step ≈ 3 900 → 3 300; корекція+кераміка ≈ 12 900 → 10 900; concours ≈ 19 500 → 16 500.
export const serviceMeta = [
  { icon: 'polish', price: 5500 },
  { icon: 'shield', price: 7500 },
  { icon: 'seat', price: 3800 },
  { icon: 'wash', price: 990 },
  { icon: 'light', price: 1290 },
  { icon: 'anchor', price: 149, perFoot: true, href: '#yachts' },
];

// Зупинки hero-історії (порядок = manifest.json). service — індекс у serviceMeta для ціни; null — без ціни.
export const heroStopMeta = [
  { id: 'paint', service: 0 },
  { id: 'ceramic', service: 1 },
  { id: 'wheels', service: null },
  { id: 'interior', service: 2 },
];

export const winterMeta = { price: 5900, season: '2026/27' };

// Назви, ціни (NOK) та позначка «популярний» для пакетів (порядок збігається з t.packages.items).
export const packageMeta = [
  { name: 'Gloss', price: 3300 },
  { name: 'Correction', price: 10900, featured: true },
  { name: 'Concours', price: 16500 },
];

// Фото та об’єкти портфоліо (підписи робіт — у t.gallery.works).
export const galleryMeta = [
  { src: img('photo-1612825173281-9a193378527e', 1400), title: 'Lamborghini Huracán EVO' },
  { src: img('photo-1503376780353-7e6692767b70', 1000), title: 'Porsche Panamera' },
  { src: img('photo-1563720223185-11003d516935', 1000), title: 'Range Rover Sport' },
  { src: img('photo-1520031441872-265e4ff70366', 1000), title: 'Mercedes-AMG G 63' },
  { src: img('photo-1553440569-bcc63803a83d', 1000), title: 'Mercedes-AMG GT R' },
  { src: img('photo-1605281317010-fe5ffe798166', 1400), title: 'Azimut 55' },
];

export const reviewCars = ['Rolls-Royce Ghost', 'Porsche 911 Turbo S', 'BMW M5 Competition'];
