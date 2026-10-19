import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Section from './Section';
import { images, winterMeta } from '../data';
import { useLang } from '../i18n';
import { formatPrice } from '../i18n/currency';

export default function Winter() {
  const { t } = useLang();
  const winter = t.winter;
  return (
    <Section id="winter" dark>
      <Grid container spacing={{ xs: 3, md: 8 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: 'relative', height: { xs: 200, md: 1 }, minHeight: { md: 420 }, borderRadius: 3, overflow: 'hidden' }}>
            <Box component="img" src={images.winter} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(12,15,20,0.75), rgba(12,15,20,0) 60%)' }} />
            <Typography sx={{ position: 'absolute', left: 20, bottom: 16, color: '#fff', fontWeight: 700, fontSize: 22 }}>
              {winter.season} {winterMeta.season}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h2" component="h2">
            {winter.title1} {winter.title2}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, mb: 2.5 }}>
            {winter.intro}
          </Typography>
          <Stack component="ul" spacing={1.75} sx={{ listStyle: 'none', p: 0, m: 0, mb: 3 }}>
            {winter.steps.map((s) => (
              <Stack key={s.title} component="li" direction="row" spacing={1.5} alignItems="flex-start">
                <CheckIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.text}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {winter.note}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems={{ sm: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1 }}>
                <Box component="span" sx={{ fontWeight: 500, fontSize: 15, color: 'text.secondary', mr: 0.75 }}>
                  {t.common.from}
                </Box>
                {formatPrice(winterMeta.price, t.currency)}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mt: 0.5 }}>
                <ScheduleIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{winter.duration}</Typography>
              </Stack>
            </Box>
            <Button href="#contact" variant="contained" size="large" sx={{ ml: { sm: 'auto' } }}>
              {winter.cta}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}
