import { Box, Container, Fab, IconButton, Stack, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Logo } from './Header';
import { brand, nav } from '../data';

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 6 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Logo />
          <Stack direction="row" flexWrap="wrap" columnGap={3} rowGap={1}>
            {nav.map((n) => (
              <Typography key={n.href} component="a" href={n.href} variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                {n.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton href={brand.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton href={brand.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp">
              <WhatsAppIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} {brand.name} {brand.tagline}. Усі права захищено.
        </Typography>
      </Container>

      <Fab
        href={brand.whatsapp}
        target="_blank"
        rel="noopener"
        aria-label="Написати у WhatsApp"
        sx={{ position: 'fixed', right: 20, bottom: 20, bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1EBE5A' } }}
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
}
