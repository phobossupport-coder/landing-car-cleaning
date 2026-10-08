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

export function Logo() {
  return (
    <Box component="a" href="#top" sx={{ display: 'flex', alignItems: 'baseline', gap: 1, color: 'inherit', textDecoration: 'none' }}>
      <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 22, letterSpacing: '0.3em' }}>
        {brand.name}
      </Typography>
      <Typography variant="overline" color="primary" sx={{ fontSize: 9, display: { xs: 'none', sm: 'block' } }}>
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
        bgcolor: scrolled ? 'rgba(11,11,13,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'divider' : 'transparent',
        transition: 'all .3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
          <Logo />
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {nav.map((item) => (
              <Typography
                key={item.href}
                component="a"
                href={item.href}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              href={brand.phoneHref}
              startIcon={<PhoneIcon />}
              color="inherit"
              sx={{ display: { xs: 'none', lg: 'inline-flex' }, textTransform: 'none', letterSpacing: 0 }}
            >
              {brand.phone}
            </Button>
            <Button href="#contact" variant="contained" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              Записатися
            </Button>
            <IconButton color="inherit" onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }} aria-label="Меню">
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: '100%', maxWidth: 360, p: 3 } } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Logo />
          <IconButton onClick={() => setOpen(false)} aria-label="Закрити">
            <CloseIcon />
          </IconButton>
        </Stack>
        <List>
          {nav.map((item) => (
            <ListItemButton key={item.href} component="a" href={item.href} onClick={() => setOpen(false)}>
              <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 20, fontFamily: 'Montserrat', fontWeight: 600 } }} />
            </ListItemButton>
          ))}
        </List>
        <Button href="#contact" variant="contained" size="large" onClick={() => setOpen(false)} sx={{ mt: 3 }}>
          Записатися
        </Button>
        <Button href={brand.phoneHref} startIcon={<PhoneIcon />} sx={{ mt: 2 }}>
          {brand.phone}
        </Button>
      </Drawer>
    </AppBar>
  );
}
