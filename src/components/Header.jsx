import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import { brand, navHrefs } from '../data';
import { mono, serif } from '../theme';
import { useLang } from '../i18n';
import LanguageSwitch from './LanguageSwitch';

// Логотип і дрібний моно-підпис у два рядки, як у Valmora.
export function Logo() {
  const { t } = useLang();
  return (
    <Box component="a" href="#top" sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'inherit', textDecoration: 'none' }}>
      <Typography sx={{ fontFamily: serif, fontWeight: 600, fontSize: 26, letterSpacing: '0.28em', lineHeight: 1 }}>{brand.name}</Typography>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, pl: 2, borderLeft: '1px solid', borderColor: 'divider' }}>
        {t.header.tagline.map((line) => (
          <Typography
            key={line}
            sx={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.16em', lineHeight: 1.6, color: 'text.secondary', whiteSpace: 'nowrap' }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 40 });
  const { t } = useLang();
  const nav = t.nav.map((label, i) => ({ label, href: navHrefs[i] }));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'rgba(10,10,11,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'all .4s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 76, justifyContent: 'space-between', gap: 3 }}>
          <Logo />
          <Stack direction="row" spacing={{ lg: 2.5, xl: 3 }} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            {nav.map((item) => (
              <Typography
                key={item.href}
                component="a"
                href={item.href}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontFamily: mono,
                  fontSize: 10.5,
                  fontWeight: 400,
                  letterSpacing: '0.22em',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  position: 'relative',
                  transition: 'color .3s',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -6,
                    width: 0,
                    height: '1px',
                    bgcolor: 'primary.main',
                    transition: 'width .35s',
                  },
                  '&:hover': { color: 'text.primary' },
                  '&:hover::after': { width: '100%' },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="center">
            <LanguageSwitch sx={{ display: { xs: 'none', lg: 'flex' }, pl: 2, ml: 1, borderLeft: '1px solid', borderColor: 'divider' }} />
            <Button
              href={brand.phoneHref}
              startIcon={<PhoneIcon sx={{ fontSize: 16 }} />}
              color="inherit"
              sx={{ display: { xs: 'none', xl: 'inline-flex' }, textTransform: 'none', letterSpacing: 0, fontSize: 14, px: 1.5, whiteSpace: 'nowrap' }}
            >
              {brand.phone}
            </Button>
            {/* Золоте текстове посилання замість кнопки — як «Private viewing» у Valmora */}
            <Typography
              component="a"
              href="#contact"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontFamily: mono,
                fontSize: 10.5,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'primary.main',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                pb: 0.5,
                borderBottom: '1px solid',
                borderColor: 'rgba(201,168,106,0.5)',
                '&:hover': { color: 'primary.light', borderColor: 'primary.light' },
              }}
            >
              {t.header.cta}
            </Typography>
            <Button
              color="inherit"
              onClick={() => setOpen(true)}
              endIcon={<MenuIcon />}
              aria-label={t.header.menu}
              sx={{ display: { lg: 'none' }, fontFamily: mono, fontSize: 10.5, letterSpacing: '0.22em', minWidth: 0, px: 1 }}
            >
              {t.header.menu}
            </Button>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: '100%', maxWidth: 380, p: 3, bgcolor: '#0A0A0B' } } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Logo />
          <IconButton onClick={() => setOpen(false)} aria-label={t.header.close}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <LanguageSwitch size="large" sx={{ py: 2, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }} />
        <List>
          {nav.map((item) => (
            <ListItemButton
              key={item.href}
              component="a"
              href={item.href}
              onClick={() => setOpen(false)}
              sx={{ px: 1, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 26, fontFamily: serif, fontWeight: 500 } }} />
            </ListItemButton>
          ))}
        </List>
        <Button href="#contact" variant="contained" size="large" onClick={() => setOpen(false)} sx={{ mt: 3 }}>
          {t.header.cta}
        </Button>
        <Button href={brand.phoneHref} startIcon={<PhoneIcon />} sx={{ mt: 2, textTransform: 'none', letterSpacing: 0 }}>
          {brand.phone}
        </Button>
      </Drawer>
    </AppBar>
  );
}
