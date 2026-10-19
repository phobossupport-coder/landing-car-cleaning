import { useCallback, useRef, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CodeIcon from '@mui/icons-material/Code';
import Section from './Section';
import Reveal from './Reveal';
import { images } from '../data';
import { useLang } from '../i18n';


// Інтерактивний слайдер «до / після». Замість демо-фільтра покладіть
// власні фото у public/ і передайте шляхи в before/after.
function Slider({ before, after, labels }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);

  const move = useCallback((clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e.clientX);
  };

  const label = { position: 'absolute', top: 16, px: 1.5, py: 0.5, bgcolor: 'rgba(0,0,0,0.6)', fontSize: 12, fontWeight: 600, color: '#fff', borderRadius: 1 };

  return (
    <Box
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
      sx={{ position: 'relative', aspectRatio: '4 / 3', cursor: 'ew-resize', userSelect: 'none', touchAction: 'pan-y', overflow: 'hidden', borderRadius: 3 }}
    >
      <Box component="img" src={after} alt={labels.after} sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} draggable={false} />
      <Box
        component="img"
        src={before}
        alt={labels.before}
        draggable={false}
        sx={{
          position: 'absolute',
          inset: 0,
          width: 1,
          height: 1,
          objectFit: 'cover',
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          filter: before === after ? 'saturate(0.35) contrast(0.75) brightness(0.85) blur(0.6px)' : 'none',
        }}
      />
      <Box sx={{ ...label, left: 16 }}>{labels.before}</Box>
      <Box sx={{ ...label, right: 16 }}>{labels.after}</Box>
      <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, bgcolor: '#fff', transform: 'translateX(-1px)' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            bgcolor: '#fff',
            color: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
          }}
        >
          <CodeIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default function BeforeAfter() {
  const { t } = useLang();
  const r = t.results;
  return (
    <Section id="results">
      <Grid container spacing={{ xs: 3, md: 8 }} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal>
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            {r.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            {r.text}
          </Typography>
          <Stack spacing={1.25} mb={3}>
            {r.points.map((p) => (
              <Stack key={p} direction="row" spacing={2} alignItems="center">
                <CheckIcon color="primary" fontSize="small" />
                <Typography>{p}</Typography>
              </Stack>
            ))}
          </Stack>
          <Button href="#contact" variant="contained" size="large">
            {r.cta}
          </Button>
          </Reveal>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Reveal>
            <Slider before={images.beforeAfter} after={images.beforeAfter} labels={{ before: r.before, after: r.after }} />
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}
