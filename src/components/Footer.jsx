import { Box, Container, Fab, IconButton, Stack, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Logo } from './Header';
import { brand, nav } from '../data';

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 6, bgcolor: '#070708' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Logo />
          <Stack direction="row" flexWrap="wrap" columnGap={3} rowGap={1}>
            {nav.map((n) => (
              <Typography key={n.href} component="a" href={n.href} variant="overline" sx={{ fontSize: '0.62rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                {n.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton href={brand.instagram} target="_blank" rel="noopener" aria-label="Instagram" sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton href={brand.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp" sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
              <WhatsAppIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 5, fontSize: 12 }}>
          © {new Date().getFullYear()} {brand.name} {brand.tagline}. Автомобілі та яхти. Усі права захищено.
        </Typography>
      </Container>

      <Fab
        href={brand.whatsapp}
        target="_blank"
        rel="noopener"
        aria-label="Написати у WhatsApp"
        sx={{ position: 'fixed', right: 20, bottom: 20, bgcolor: '#111113', color: '#F4F1EA', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: '#1A1A1D', borderColor: 'primary.main', color: 'primary.main' } }}
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
}
