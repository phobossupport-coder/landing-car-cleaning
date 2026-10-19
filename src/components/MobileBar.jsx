import { Box, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { brand } from '../data';
import { useLang } from '../i18n';

// Постійна панель дій унизу екрана телефону: подзвонити, написати, записатися.
export default function MobileBar() {
  const { t } = useLang();
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        gap: 1,
        p: 1,
        pb: 'calc(8px + env(safe-area-inset-bottom))',
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Button href={brand.phoneHref} variant="outlined" aria-label={t.hero.cta2} sx={{ flex: 1, minWidth: 0, px: 1 }} startIcon={<PhoneIcon />}>
        {t.hero.cta2}
      </Button>
      <Button href={brand.whatsapp} target="_blank" rel="noopener" variant="outlined" aria-label={t.footer.whatsapp} sx={{ flex: 0, minWidth: 52, px: 0, '& .MuiButton-icon': { m: 0 } }} startIcon={<WhatsAppIcon />} />
      <Button href="#contact" variant="contained" sx={{ flex: 1.2, minWidth: 0, px: 1 }} startIcon={<EventAvailableIcon />}>
        {t.header.cta}
      </Button>
    </Box>
  );
}
