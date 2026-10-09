import { Box, Button, Stack, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import { protection } from '../data';

// Шкала в місяцях, логарифмічна — щоб віск (2–4 міс.) і кераміка (до 60 міс.) були видимі разом.
const MAX = 60;
const pct = (m) => (Math.log(m + 1) / Math.log(MAX + 1)) * 100;
const ticks = [{ m: 3, l: '3 міс.' }, { m: 6, l: '6 міс.' }, { m: 12, l: '1 рік' }, { m: 60, l: '5 років' }];

export default function Protection() {
  return (
    <Section id="protection" dark>
      <SectionTitle
        overline="Захист"
        title="Як довго діє кожен захист"
        subtitle="Не знаєте, що обрати? Порівняйте терміни — а ми підкажемо найкращий варіант для вашого авто."
      />
      <Stack spacing={4}>
        {protection.map((p) => (
          <Box key={p.name} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr 110px' }, gap: { xs: 1, md: 4 }, alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h3">
                {p.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {p.note}
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 14, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 7 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${pct(p.from)}%`,
                  width: `${pct(p.to) - pct(p.from)}%`,
                  minWidth: 14,
                  borderRadius: 7,
                  background: 'linear-gradient(90deg, #A88A4F, #E2C998)',
                }}
              />
            </Box>
            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'primary.main', textAlign: { md: 'right' } }}>{p.label}</Typography>
          </Box>
        ))}
        <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '240px 1fr 110px', gap: 4 }}>
          <span />
          <Box sx={{ position: 'relative', height: 20, borderTop: '1px solid', borderColor: 'divider' }}>
            {ticks.map((t) => (
              <Typography key={t.l} variant="caption" color="text.secondary" sx={{ position: 'absolute', top: 6, left: `${pct(t.m)}%`, transform: 'translateX(-50%)' }}>
                {t.l}
              </Typography>
            ))}
          </Box>
        </Box>
      </Stack>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Button href="#contact" variant="contained" size="large">
          Підібрати захист
        </Button>
      </Box>
    </Section>
  );
}
