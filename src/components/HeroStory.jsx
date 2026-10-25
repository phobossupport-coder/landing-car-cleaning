import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Button, ButtonBase, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { heroStopMeta, serviceMeta } from '../data';
import { mono } from '../theme';
import { useLang } from '../i18n';
import { formatPrice } from '../i18n/currency';
import { STOP_BOUNDS, clamp01, frameForProgress, nearestLoaded, stopForProgress } from '../hero/scroll';
import { posterSrc, useHeroFrames } from '../hero/useHeroFrames';

// Висота секції у висотах екрана: перший екран + ~2 екрани прокрутки на історію.
const SCREENS = 3;
const MAX_DPR = 2;

// Кадр на canvas за правилом object-fit: cover.
function drawCover(canvas, img) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

const fade = (visible) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'translateY(12px)',
  transition: 'opacity .3s ease, transform .3s ease',
  pointerEvents: visible ? 'auto' : 'none',
});

function Counter({ i }) {
  return (
    <Typography
      component="p"
      sx={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.22em', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}
    >
      {String(i + 1).padStart(2, '0')} / {String(heroStopMeta.length).padStart(2, '0')}
      <Box component="span" sx={{ flex: 1, height: '1px', bgcolor: 'rgba(201,168,106,0.5)' }} />
    </Typography>
  );
}

function StopCaption({ i, stop, price, from }) {
  return (
    <Box>
      <Counter i={i} />
      <Typography component="p" sx={{ typography: 'h2', mt: 1.5 }}>
        {stop.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 440 }}>
        {stop.text}
      </Typography>
      {price && (
        <Typography sx={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.14em', mt: 1.5, color: 'primary.light' }}>
          {from.toUpperCase()} {price}
        </Typography>
      )}
    </Box>
  );
}

export default function HeroStory() {
  const { t } = useLang();
  const h = t.hero;
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true });

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const ambientRef = useRef(null);
  const progress = useRef(0);
  const raf = useRef(0);
  const manifestRef = useRef(null);
  const [stop, setStop] = useState(-1);
  const [drawn, setDrawn] = useState(false);

  const framesRef = useRef(null);
  const draw = useCallback(() => {
    const m = manifestRef.current;
    const frames = framesRef.current;
    if (!m || !frames) return;
    const f = nearestLoaded(frameForProgress(progress.current, m.stops), frames.loaded.current);
    if (f < 0) return;
    const img = frames.images.current[f];
    [canvasRef.current, ambientRef.current].forEach((c) => c && c.width && drawCover(c, img));
    setDrawn(true);
  }, []);
  const schedule = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      draw();
    });
  }, [draw]);

  const frames = useHeroFrames(!reduced, schedule);
  // Свіжі значення для draw(), який викликається поза рендером (rAF, ResizeObserver).
  useLayoutEffect(() => {
    framesRef.current = frames;
    manifestRef.current = frames.manifest;
  });
  const story = !reduced && !frames.failed;

  // Прогрес скролу всередині секції → зупинка (для підписів) і кадр (для canvas).
  useEffect(() => {
    if (!story) return undefined;
    const onScroll = () => {
      const el = sectionRef.current;
      const range = el.offsetHeight - window.innerHeight;
      progress.current = range > 0 ? clamp01(-el.getBoundingClientRect().top / range) : 0;
      setStop(stopForProgress(progress.current));
      schedule();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [story, schedule]);

  // Розмір canvas = розмір на екрані × DPR (не більше 2), фон — маленький, він однаково розмитий.
  useEffect(() => {
    if (!story) return undefined;
    const c = canvasRef.current;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      schedule();
    });
    ro.observe(c);
    if (ambientRef.current) {
      ambientRef.current.width = 90;
      ambientRef.current.height = 160;
    }
    return () => ro.disconnect();
  }, [story, desktop, schedule]);

  const scrollToStop = (i) => {
    const el = sectionRef.current;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + (STOP_BOUNDS[i][0] + 0.02) * range;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const priceOf = (i) => {
    const s = heroStopMeta[i].service;
    return s === null ? null : formatPrice(serviceMeta[s].price, t.currency);
  };

  const visual = (
    <>
      <Box component="img" src={posterSrc} alt="" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} />
      {story && (
        <Box
          component="canvas"
          ref={canvasRef}
          aria-hidden
          sx={{ position: 'absolute', inset: 0, width: 1, height: 1, opacity: drawn ? 1 : 0, transition: 'opacity .4s' }}
        />
      )}
    </>
  );

  const intro = (
    <>
      <Typography
        variant="overline"
        color="primary"
        component="p"
        sx={{ fontFamily: mono, letterSpacing: '0.24em', display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 4 } }}
      >
        <Box component="span" sx={{ width: 40, height: '1px', bgcolor: 'primary.main', flexShrink: 0 }} />
        {h.eyebrow}
      </Typography>
      <Typography variant="h1" component="h1" sx={{ fontSize: { md: 'clamp(3rem, 4.6vw, 4.6rem)' } }}>
        {h.title1}
        <Box component="span" sx={{ display: 'block', fontStyle: 'italic', color: 'primary.main' }}>
          {h.title2}
        </Box>
      </Typography>
      {/* На низьких екранах комп'ютера абзац ховаємо, щоб список зупинок вміщався */}
      <Typography
        sx={{
          mt: { xs: 2, md: 3 },
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          color: 'text.secondary',
          maxWidth: 540,
          '@media (min-width: 900px) and (max-height: 860px)': { display: 'none' },
        }}
      >
        {h.text}
      </Typography>
    </>
  );

  const cta = (
    <Box>
      <Stack direction="row" spacing={2.5} alignItems="center">
        <Button href="#contact" variant="contained" size="large" endIcon={<ArrowOutwardIcon />} sx={{ flex: { xs: 1, md: 'none' }, whiteSpace: 'nowrap' }}>
          {h.cta1}
        </Button>
        <Typography
          component="a"
          href="#mobile"
          aria-label={h.skip}
          sx={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            px: { xs: 1, sm: 0 },
            '&:hover': { color: 'primary.main' },
          }}
        >
          {/* На вузькому екрані лише стрілка — щоб кнопка вмістилась в один рядок */}
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {h.skip}{' '}
          </Box>
          ↓
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontSize: 12.5 }}>
        {h.note}
      </Typography>
    </Box>
  );

  const stopList = (
    <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, mt: { xs: 5, md: 4 }, borderTop: '1px solid', borderColor: 'divider' }}>
      {h.stops.map((s, i) => {
        const active = !story || stop === i;
        return (
          <Box component="li" key={s.title} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <ButtonBase
              onClick={() => story && scrollToStop(i)}
              disabled={!story}
              sx={{ width: 1, justifyContent: 'flex-start', alignItems: 'baseline', gap: 2.5, py: 1.25, textAlign: 'left' }}
            >
              <Typography sx={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', color: active ? 'primary.main' : 'text.secondary' }}>
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Box>
                <Typography sx={{ typography: 'h5', color: active ? 'text.primary' : 'text.secondary', transition: 'color .3s' }}>{s.title}</Typography>
                {active && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {s.text}
                    {priceOf(i) && (
                      <Box component="span" sx={{ fontFamily: mono, fontSize: 12, color: 'primary.light', ml: 1, whiteSpace: 'nowrap' }}>
                        · {t.common.from} {priceOf(i)}
                      </Box>
                    )}
                  </Typography>
                )}
              </Box>
            </ButtonBase>
          </Box>
        );
      })}
    </Box>
  );

  if (desktop) {
    return (
      <Box id="top" component="header" ref={sectionRef} sx={{ position: 'relative', height: story ? `${SCREENS * 100}svh` : 'auto' }}>
        <Box sx={{ position: story ? 'sticky' : 'relative', top: 0, height: '100svh', minHeight: 640, overflow: 'hidden' }}>
          {/* Розмите «світло» поточного кадру на весь фон */}
          <Box sx={{ position: 'absolute', inset: '-10%', filter: 'blur(48px) brightness(0.32) saturate(1.2)' }}>
            <Box component="img" src={posterSrc} alt="" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} />
            {story && <Box component="canvas" ref={ambientRef} aria-hidden sx={{ position: 'absolute', inset: 0, width: 1, height: 1 }} />}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.4) 60%, rgba(10,10,11,0.2) 100%)',
            }}
          />
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              height: 1,
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: { md: 6, lg: 10 },
              alignItems: 'center',
              pt: 10,
              pb: 4,
            }}
          >
            <Box sx={{ maxWidth: 600 }}>
              {intro}
              <Box sx={{ mt: 4 }}>{cta}</Box>
              {stopList}
            </Box>
            <Box
              sx={{
                position: 'relative',
                height: 'min(78svh, 900px)',
                aspectRatio: '9 / 16',
                border: '1px solid rgba(201,168,106,0.45)',
                outline: '1px solid rgba(201,168,106,0.12)',
                outlineOffset: 10,
              }}
            >
              {visual}
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box id="top" component="header" ref={sectionRef} sx={{ position: 'relative', height: story ? `${SCREENS * 100}svh` : 'auto' }}>
      <Box sx={{ position: story ? 'sticky' : 'relative', top: 0, height: '100svh', overflow: 'hidden' }}>
        {visual}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0) 22%, rgba(10,10,11,0.35) 45%, rgba(10,10,11,0.94) 72%, #0A0A0B 100%)',
          }}
        />
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, px: 2, pb: 'calc(20px + env(safe-area-inset-bottom))' }}>
          {/* Вступ і підписи зупинок займають одну клітинку сітки й змінюють одне одного */}
          <Box sx={{ display: 'grid', alignItems: 'end', mb: 3 }}>
            <Box sx={{ gridArea: '1 / 1', ...fade(stop === -1) }}>{intro}</Box>
            {story &&
              h.stops.map((s, i) => (
                <Box key={s.title} sx={{ gridArea: '1 / 1', ...fade(stop === i) }}>
                  <StopCaption i={i} stop={s} price={priceOf(i)} from={t.common.from} />
                </Box>
              ))}
          </Box>
          {cta}
        </Box>
      </Box>
      {!story && <Container sx={{ pb: 6 }}>{stopList}</Container>}
    </Box>
  );
}
