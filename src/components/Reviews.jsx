import { Box, Grid, Stack, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import Reveal from './Reveal';
import { reviews } from '../data';
import { serif } from '../theme';

export default function Reviews() {
  return (
    <Section id="reviews" dark>
      <SectionTitle overline="Відгуки" title="Нам довіряють те, що цінують" />
      <Grid container spacing={0} sx={{ borderTop: '1px solid', borderLeft: '1px solid', borderColor: 'divider' }}>
        {reviews.map((r, i) => (
          <Grid key={r.name} size={{ xs: 12, md: 4 }} sx={{ borderRight: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Reveal delay={i * 140} sx={{ height: 1 }}>
              <Box sx={{ height: 1, p: { xs: 4, md: 5 }, display: 'flex', flexDirection: 'column', transition: 'background .4s', '&:hover': { bgcolor: 'background.paper' } }}>
                <Typography sx={{ fontFamily: serif, fontSize: 72, lineHeight: 0.6, color: 'primary.main', mb: 3, opacity: 0.8 }}>“</Typography>
                <Typography sx={{ flex: 1, mb: 4, fontFamily: serif, fontSize: '1.35rem', lineHeight: 1.45 }}>{r.text}</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 28, height: '1px', bgcolor: 'primary.main' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.name}</Typography>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      {r.car}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
