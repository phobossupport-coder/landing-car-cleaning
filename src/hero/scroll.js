// Логіка hero-історії без React: прогрес скролу p ∈ [0, 1] → зупинка і кадр.

export const INTRO_END = 0.12;
export const STOP_BOUNDS = [
  [0.12, 0.34],
  [0.34, 0.56],
  [0.56, 0.78],
  [0.78, 1],
];

export const clamp01 = (p) => Math.min(1, Math.max(0, p));

// -1 — вступ, 0..3 — зупинки. Межа належить наступній зупинці.
export function stopForProgress(p) {
  const v = clamp01(p);
  if (v < INTRO_END) return -1;
  const i = STOP_BOUNDS.findIndex(([, end]) => v < end);
  return i === -1 ? STOP_BOUNDS.length - 1 : i;
}

// stops — діапазони кадрів із manifest.json; кожен кадр зупинки «грає» на її відрізку скролу.
export function frameForProgress(p, stops) {
  const i = stopForProgress(p);
  if (i === -1) return stops[0].from;
  const [start, end] = STOP_BOUNDS[i];
  const t = (clamp01(p) - start) / (end - start);
  const { from, to } = stops[i];
  return Math.min(to, from + Math.round(t * (to - from)));
}

// Спершу кожен 4-й кадр (грубий прохід по всій історії), потім решта.
export function loadOrder(count) {
  const all = Array.from({ length: count }, (_, i) => i);
  return [...all.filter((i) => i % 4 === 0), ...all.filter((i) => i % 4 !== 0)];
}

// Найближчий уже завантажений кадр; при рівній відстані — менший індекс.
export function nearestLoaded(i, loaded) {
  for (let d = 0; d < loaded.length; d++) {
    if (loaded[i - d]) return i - d;
    if (loaded[i + d]) return i + d;
  }
  return -1;
}
