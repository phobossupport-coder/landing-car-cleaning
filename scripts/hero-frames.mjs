// Монтаж hero-історії з вертикального відео в послідовність кадрів WebP для canvas.
// Запуск: npm run hero:frames -- "<шлях до відео>"
// Нове відео → змініть таймкоди й обрізку в SHOTS і запустіть знову.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ffmpeg from 'ffmpeg-static';

const SRC_W = 720;
const SRC_H = 1280;
const OUT_W = 600;
const OUT_H = 1066;
const TARGET_FRAMES = 72;
const FADE = 0.2; // с, перехід між планами
const OUT_DIR = new URL('../public/hero/', import.meta.url).pathname;

// Таймкоди всередині склейок (з запасом у кілька кадрів, щоб не ловити спалахи).
// Жодних кадрів із будівлею DD73, воротами, плівкою (див. специфікацію).
const SHOTS = [
  { id: 'paint', start: 1.55, end: 2.38 },
  { id: 'ceramic', start: 13.05, end: 13.82 },
  // Наближення ×1.35 з прив'язкою донизу ховає літери на фасаді вгорі кадру.
  { id: 'wheels', start: 17.04, end: 17.53, filter: `scale=iw*1.35:-1,crop=${SRC_W}:${SRC_H}:(iw-${SRC_W})/2:ih-${SRC_H}` },
  // Верхні 20 % — рамка воріт і рослина; наприкінці план відкриває ворота, тому обриваємо на 18.8 с.
  { id: 'interior', start: 17.62, end: 18.8, filter: `crop=iw:ih*0.8:0:ih*0.2,scale=-2:${SRC_H},crop=${SRC_W}:${SRC_H}` },
];

// Глибші тіні, теплі світла, трохи менше насиченості, м'яка віньєтка.
const GRADE = 'eq=contrast=1.08:saturation=0.9:gamma=0.96,colorbalance=rh=0.04:gh=0.01:bh=-0.03:rs=-0.02:bs=0.02,vignette=PI/5';

const video = process.argv[2];
if (!video) {
  console.error('Usage: npm run hero:frames -- "<video.mp4>"');
  process.exit(1);
}

const durations = SHOTS.map((s) => s.end - s.start);
const total = durations.reduce((a, b) => a + b, 0) - FADE * (SHOTS.length - 1);
const fps = TARGET_FRAMES / total;

// Кожен план → [vN]; потім ланцюжок xfade; потім грейдинг і частота кадрів.
const parts = SHOTS.map(
  (s, i) =>
    `[0:v]trim=start=${s.start}:end=${s.end},setpts=PTS-STARTPTS,${s.filter ? `${s.filter},` : ''}scale=${SRC_W}:${SRC_H},setsar=1,fps=30,format=yuv420p[v${i}]`,
);
let last = 'v0';
let offset = 0;
const cuts = []; // середини переходів у секундах результату — межі зупинок
for (let i = 1; i < SHOTS.length; i++) {
  offset += durations[i - 1] - FADE;
  cuts.push(offset + FADE / 2);
  const out = i === SHOTS.length - 1 ? 'joined' : `x${i}`;
  parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(3)}[${out}]`);
  last = out;
}
parts.push(`[joined]${GRADE},fps=${fps.toFixed(4)},scale=${OUT_W}:${OUT_H}:flags=lanczos[out]`);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(join(OUT_DIR, 'frames'), { recursive: true });

execFileSync(
  ffmpeg,
  [
    '-v',
    'error',
    '-y',
    '-i',
    video,
    '-filter_complex',
    parts.join(';'),
    '-map',
    '[out]',
    '-an',
    '-c:v',
    'libwebp',
    '-quality',
    '72',
    '-compression_level',
    '6',
    join(OUT_DIR, 'frames', '%04d.webp'),
  ],
  { stdio: 'inherit' },
);

const frames = readdirSync(join(OUT_DIR, 'frames'))
  .filter((f) => f.endsWith('.webp'))
  .sort();
const count = frames.length;
const bounds = cuts.map((t) => Math.min(count - 1, Math.round(t * fps)));
const edges = [0, ...bounds, count - 1];
const stops = SHOTS.map((s, i) => ({ id: s.id, from: edges[i], to: edges[i + 1] }));
writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify({ count, width: OUT_W, height: OUT_H, fps: +fps.toFixed(3), stops }, null, 2)}\n`);

execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', join(OUT_DIR, 'frames', frames[0]), '-q:v', '5', join(OUT_DIR, 'poster.jpg')]);

// Контактний аркуш для перевірки «жодного DD73» перед комітом.
const sheetDir = mkdtempSync(join(tmpdir(), 'hero-sheet-'));
const sheet = join(sheetDir, 'sheet.jpg');
execFileSync(ffmpeg, [
  '-v',
  'error',
  '-y',
  '-framerate',
  '1',
  '-i',
  join(OUT_DIR, 'frames', '%04d.webp'),
  '-vf',
  `scale=150:-1,tile=12x${Math.ceil(count / 12)}`,
  '-frames:v',
  '1',
  sheet,
]);

const size = frames.reduce((a, f) => a + statSync(join(OUT_DIR, 'frames', f)).size, 0);
console.log(`frames: ${count}, total ${(size / 1024 / 1024).toFixed(2)} MB, poster ${(statSync(join(OUT_DIR, 'poster.jpg')).size / 1024).toFixed(0)} KB`);
console.log('stops:', stops.map((s) => `${s.id} ${s.from}–${s.to}`).join(', '));
console.log(`contact sheet: ${sheet}`);
