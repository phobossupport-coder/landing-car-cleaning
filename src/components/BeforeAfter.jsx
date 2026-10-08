import { useCallback, useRef, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CodeIcon from '@mui/icons-material/Code';
import Section from './Section';
import { images } from '../data';

const points = ['Глибина й насиченість кольору', 'Без голограм і павутинки', 'Дзеркальне відображення', 'Захист, що зберігає результат'];

// Інтерактивний слайдер «до / після». Замість демо-фільтра покладіть
// власні фото у public/ і передайте шляхи в before/after.
function Slider({ before, after }) {
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

  const label = { position: 'absolute', top: 16, px: 1.5, py: 0.5, bgcolor: 'rgba(0,0,0,0.6)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600 };

  return (
    <Box
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
      sx={{ position: 'relative', aspectRatio: '4 / 3', cursor: 'ew-resize', userSelect: 'none', touchAction: 'pan-y', overflow: 'hidden' }}
    >
      <Box component="img" src={after} alt="Після полірування" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} draggable={false} />
      <Box
        component="img"
        src={before}
        alt="До полірування"
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
      <Box sx={{ ...label, left: 16 }}>ДО</Box>
      <Box sx={{ ...label, right: 16, color: 'primary.main' }}>ПІСЛЯ</Box>
      <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, bgcolor: 'primary.main', transform: 'translateX(-1px)' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <CodeIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default function BeforeAfter() {
  return (
    <Section id="results" dark>
      <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="overline" color="primary" component="p">
            Результат
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 3 }}>
            Різниця, яку не можна не помітити
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Потягніть повзунок, щоб порівняти. Кожне авто фотографуємо до і після під однаковим світлом — ви бачите чесний
            результат.
          </Typography>
          <Stack spacing={2} mb={5}>
            {points.map((p) => (
              <Stack key={p} direction="row" spacing={2} alignItems="center">
                <CheckIcon color="primary" />
                <Typography>{p}</Typography>
              </Stack>
            ))}
          </Stack>
          <Button href="#contact" variant="contained" size="large">
            Хочу такий результат
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Slider before={images.beforeAfter} after={images.beforeAfter} />
        </Grid>
      </Grid>
    </Section>
  );
}
