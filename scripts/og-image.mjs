// Картинка для прев'ю посилань (Open Graph, 1200×630): три кадри з портфоліо поруч.
// Беремо вже оброблені фото з public/portfolio — DD73 там прибрано, номери розмиті.
// Запуск: npm run og:image (після npm run portfolio:photos)
import sharp from 'sharp';

const ROOT = new URL('../public/', import.meta.url).pathname;
const W = 1200;
const H = 630;
const GAP = 2; // тонка золота лінія між кадрами
const GOLD = '#C9A86A';

const TILES = ['corvette-c8/1', 'amg-g63/1', 'bmw-m5-matte/1'];
const tileW = Math.floor((W - GAP * (TILES.length - 1)) / TILES.length);

const composites = await Promise.all(
  TILES.map(async (id, i) => ({
    input: await sharp(`${ROOT}portfolio/${id}-1080.webp`).resize(tileW, H, { fit: 'cover', position: 'centre' }).toBuffer(),
    left: i * (tileW + GAP),
    top: 0,
  })),
);

await sharp({ create: { width: W, height: H, channels: 3, background: GOLD } })
  .composite(composites)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${ROOT}og.jpg`);

console.log(`public/og.jpg ${W}×${H}`);
