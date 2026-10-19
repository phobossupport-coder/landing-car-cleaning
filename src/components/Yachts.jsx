import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import SailingOutlinedIcon from '@mui/icons-material/SailingOutlined';
import { Eyebrow } from './Section';
import Reveal from './Reveal';
import { images, serviceMeta } from '../data';
import { formatPrice } from '../i18n/currency';
import { serif } from '../theme';
import { useLang } from '../i18n';

export default function Yachts() {
  const { t } = useLang();
  const yachts = t.yachts;
  return (
    <Box component="section" id="yachts" sx={{ position: 'relative', scrollMarginTop: 72, overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${images.yacht})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(0.55) brightness(0.55)',
        }}
      />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,11,0.94) 0%, rgba(10,10,11,0.8) 45%, rgba(10,10,11,0.35) 100%)' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0A0A0B 0%, rgba(10,10,11,0) 18%, rgba(10,10,11,0) 82%, #0A0A0B 100%)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 12, md: 18 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal>
              <Eyebrow align="left">{yachts.eyebrow}</Eyebrow>
              <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
                {yachts.title1}
                <Box component="span" sx={{ display: 'block', fontStyle: 'italic', color: 'primary.main' }}>
                  {yachts.title2}
                </Box>
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 520 }}>
                {yachts.intro}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 5, p: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(10,10,11,0.5)', backdropFilter: 'blur(8px)', maxWidth: 520 }}>
                <SailingOutlinedIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary">
                  {yachts.where}
                </Typography>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} alignItems={{ sm: 'center' }} useFlexGap flexWrap="wrap">
                <Button href="#contact" variant="outlined" size="large" sx={{ whiteSpace: 'nowrap' }}>
                  {yachts.cta}
                </Button>
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="overline" color="text.secondary">{t.common.from}</Typography>
                  <Typography sx={{ fontFamily: serif, fontSize: 30, lineHeight: 1, color: 'primary.light' }}>{formatPrice(serviceMeta[5].price, t.currency)}</Typography>
                  <Typography variant="body2" color="text.secondary">/ {t.common.perFoot}</Typography>
                </Stack>
              </Stack>
            </Reveal>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.14)' }}>
              {yachts.points.map((p, i) => (
                <Reveal key={p.title} delay={i * 100}>
                  <Stack direction="row" spacing={3} sx={{ py: 3.5, borderBottom: '1px solid', borderColor: 'rgba(255,255,255,0.14)' }}>
                    <Typography sx={{ fontFamily: serif, fontSize: 30, lineHeight: 1, color: 'primary.main', minWidth: 48 }}>{String(i + 1).padStart(2, '0')}</Typography>
                    <Box>
                      <Typography variant="h5" component="h3" sx={{ mb: 0.75 }}>
                        {p.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.text}
                      </Typography>
                    </Box>
                  </Stack>
                </Reveal>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
