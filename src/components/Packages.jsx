import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Section, { SectionTitle } from './Section';
import { packages } from '../data';

export default function Packages() {
  return (
    <Section id="packages">
      <SectionTitle
        overline="Пакети"
        title="Прозорі ціни без сюрпризів"
        subtitle="Ціни для седана середнього класу. Остаточну вартість фіксуємо після безкоштовного огляду."
      />
      <Grid container spacing={3} alignItems="stretch">
        {packages.map((p) => (
          <Grid key={p.name} size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: 1,
                p: { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                bgcolor: p.featured ? 'background.paper' : 'transparent',
                border: '1px solid',
                borderColor: p.featured ? 'primary.main' : 'divider',
                transition: 'transform .3s, border-color .3s',
                '&:hover': { transform: 'translateY(-6px)', borderColor: 'primary.main' },
              }}
            >
              {p.featured && (
                <Chip label="Найпопулярніший" color="primary" size="small" sx={{ position: 'absolute', top: -12, left: 40, fontWeight: 600, borderRadius: 1 }} />
              )}
              <Typography variant="overline" color="text.secondary">
                {p.subtitle}
              </Typography>
              <Typography variant="h3" component="h3" sx={{ mb: 3 }}>
                {p.name}
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography color="text.secondary">від</Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 44, color: p.featured ? 'primary.main' : 'text.primary' }}>
                  {p.price}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mb: 4 }}>
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">{p.duration}</Typography>
              </Stack>
              <Stack spacing={1.5} sx={{ mb: 5, flex: 1 }}>
                {p.features.map((f) => (
                  <Stack key={f} direction="row" spacing={1.5}>
                    <CheckIcon fontSize="small" color="primary" sx={{ mt: 0.4 }} />
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                      {f}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Button href="#contact" variant={p.featured ? 'contained' : 'outlined'} size="large" fullWidth>
                Обрати пакет
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
