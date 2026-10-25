// Мовно-незалежні дані: бренд, контакти, фото, марки. Усі тексти — у src/i18n/<мова>.js.

const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const brand = {
  name: 'STELLA',
  tagline: 'Detailing Studio',
  phone: '+47 939 38 230',
  phoneHref: 'tel:+4793938230',
  whatsapp: 'https://wa.me/4793938230',
  since: 2017,
};

// Посилання на WhatsApp з готовим текстом повідомлення.
export const whatsappLink = (text) => `${brand.whatsapp}?text=${encodeURIComponent(text)}`;

export const images = {
  hero: img('photo-1617814076367-b759c7d7e738', 2400),
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

// Портфоліо: власні роботи (фото — public/portfolio/<id>/<n>-<640|1080>.webp, готує scripts/portfolio-photos.mjs).
// Перше фото — обкладинка кейсу.
export const portfolioCases = [
  { id: 'bmw-m5-matte', name: 'BMW M5', photos: ['1', '2', '3'] },
  { id: 'corvette-c8', name: 'Chevrolet Corvette C8', photos: ['1', '2', '3'] },
  { id: 'amg-g63', name: 'Mercedes-AMG G 63', photos: ['1', '2', '3'] },
  { id: 'bmw-m5-touring', name: 'BMW M5 Touring', photos: ['1', '2', '3'] },
  { id: 'touareg', name: 'Volkswagen Touareg', photos: ['1', '2'] },
];

export const portfolioSrc = (id, n, w) => `${import.meta.env.BASE_URL}portfolio/${id}/${n}-${w}.webp`;

export const reviewCars = ['Rolls-Royce Ghost', 'Porsche 911 Turbo S', 'BMW M5 Competition'];
