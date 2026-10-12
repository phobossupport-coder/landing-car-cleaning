import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { carBrands, images, yachtBrands } from '../data';
import { serif } from '../theme';
import { useLang } from '../i18n';

// Бігова дорожка з марками. reverse — рух у протилежний бік, speed — секунди на цикл.
function Marquee({ items, label, reverse = false, speed = 60 }) {
  const row = [...items, ...items];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography
        variant="overline"
        sx={{
          flexShrink: 0,
          px: { xs: 2, md: 4 },
          py: 2.5,
          fontSize: '0.6rem',
          color: 'text.secondary',
          borderRight: '1px solid',
          borderColor: 'divider',
          minWidth: { xs: 96, md: 180 },
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
            '@keyframes marquee': { to: { transform: 'translateX(-50%)' } },
            '&:hover': { animationPlayState: 'paused' },
          }}
        >
          {row.map((p, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={{ xs: 3, md: 5 }} sx={{ pr: { xs: 3, md: 5 } }}>
              <Typography
                sx={{
                  fontFamily: serif,
                  fontWeight: 500,
                  fontSize: { xs: 18, md: 22 },
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(244,241,234,0.42)',
                  whiteSpace: 'nowrap',
                  transition: 'color .3s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {p}
              </Typography>
              <Box sx={{ width: 5, height: 5, transform: 'rotate(45deg)', bgcolor: 'primary.main', opacity: 0.6 }} />
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function Hero() {
  const { t } = useLang();
  const h = t.hero;
  return (
    <Box id="top" component="header" sx={{ position: 'relative', minHeight: 'min(100svh, 1080px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${images.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '62% center', md: 'center 40%' },
          transform: 'scale(1.08)',
          animation: 'heroZoom 22s ease-out forwards',
          '@keyframes heroZoom': { to: { transform: 'scale(1)' } },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(180deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.7) 50%, #0A0A0B 100%)',
            md: 'linear-gradient(90deg, rgba(10,10,11,0.96) 0%, rgba(10,10,11,0.78) 40%, rgba(10,10,11,0.25) 75%, rgba(10,10,11,0.5) 100%), linear-gradient(0deg, #0A0A0B 0%, rgba(10,10,11,0) 45%), linear-gradient(180deg, rgba(10,10,11,0.6) 0%, rgba(10,10,11,0) 30%)',
          },
        }}
      />

      {/* Вертикальний підпис зліва — деталь, яку помічають не одразу */}
      <Typography
        variant="overline"
        sx={{
          position: 'absolute',
          left: 28,
          bottom: 260,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left bottom',
          color: 'text.secondary',
          display: { xs: 'none', xl: 'block' },
          whiteSpace: 'nowrap',
        }}
      >
        {h.side}
      </Typography>

      <Container maxWidth="lg" sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', pt: { xs: 16, md: 18 }, pb: 8 }}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography
            variant="overline"
            color="primary"
            component="p"
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, animation: 'fadeUp 1s .1s both', '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(18px)' } } }}
          >
            <Box component="span" sx={{ width: 48, height: '1px', bgcolor: 'primary.main' }} />
            {h.eyebrow}
          </Typography>
          <Typography variant="h1" component="h1" sx={{ animation: 'fadeUp 1.1s .25s both' }}>
            {h.title1}
            <Box component="span" sx={{ display: 'block', fontStyle: 'italic', fontWeight: 500, color: 'primary.main' }}>
              {h.title2}
            </Box>
          </Typography>
          <Typography sx={{ mt: 4, fontSize: { xs: '1.05rem', md: '1.18rem' }, color: 'text.secondary', maxWidth: 560, animation: 'fadeUp 1.1s .4s both' }}>
            {h.text}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={6} sx={{ animation: 'fadeUp 1.1s .55s both' }}>
            <Button href="#contact" variant="contained" size="large" endIcon={<ArrowOutwardIcon />}>
              {h.cta1}
            </Button>
            <Button href="#services" variant="outlined" size="large">
              {h.cta2}
            </Button>
          </Stack>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ position: 'relative', pb: { xs: 5, md: 7 } }}>
        <Grid container sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4 }} rowSpacing={3}>
          {h.stats.map((s) => (
            <Grid key={s.label} size={{ xs: 6, md: 3 }}>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography sx={{ fontFamily: serif, fontWeight: 500, fontSize: { xs: 40, md: 54 }, lineHeight: 1, color: 'text.primary' }}>{s.value}</Typography>
                {s.suffix && (
                  <Typography sx={{ fontFamily: serif, fontStyle: 'italic', fontSize: { xs: 18, md: 22 }, color: 'primary.main' }}>{s.suffix}</Typography>
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, letterSpacing: '0.02em' }}>
                {s.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ position: 'relative', bgcolor: '#070708', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Marquee label={h.marqueeCars} items={carBrands} speed={70} />
        <Marquee label={h.marqueeYachts} items={yachtBrands} reverse speed={85} />
      </Box>
    </Box>
  );
}
