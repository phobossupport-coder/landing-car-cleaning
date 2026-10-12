import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Section, { SectionTitle } from './Section';
import Reveal from './Reveal';
import { packages } from '../data';
import { serif } from '../theme';

export default function Packages() {
  return (
    <Section id="packages">
      <SectionTitle
        overline="Пакети"
        title="Прозорі ціни без сюрпризів"
        subtitle="Ціни для седана бізнес-класу. Для суперкарів, лімузинів та яхт розраховуємо індивідуально після огляду."
      />
      <Grid container spacing={{ xs: 3, md: 0 }} alignItems="stretch">
        {packages.map((p, i) => (
          <Grid key={p.name} size={{ xs: 12, md: 4 }}>
            <Reveal delay={i * 140} sx={{ height: 1 }}>
              <Box
                sx={{
                  height: 1,
                  p: { xs: 4, md: 5 },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  bgcolor: p.featured ? 'background.paper' : 'transparent',
                  border: '1px solid',
                  borderColor: p.featured ? 'rgba(201,168,106,0.6)' : 'divider',
                  ml: { md: i === 0 ? 0 : '-1px' },
                  my: { md: p.featured ? -3 : 0 },
                  py: { md: p.featured ? 8 : 5 },
                  zIndex: p.featured ? 1 : 0,
                  transition: 'border-color .4s, transform .4s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                {p.featured && (
                  <Typography variant="overline" color="primary" component="p" sx={{ position: { xs: 'static', md: 'absolute' }, top: 18, right: 24, fontSize: '0.6rem', mb: { xs: 2, md: 0 } }}>
                    Обирають найчастіше
                  </Typography>
                )}
                <Typography variant="overline" color="text.secondary">
                  {p.subtitle}
                </Typography>
                <Typography variant="h3" component="h3" sx={{ mb: 3 }}>
                  {p.name}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="overline" color="text.secondary">від</Typography>
                  <Typography sx={{ fontFamily: serif, fontSize: 52, lineHeight: 1, color: p.featured ? 'primary.light' : 'text.primary' }}>
                    {p.price}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mt: 1.5, mb: 4 }}>
                  <ScheduleIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{p.duration}</Typography>
                </Stack>
                <Stack sx={{ mb: 5, flex: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  {p.features.map((f) => (
                    <Stack key={f} direction="row" spacing={2} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ width: 5, height: 5, mt: 1.1, transform: 'rotate(45deg)', bgcolor: 'primary.main', flexShrink: 0 }} />
                      <Typography variant="body2">{f}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button href="#contact" variant={p.featured ? 'contained' : 'outlined'} size="large" fullWidth>
                  Обрати {p.name}
                </Button>
              </Box>
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
