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
import { brand, nav } from '../data';
import { serif } from '../theme';

export function Logo() {
  return (
    <Box component="a" href="#top" sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, color: 'inherit', textDecoration: 'none' }}>
      <Typography sx={{ fontFamily: serif, fontWeight: 600, fontSize: 26, letterSpacing: '0.28em', lineHeight: 1 }}>
        {brand.name}
      </Typography>
      <Typography variant="overline" color="primary" sx={{ fontSize: 8.5, display: { xs: 'none', sm: 'block' }, lineHeight: 1 }}>
        {brand.tagline}
      </Typography>
    </Box>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 40 });

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'rgba(10,10,11,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'divider' : 'transparent',
        transition: 'all .4s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 76, justifyContent: 'space-between' }}>
          <Logo />
          <Stack direction="row" spacing={3.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {nav.map((item) => (
              <Typography
                key={item.href}
                component="a"
                href={item.href}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  transition: 'color .3s',
                  '&::after': { content: '""', position: 'absolute', left: 0, bottom: -6, width: 0, height: '1px', bgcolor: 'primary.main', transition: 'width .35s' },
                  '&:hover': { color: 'text.primary' },
                  '&:hover::after': { width: '100%' },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              href={brand.phoneHref}
              startIcon={<PhoneIcon sx={{ fontSize: 16 }} />}
              color="inherit"
              sx={{ display: { xs: 'none', xl: 'inline-flex' }, textTransform: 'none', letterSpacing: 0, fontSize: 14, px: 1.5, whiteSpace: 'nowrap' }}
            >
              {brand.phone}
            </Button>
            <Button href="#contact" variant="outlined" sx={{ display: { xs: 'none', sm: 'inline-flex' }, py: 1.25, px: 3 }}>
              Записатися
            </Button>
            <IconButton color="inherit" onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }} aria-label="Меню">
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: '100%', maxWidth: 380, p: 3, bgcolor: '#0A0A0B' } } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Logo />
          <IconButton onClick={() => setOpen(false)} aria-label="Закрити">
            <CloseIcon />
          </IconButton>
        </Stack>
        <List>
          {nav.map((item) => (
            <ListItemButton key={item.href} component="a" href={item.href} onClick={() => setOpen(false)} sx={{ px: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 26, fontFamily: serif, fontWeight: 500 } }} />
            </ListItemButton>
          ))}
        </List>
        <Button href="#contact" variant="contained" size="large" onClick={() => setOpen(false)} sx={{ mt: 3 }}>
          Записатися
        </Button>
        <Button href={brand.phoneHref} startIcon={<PhoneIcon />} sx={{ mt: 2, textTransform: 'none', letterSpacing: 0 }}>
          {brand.phone}
        </Button>
      </Drawer>
    </AppBar>
  );
}
