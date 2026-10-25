import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { loadOrder } from './scroll';

const base = `${import.meta.env.BASE_URL}hero/`;
export const posterSrc = `${base}poster.jpg`;
const frameSrc = (i) => `${base}frames/${String(i + 1).padStart(4, '0')}.webp`;

// Завантажує manifest.json і кадри (спершу кожен 4-й). Кадри живуть у ref, щоб
// не перерендерювати React на кожен завантажений файл; onFrame — сигнал перемалювати.
export function useHeroFrames(enabled, onFrame) {
  const [manifest, setManifest] = useState(null);
  const [failed, setFailed] = useState(false);
  const images = useRef([]);
  const loaded = useRef([]);
  const onFrameRef = useRef(onFrame);
  useLayoutEffect(() => {
    onFrameRef.current = onFrame;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    fetch(`${base}manifest.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((m) => {
        if (cancelled) return;
        images.current = new Array(m.count);
        loaded.current = new Array(m.count).fill(false);
        setManifest(m);
        // Не більше 6 запитів одночасно: перші кадри приходять швидше.
        const queue = loadOrder(m.count);
        const next = () => {
          const i = queue.shift();
          if (i === undefined || cancelled) return;
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => {
            if (cancelled) return;
            images.current[i] = img;
            loaded.current[i] = true;
            onFrameRef.current?.(i);
            next();
          };
          img.onerror = next;
          img.src = frameSrc(i);
        };
        for (let k = 0; k < 6; k++) next();
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { manifest, failed, images, loaded };
}
