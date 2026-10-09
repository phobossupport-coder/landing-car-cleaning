import { Box, Grid, Stack, Typography } from '@mui/material';
import Section from './Section';
import { images, steps } from '../data';

export default function Process() {
  return (
    <Section id="process" dark>
      <Grid container spacing={{ xs: 6, md: 10 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: 'sticky' }, top: 120 }}>
            <Typography variant="overline" color="primary" component="p">
              Як ми працюємо
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 3 }}>
              П’ять етапів до ідеального блиску
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Закрита тепла студія, професійне світло, контроль якості на кожному етапі. Ви можете спостерігати за
              роботою або отримувати фотозвіт.
            </Typography>
            <Box
              component="img"
              src={images.studio}
              alt="Робота в студії"
              loading="lazy"
              sx={{ width: 1, aspectRatio: '4 / 3', objectFit: 'cover', filter: 'grayscale(0.2)' }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack>
            {steps.map((s, i) => (
              <Stack
                key={s.title}
                direction="row"
                spacing={{ xs: 3, md: 5 }}
                sx={{ py: { xs: 4, md: 5 }, borderBottom: '1px solid', borderColor: 'divider', '&:first-of-type': { pt: 0 } }}
              >
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: { xs: 40, md: 56 }, lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px #C9A86A', minWidth: { xs: 56, md: 80 } }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box>
                  <Typography variant="h4" component="h3" gutterBottom>
                    {s.title}
                  </Typography>
                  <Typography color="text.secondary">{s.text}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}
