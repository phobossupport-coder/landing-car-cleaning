import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import SailingOutlinedIcon from '@mui/icons-material/SailingOutlined';
import Section from './Section';
import { images, serviceMeta } from '../data';
import { formatPrice } from '../i18n/currency';
import { useLang } from '../i18n';

export default function Yachts() {
  const { t } = useLang();
  const yachts = t.yachts;
  return (
    <Section id="yachts">
      <Box component="img" src={images.yacht} alt="" loading="lazy" sx={{ width: 1, height: { xs: 180, md: 320 }, objectFit: 'cover', borderRadius: 3, display: 'block', mb: { xs: 3, md: 5 } }} />
      <Grid container spacing={{ xs: 3, md: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h2" component="h2">
            {yachts.title1} {yachts.title2}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, mb: 2.5 }}>
            {yachts.intro}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mb: 3, p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <SailingOutlinedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="body2">{yachts.where}</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems={{ sm: 'center' }}>
            <Button href="#contact" variant="contained" size="large">
              {yachts.cta}
            </Button>
            <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
              <Box component="span" sx={{ fontWeight: 500, fontSize: 15, color: 'text.secondary', mr: 0.75 }}>
                {t.common.from}
              </Box>
              {formatPrice(serviceMeta[5].price, t.currency)}
              <Box component="span" sx={{ fontWeight: 500, fontSize: 15, color: 'text.secondary', ml: 0.75 }}>
                / {t.common.perFoot}
              </Box>
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            {yachts.points.map((p) => (
              <Box key={p.title}>
                <Typography variant="h4" component="h3" sx={{ mb: 0.5 }}>
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}
