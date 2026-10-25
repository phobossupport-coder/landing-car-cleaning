import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import SailingOutlinedIcon from '@mui/icons-material/SailingOutlined';
import { Eyebrow } from './Section';
import Reveal from './Reveal';
import { images, serviceMeta } from '../data';
import { formatPrice } from '../i18n/currency';
import { serif } from '../theme';
import { useLang } from '../i18n';
import { useBooking } from '../booking';

export default function Yachts() {
  const { t } = useLang();
  const { setService } = useBooking();
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
      <Box
        sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,11,0.94) 0%, rgba(10,10,11,0.8) 45%, rgba(10,10,11,0.35) 100%)' }}
      />
      <Box
        sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0A0A0B 0%, rgba(10,10,11,0) 18%, rgba(10,10,11,0) 82%, #0A0A0B 100%)' }}
      />

      {/* Яхти — другорядний напрям: компактний блок без детальних описів пунктів */}
      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 9, md: 12 } }}>
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal>
              <Eyebrow align="left" section="yachts">
                {yachts.eyebrow}
              </Eyebrow>
              <Typography variant="h3" component="h2" sx={{ mt: 2, mb: 2 }}>
                {yachts.title1}{' '}
                <Box component="span" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                  {yachts.title2}
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                {yachts.intro}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2.5, color: 'text.secondary' }}>
                <SailingOutlinedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="body2">{yachts.where}</Typography>
              </Stack>
            </Reveal>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal delay={120}>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  mb: 4,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderTop: '1px solid',
                  borderColor: 'rgba(255,255,255,0.14)',
                }}
              >
                {yachts.points.map((p) => (
                  <Box
                    component="li"
                    key={p.title}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'baseline',
                      py: 1.75,
                      pr: 2,
                      borderBottom: '1px solid',
                      borderColor: 'rgba(255,255,255,0.14)',
                    }}
                  >
                    <Box sx={{ width: 5, height: 5, transform: 'rotate(45deg)', bgcolor: 'primary.main', flexShrink: 0, position: 'relative', top: -2 }} />
                    <Typography variant="body2">{p.title}</Typography>
                  </Box>
                ))}
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} alignItems={{ sm: 'center' }} useFlexGap flexWrap="wrap">
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="overline" color="text.secondary">
                    {t.common.from}
                  </Typography>
                  <Typography sx={{ fontFamily: serif, fontSize: 30, lineHeight: 1, color: 'primary.light' }}>
                    {formatPrice(serviceMeta[5].price, t.currency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {t.common.perFoot}
                  </Typography>
                </Stack>
                <Button
                  href="#contact"
                  onClick={() => setService(`service-${serviceMeta.length - 1}`)}
                  variant="outlined"
                  size="large"
                  sx={{ whiteSpace: { sm: 'nowrap' } }}
                >
                  {yachts.cta}
                </Button>
              </Stack>
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
