import { Box, Grid, Stack, Typography } from '@mui/material';
import Section, { Eyebrow } from './Section';
import Reveal from './Reveal';
import { images } from '../data';
import { serif } from '../theme';
import { useLang } from '../i18n';

export default function Process() {
  const { t } = useLang();
  const p = t.process;
  return (
    <Section id="process" dark>
      <Grid container spacing={{ xs: 6, md: 10 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: 'sticky' }, top: 120 }}>
            <Reveal>
              <Eyebrow align="left">{p.eyebrow}</Eyebrow>
              <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
                {p.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 5 }}>
                {p.text}
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Box component="img" src={images.studio} alt={p.imageAlt} loading="lazy" sx={{ width: 1, aspectRatio: '4 / 3', objectFit: 'cover', filter: 'grayscale(0.35) contrast(1.05)', display: 'block' }} />
                <Box sx={{ position: 'absolute', inset: 14, border: '1px solid rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
              </Box>
            </Reveal>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack>
            {p.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <Stack direction="row" spacing={{ xs: 3, md: 5 }} sx={{ py: { xs: 4, md: 5 }, borderBottom: '1px solid', borderColor: 'divider', '&:first-of-type': { pt: 0 } }}>
                  <Typography sx={{ fontFamily: serif, fontStyle: 'italic', fontSize: { xs: 44, md: 64 }, lineHeight: 0.9, color: 'primary.main', opacity: 0.85, minWidth: { xs: 56, md: 88 } }}>
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Box>
                    <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
                      {s.title}
                    </Typography>
                    <Typography color="text.secondary">{s.text}</Typography>
                  </Box>
                </Stack>
              </Reveal>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}
