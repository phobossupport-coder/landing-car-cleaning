import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Section, { Eyebrow } from './Section';
import Reveal from './Reveal';
import { portfolioSrc } from '../data';
import { useLang } from '../i18n';

// Фото з власного портфоліо: глибина і віддзеркалення лаку.
const PHOTO = { id: 'amg-g63', n: 3 };

export default function BeforeAfter() {
  const { t } = useLang();
  const r = t.results;
  return (
    <Section id="results">
      <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal>
            <Eyebrow align="left">{r.eyebrow}</Eyebrow>
            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
              {r.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {r.text}
            </Typography>
            <Stack spacing={2} mb={5}>
              {r.points.map((p) => (
                <Stack key={p} direction="row" spacing={2} alignItems="center">
                  <CheckIcon color="primary" />
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
          <Reveal delay={150}>
            <Box
              component="img"
              src={portfolioSrc(PHOTO.id, PHOTO.n, 1080)}
              srcSet={`${portfolioSrc(PHOTO.id, PHOTO.n, 640)} 640w, ${portfolioSrc(PHOTO.id, PHOTO.n, 1080)} 1080w`}
              sizes="(min-width: 900px) 58vw, 100vw"
              alt={r.alt}
              loading="lazy"
              sx={{ display: 'block', width: 1, aspectRatio: '4 / 5', objectFit: 'cover' }}
            />
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}
