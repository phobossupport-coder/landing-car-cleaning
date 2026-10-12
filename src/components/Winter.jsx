import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Section, { Eyebrow } from './Section';
import Reveal from './Reveal';
import { images, winter } from '../data';
import { serif } from '../theme';

export default function Winter() {
  return (
    <Section id="winter" dark sx={{ overflow: 'hidden' }}>
      {/* Холодне свічення у кутку — натяк на сезон без банальних сніжинок */}
      <Box
        sx={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,160,200,0.14) 0%, rgba(120,160,200,0) 60%)',
          pointerEvents: 'none',
        }}
      />
      <Grid container spacing={{ xs: 6, md: 10 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal sx={{ height: 1 }}>
            <Box sx={{ position: 'relative', height: 1, minHeight: { xs: 360, md: 640 } }}>
              <Box
                component="img"
                src={images.winter}
                alt="Авто в студії перед зимовою підготовкою"
                loading="lazy"
                sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover', filter: 'saturate(0.6) brightness(0.9)' }}
              />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, rgba(120,160,200,0.18) 0%, rgba(7,7,8,0) 50%, rgba(7,7,8,0.9) 100%)' }} />
              <Box sx={{ position: 'absolute', inset: 16, border: '1px solid rgba(255,255,255,0.14)', pointerEvents: 'none' }} />
              <Stack sx={{ position: 'absolute', left: 40, bottom: 40, right: 40 }} spacing={1}>
                <AcUnitOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography sx={{ fontFamily: serif, fontSize: { xs: 34, md: 44 }, lineHeight: 1.05 }}>
                  Сезон <Box component="span" sx={{ fontStyle: 'italic', color: 'primary.main' }}>2026/27</Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {winter.note}
                </Typography>
              </Stack>
            </Box>
          </Reveal>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Reveal>
            <Eyebrow align="left">Сезонна програма</Eyebrow>
            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
              Підготовка авто до зими.
              <Box component="span" sx={{ display: 'block', fontStyle: 'italic', color: 'primary.main' }}>
                Повний цикл.
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 600 }}>
              {winter.intro}
            </Typography>
          </Reveal>

          <Grid container spacing={0} sx={{ borderTop: '1px solid', borderColor: 'divider', mb: 5 }}>
            {winter.steps.map((s, i) => (
              <Grid key={s.title} size={{ xs: 12, sm: 6 }} sx={{ borderBottom: '1px solid', borderColor: 'divider', pr: { sm: i % 2 === 0 ? 4 : 0 }, pl: { sm: i % 2 === 1 ? 4 : 0 } }}>
                <Reveal delay={i * 60}>
                  <Stack direction="row" spacing={2.5} sx={{ py: 2.5 }}>
                    <Typography sx={{ fontFamily: serif, fontSize: 18, color: 'primary.main', minWidth: 28, pt: 0.2 }}>{String(i + 1).padStart(2, '0')}</Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}>{s.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.text}
                      </Typography>
                    </Box>
                  </Stack>
                </Reveal>
              </Grid>
            ))}
          </Grid>

          <Reveal>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 5 }} alignItems={{ sm: 'center' }}>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="overline" color="text.secondary">від</Typography>
                <Typography sx={{ fontFamily: serif, fontSize: 48, lineHeight: 1, color: 'primary.light' }}>{winter.price}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">{winter.duration}</Typography>
              </Stack>
              <Box sx={{ flex: 1 }} />
              <Button href="#contact" variant="contained" size="large">
                Забронювати дату
              </Button>
            </Stack>
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}
