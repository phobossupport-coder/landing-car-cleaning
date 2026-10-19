import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Logo } from './Header';
import { brand, navHrefs } from '../data';
import { useLang } from '../i18n';
import LanguageSwitch from './LanguageSwitch';

export default function Footer() {
  const { t } = useLang();
  const nav = t.nav.map((label, i) => ({ label, href: navHrefs[i] }));
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 4, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Logo />
          <Stack direction="row" flexWrap="wrap" columnGap={2.5}>
            {nav.map((n) => (
              <Typography key={n.href} component="a" href={n.href} sx={{ py: 1.25, fontSize: 15, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
                {n.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton href={brand.instagram} target="_blank" rel="noopener" aria-label="Instagram" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <InstagramIcon />
            </IconButton>
            <IconButton href={brand.whatsapp} target="_blank" rel="noopener" aria-label={t.footer.whatsapp} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <WhatsAppIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {brand.name} Detailing. {t.footer.rights}
          </Typography>
          <LanguageSwitch />
        </Stack>
      </Container>
    </Box>
  );
}
