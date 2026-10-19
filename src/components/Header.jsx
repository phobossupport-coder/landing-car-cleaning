import { useState } from 'react';
import { AppBar, Box, Button, Container, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import { brand, navHrefs } from '../data';
import { useLang } from '../i18n';
import LanguageSwitch from './LanguageSwitch';

export function Logo({ color = 'text.primary' }) {
  return (
    <Box component="a" href="#top" sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, color, textDecoration: 'none' }}>
      <Typography component="span" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '0.04em' }}>
        {brand.name}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 500, fontSize: 15, opacity: 0.7 }}>
        Detailing
      </Typography>
    </Box>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const nav = t.nav.map((label, i) => ({ label, href: navHrefs[i] }));

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 68 }, justifyContent: 'space-between', gap: 3 }}>
          <Logo />
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            {nav.map((item) => (
              <Typography
                key={item.href}
                component="a"
                href={item.href}
                sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: 15, fontWeight: 500, py: 1, '&:hover': { color: 'text.primary' } }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LanguageSwitch sx={{ display: { xs: 'none', lg: 'flex' } }} />
            <Button href={brand.phoneHref} startIcon={<PhoneIcon />} color="secondary" sx={{ display: { xs: 'none', md: 'inline-flex' }, whiteSpace: 'nowrap' }}>
              {brand.phone}
            </Button>
            <Button href="#contact" variant="contained" sx={{ display: { xs: 'none', sm: 'inline-flex' }, whiteSpace: 'nowrap' }}>
              {t.header.cta}
            </Button>
            <IconButton onClick={() => setOpen(true)} sx={{ display: { lg: 'none' } }} aria-label={t.header.menu}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: '100%', maxWidth: 400, p: 2.5 } } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Logo />
          <IconButton onClick={() => setOpen(false)} aria-label={t.header.close}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <LanguageSwitch sx={{ py: 1.5 }} />
        <Stack sx={{ mt: 1 }}>
          {nav.map((item) => (
            <Typography
              key={item.href}
              component="a"
              href={item.href}
              onClick={() => setOpen(false)}
              sx={{ py: 1.75, fontSize: 18, fontWeight: 500, color: 'text.primary', textDecoration: 'none', borderBottom: '1px solid', borderColor: 'divider' }}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
        <Button href="#contact" variant="contained" size="large" onClick={() => setOpen(false)} sx={{ mt: 3 }}>
          {t.header.cta}
        </Button>
        <Button href={brand.phoneHref} variant="outlined" size="large" startIcon={<PhoneIcon />} sx={{ mt: 1.5 }}>
          {brand.phone}
        </Button>
      </Drawer>
    </AppBar>
  );
}
