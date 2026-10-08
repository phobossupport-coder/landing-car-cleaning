import { Box, Button, Container, Grid, Rating, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { images, partners, stats } from '../data';

export default function Hero() {
  return (
    <Box id="top" component="header" sx={{ position: 'relative', minHeight: 'min(100svh, 1000px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${images.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          transform: 'scale(1.05)',
          animation: 'heroZoom 18s ease-out forwards',
          '@keyframes heroZoom': { to: { transform: 'scale(1)' } },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(11,11,13,0.95) 0%, rgba(11,11,13,0.7) 45%, rgba(11,11,13,0.2) 100%), linear-gradient(0deg, #0B0B0D 0%, rgba(11,11,13,0) 40%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', pt: 14, pb: 6 }}>
        <Box sx={{ maxWidth: 680 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
            <Rating value={5} readOnly size="small" sx={{ color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              4.9 · 380+ відгуків у Google
            </Typography>
          </Stack>
          <Typography variant="h1" component="h1">
            Блиск, який{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              видно здалеку
            </Box>
          </Typography>
          <Typography sx={{ mt: 3, fontSize: { xs: '1.05rem', md: '1.2rem' }, color: 'text.secondary', maxWidth: 560 }}>
            Професійне полірування кузова, корекція лаку та керамічний захист. Повертаємо авто глибину кольору й дзеркальний
            блиск — з гарантією результату.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={5}>
            <Button href="#contact" variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
              Безкоштовний огляд
            </Button>
            <Button href="#packages" variant="outlined" size="large" color="secondary">
              Ціни та пакети
            </Button>
          </Stack>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ position: 'relative', pb: 5 }}>
        <Grid container sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4 }} rowSpacing={3}>
          {stats.map((s) => (
            <Grid key={s.label} size={{ xs: 6, md: 3 }}>
              <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: { xs: 28, md: 36 } }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ position: 'relative', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#08080A', py: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: 'marquee 30s linear infinite',
            '@keyframes marquee': { to: { transform: 'translateX(-50%)' } },
          }}
        >
          {[...partners, ...partners, ...partners, ...partners].map((p, i) => (
            <Typography
              key={i}
              sx={{ px: { xs: 4, md: 7 }, fontFamily: 'Montserrat', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}
            >
              {p}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
