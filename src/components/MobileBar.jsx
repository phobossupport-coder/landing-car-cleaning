import { useEffect, useState } from 'react';
import { Box, Button, Slide } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { brand } from '../data';
import { useLang } from '../i18n';
import { useWhatsappLink } from '../booking';

// Липка панель на телефоні: з'являється, коли hero повністю прокручено, і ховається, коли видно форму або футер.
export default function MobileBar() {
  const { t } = useLang();
  const whatsapp = useWhatsappLink();
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById('contact'), document.querySelector('footer')].filter(Boolean);
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setFormVisible(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));
    const hero = document.getElementById('top');
    const heroObserver = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting));
    if (hero) heroObserver.observe(hero);
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  const item = {
    flex: 1,
    minWidth: 0,
    px: 1,
    py: 1.75,
    borderRadius: 0,
    fontSize: 11.5,
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
    '& .MuiButton-startIcon': { mr: 0.75 },
  };
  return (
    <Slide direction="up" in={!heroVisible && !formVisible}>
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1100,
          pb: 'env(safe-area-inset-bottom)',
          bgcolor: 'rgba(10,10,11,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button href={brand.phoneHref} color="inherit" startIcon={<PhoneIcon sx={{ fontSize: 18 }} />} sx={item}>
          {t.bar.call}
        </Button>
        <Button
          href={whatsapp}
          target="_blank"
          rel="noopener"
          color="inherit"
          startIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
          sx={{ ...item, borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider' }}
        >
          {t.bar.whatsapp}
        </Button>
        <Button href="#contact" variant="contained" sx={item}>
          {t.bar.book}
        </Button>
      </Box>
    </Slide>
  );
}
