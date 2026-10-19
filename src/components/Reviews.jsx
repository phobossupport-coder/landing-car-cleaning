import { Box, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import { reviewCars } from '../data';
import { useLang } from '../i18n';

export default function Reviews() {
  const { t } = useLang();
  const reviews = t.reviews.items.map((r, i) => ({ ...r, car: reviewCars[i] }));
  return (
    <Section id="reviews">
      <SectionTitle title={t.reviews.title} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {reviews.map((r) => (
          <Box key={r.name} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography sx={{ mb: 2 }}>{r.text}</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{r.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {r.car}
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
