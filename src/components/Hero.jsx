import { Box, Button, Container, Stack, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { brand, images } from '../data';
import { useLang } from '../i18n';

export default function Hero() {
  const { t } = useLang();
  const h = t.hero;
  return (
    <Box id="top" component="header" sx={{ position: 'relative', color: '#fff', bgcolor: '#14181F', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${images.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '62% center', md: 'center 40%' },
        }}
      />
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(12,15,20,0.72)' }} />
      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 5, md: 12 } }}>
        <Box sx={{ maxWidth: 680 }}>
          <Typography variant="h1" component="h1">
            {h.title}
          </Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: '1.0625rem', md: '1.2rem' }, color: 'rgba(255,255,255,0.88)' }}>{h.text}</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={3.5}>
            <Button href="#contact" variant="contained" size="large">
              {h.cta1}
            </Button>
            <Button
              href={brand.phoneHref}
              size="large"
              startIcon={<PhoneIcon />}
              sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.5)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
            >
              {brand.phone}
            </Button>
          </Stack>
          <Stack spacing={1} useFlexGap mt={3.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {h.facts.map((f) => (
              <Stack key={f} component="li" direction="row" spacing={1.25} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 22, color: '#8DB4FF' }} />
                <Typography>{f}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
