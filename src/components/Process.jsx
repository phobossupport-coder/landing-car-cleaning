import { Box, Stack, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import { useLang } from '../i18n';

// Кроки йдуть послідовно, тому тут доречна нумерація.
export default function Process() {
  const { t } = useLang();
  const p = t.process;
  return (
    <Section id="process">
      <SectionTitle title={p.title} subtitle={p.text} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
        {p.steps.map((s, i) => (
          <Stack key={s.title} direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 2, md: 1.5 }}>
            <Box sx={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
              {i + 1}
            </Box>
            <Box>
              <Typography variant="h4" component="h3" sx={{ mb: 0.5 }}>
                {s.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.text}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Section>
  );
}
