import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Section, { SectionTitle } from './Section';
import { packageMeta } from '../data';
import { useLang } from '../i18n';
import { formatPrice } from '../i18n/currency';

export default function Packages() {
  const { t } = useLang();
  const packages = t.packages.items.map((p, i) => ({ ...p, ...packageMeta[i] }));
  return (
    <Section id="packages" dark>
      <SectionTitle title={t.packages.title} subtitle={`${t.packages.subtitle} ${t.common.vat}`} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {packages.map((p) => (
          <Box
            key={p.name}
            sx={{ display: 'flex', flexDirection: 'column', p: 2.5, bgcolor: 'background.paper', borderRadius: 3, border: '2px solid', borderColor: p.featured ? 'primary.main' : 'divider' }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: 28 }}>
              <Typography variant="h3" component="h3">
                {p.name}
              </Typography>
              {p.featured && <Chip size="small" color="primary" label={t.packages.featured} />}
            </Stack>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              {p.subtitle}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 32, lineHeight: 1.1 }}>
              <Box component="span" sx={{ fontWeight: 500, fontSize: 15, color: 'text.secondary', mr: 0.75 }}>
                {t.common.from}
              </Box>
              {formatPrice(p.price, t.currency)}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mt: 0.75, mb: 2 }}>
              <ScheduleIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{p.duration}</Typography>
            </Stack>
            <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', p: 0, m: 0, mb: 3, flex: 1 }}>
              {p.features.map((f) => (
                <Stack key={f} component="li" direction="row" spacing={1.25} alignItems="flex-start">
                  <CheckIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.1 }} />
                  <Typography variant="body2">{f}</Typography>
                </Stack>
              ))}
            </Stack>
            <Button href="#contact" variant={p.featured ? 'contained' : 'outlined'} size="large" fullWidth>
              {t.packages.choose} {p.name}
            </Button>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
