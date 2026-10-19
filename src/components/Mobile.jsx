import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import Section, { Eyebrow } from './Section';
import Reveal from './Reveal';
import { useLang } from '../i18n';

// Основний формат роботи — виїзд до клієнта.
export default function Mobile() {
  const { t } = useLang();
  const m = t.mobile;
  return (
    <Section id="mobile" dark>
      <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Reveal>
            <Eyebrow align="left">{m.eyebrow}</Eyebrow>
            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
              {m.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 520 }}>
              {m.text}
            </Typography>
            <Button href="#contact" variant="contained" size="large" startIcon={<DirectionsCarFilledOutlinedIcon />}>
              {m.cta}
            </Button>
          </Reveal>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            {m.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <Box sx={{ py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h5" component="h3" sx={{ mb: 0.75 }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.text}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}
