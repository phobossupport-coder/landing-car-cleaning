import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import Marquee from './Marquee';
import { carBrands } from '../data';
import { mono, serif } from '../theme';
import { useLang } from '../i18n';
import { countAt, easeOutCubic, formatStat, parseStat } from './stats';

const DURATION = 1200; // мс, «накручування» стрілки
const FILL = 0.82; // стрілка зупиняється перед «червоною зоною», як на справжньому тахометрі
const START = 150; // градуси: дуга 240° від лівого нижнього до правого нижнього краю
const SWEEP = 240;
const C = 60;
const R = 50;

const point = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const [x0, y0] = point(START, R);
const [x1, y1] = point(START + SWEEP, R);
const ARC = `M ${x0} ${y0} A ${R} ${R} 0 1 1 ${x1} ${y1}`;
const TICKS = Array.from({ length: 25 }, (_, i) => i);

function Gauge({ t, stat }) {
  const parsed = parseStat(stat.value);
  const fill = easeOutCubic(t) * FILL;
  const [nx, ny] = point(START + SWEEP * fill, R - 14);
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', width: { xs: 132, md: 168 }, mx: 'auto' }}>
        <Box component="svg" viewBox="0 0 120 104" sx={{ display: 'block', width: 1, overflow: 'visible' }} aria-hidden>
          {TICKS.map((i) => {
            const deg = START + (SWEEP * i) / (TICKS.length - 1);
            const major = i % 4 === 0;
            const [ax, ay] = point(deg, R + 4);
            const [bx, by] = point(deg, R + (major ? 9 : 6.5));
            const red = i / (TICKS.length - 1) > 0.88;
            return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={red ? '#8E2A2A' : 'rgba(244,241,234,0.28)'} strokeWidth={major ? 1 : 0.6} />;
          })}
          <path d={ARC} fill="none" stroke="rgba(244,241,234,0.08)" strokeWidth="2" pathLength="100" />
          <path d={ARC} fill="none" stroke="#C9A86A" strokeWidth="2" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - fill * 100} />
          <line x1={C} y1={C} x2={nx} y2={ny} stroke="#E6CF9A" strokeWidth="1" />
          <circle cx={C} cy={C} r="2.2" fill="#C9A86A" />
        </Box>
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.75 }}>
          <Typography sx={{ fontFamily: serif, fontWeight: 500, fontSize: { xs: 30, md: 38 }, lineHeight: 1 }}>{formatStat(countAt(parsed.number, t), parsed)}</Typography>
          {stat.suffix && <Typography sx={{ fontFamily: serif, fontStyle: 'italic', fontSize: { xs: 15, md: 18 }, color: 'primary.main' }}>{stat.suffix}</Typography>}
        </Box>
      </Box>
      <Typography sx={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'text.secondary', mt: 1.5, px: 1 }}>{stat.label}</Typography>
    </Box>
  );
}

// Смуга-специфікація під hero: чотири тахометри «накручуються», коли смуга з'являється на екрані.
export default function SpecStrip() {
  const { t } = useLang();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true });
  const ref = useRef(null);
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return undefined;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / DURATION);
          setProgress(p);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <Box component="section" sx={{ bgcolor: '#070708', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg" ref={ref} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, rowGap: 5, py: { xs: 6, md: 8 } }}>
        {t.hero.stats.map((s) => (
          <Gauge key={s.label} t={progress} stat={s} />
        ))}
      </Container>
      <Marquee label={t.hero.marqueeCars} items={carBrands} speed={70} />
    </Box>
  );
}
