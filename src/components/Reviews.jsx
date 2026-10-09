import { Avatar, Box, Grid, Rating, Stack, Typography } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Section, { SectionTitle } from './Section';
import { reviews } from '../data';

export default function Reviews() {
  return (
    <Section id="reviews" dark>
      <SectionTitle overline="Відгуки" title="Нам довіряють свої авто" />
      <Grid container spacing={3}>
        {reviews.map((r) => (
          <Grid key={r.name} size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: 1, p: { xs: 4, md: 5 }, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
              <FormatQuoteIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, transform: 'scaleX(-1)' }} />
              <Typography sx={{ flex: 1, mb: 4, fontSize: '1.05rem' }}>{r.text}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }}>{r.name[0]}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>{r.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.car}
                  </Typography>
                </Box>
                <Rating value={5} readOnly size="small" sx={{ color: 'primary.main' }} />
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
