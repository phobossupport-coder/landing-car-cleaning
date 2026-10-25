// Портфоліо: кадрування 4:5, розмиття номерів, затемнення фону, грейдинг під сайт.
// Запуск: npm run portfolio:photos -- "<папка з фото>"
// Фон на всіх фото — будівля DD73: кадр опускаємо якомога нижче, залишок фасаду затемнюємо.
import { mkdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT = new URL('../public/portfolio/', import.meta.url).pathname;
const W = 1080;
const H = 1350;
const SIZES = [
  { w: 1080, quality: 74 },
  { w: 640, quality: 72 },
];

// top — верх вікна 4:5 як частка висоти оригіналу (максимум ≈ 0.297 для 1080×1920);
// fade — висота затемнення зверху (частка кадру); blur — прямокутники номерів у частках оригіналу.
const PHOTOS = [
  { id: 'bmw-m5-matte', n: 1, src: 'BMW M5 (матовый)/04.jpg', top: 0.297, fade: 0.32 },
  { id: 'bmw-m5-matte', n: 2, src: 'BMW M5 (матовый)/06.jpg', top: 0.12 },
  { id: 'bmw-m5-matte', n: 3, src: 'BMW M5 (матовый)/07.jpg', top: 0.297, fade: 0.14 },
  { id: 'bmw-m5-touring', n: 1, src: 'BMW M5 Touring G99/05.jpg', top: 0.15 },
  { id: 'bmw-m5-touring', n: 2, src: 'BMW M5 Touring G99/06.jpg', top: 0.12 },
  { id: 'bmw-m5-touring', n: 3, src: 'BMW M5 Touring G99/07.jpg', top: 0.1 },
  { id: 'corvette-c8', n: 1, src: 'Chevrolet Corvette/03.jpg', top: 0.297, fade: 0.2 },
  { id: 'corvette-c8', n: 2, src: 'Chevrolet Corvette/05.jpg', top: 0.18, fade: 0.1 },
  { id: 'corvette-c8', n: 3, src: 'Chevrolet Corvette/01.jpg', top: 0.26, fade: 0.2 },
  { id: 'amg-g63', n: 1, src: 'Mercedes-AMG G63/03.jpg', top: 0.297, fade: 0.2, blur: [[0.04, 0.6, 0.26, 0.1]] },
  { id: 'amg-g63', n: 2, src: 'Mercedes-AMG G63/07.jpg', top: 0.08 },
  { id: 'amg-g63', n: 3, src: 'Mercedes-AMG G63/08.jpg', top: 0.15 },
  { id: 'touareg', n: 1, src: 'Volkswagen Touareg/05.jpg', top: 0.297, fade: 0.12 },
  { id: 'touareg', n: 2, src: 'Volkswagen Touareg/06.jpg', top: 0.297, fade: 0.15 },
];

const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);
const vignette = svg(
  '<defs><radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/>',
);
const topFade = (fade) =>
  svg(
    `<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0A0B" stop-opacity="0.97"/><stop offset="0.6" stop-color="#0A0A0B" stop-opacity="0.75"/><stop offset="1" stop-color="#0A0A0B" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="${Math.round(H * fade)}" fill="url(#f)"/>`,
  );

async function processPhoto(dir, p) {
  const src = join(dir, p.src);
  const { width, height } = await sharp(src).metadata();

  // Номери: вирізаємо, сильно розмиваємо, кладемо назад — ще до кадрування.
  const plates = await Promise.all(
    (p.blur ?? []).map(async ([x, y, w, h]) => {
      const region = { left: Math.round(x * width), top: Math.round(y * height), width: Math.round(w * width), height: Math.round(h * height) };
      return { input: await sharp(src).extract(region).blur(28).toBuffer(), left: region.left, top: region.top };
    }),
  );
  const cleaned = await sharp(src).composite(plates).toBuffer();

  const top = Math.min(Math.round(p.top * height), height - Math.round((width * H) / W));
  const graded = await sharp(cleaned)
    .extract({ left: 0, top, width, height: Math.round((width * H) / W) })
    .resize(W, H)
    // Глибші тіні, теплі світла, трохи менше насиченості — як у hero.
    .modulate({ saturation: 0.9, brightness: 0.97 })
    .linear(1.08, -10)
    .recomb([
      [1.03, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 0.95],
    ])
    .composite([{ input: vignette }, ...(p.fade ? [{ input: topFade(p.fade) }] : [])])
    .toBuffer();

  mkdirSync(join(OUT, p.id), { recursive: true });
  return Promise.all(
    SIZES.map(async ({ w, quality }) => {
      const out = join(OUT, p.id, `${p.n}-${w}.webp`);
      await sharp(graded).resize(w).webp({ quality, effort: 6 }).toFile(out);
      return `${p.id}/${p.n}-${w}: ${(statSync(out).size / 1024).toFixed(0)} KB`;
    }),
  );
}

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: npm run portfolio:photos -- "<photos dir>"');
  process.exit(1);
}
rmSync(OUT, { recursive: true, force: true });
for (const p of PHOTOS) console.log((await processPhoto(dir, p)).join('  '));
