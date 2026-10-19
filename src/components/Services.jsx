import { Box, Stack, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AirlineSeatReclineExtraOutlinedIcon from '@mui/icons-material/AirlineSeatReclineExtraOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import AnchorOutlinedIcon from '@mui/icons-material/AnchorOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Section, { SectionTitle } from './Section';
import { serviceMeta } from '../data';
import { useLang } from '../i18n';
import { formatPrice } from '../i18n/currency';

const icons = {
  polish: AutoAwesomeOutlinedIcon,
  shield: ShieldOutlinedIcon,
  seat: AirlineSeatReclineExtraOutlinedIcon,
  wash: WaterDropOutlinedIcon,
  light: LightModeOutlinedIcon,
  anchor: AnchorOutlinedIcon,
};

export default function Services() {
  const { t } = useLang();
  const services = t.services.items.map((s, i) => ({ ...s, ...serviceMeta[i] }));
  return (
    <Section id="services">
      <SectionTitle title={t.services.title} subtitle={t.services.subtitle} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {services.map((s) => {
          const Icon = icons[s.icon];
          return (
            <Box
              key={s.title}
              component={s.href ? 'a' : 'div'}
              href={s.href}
              sx={{ display: 'flex', flexDirection: 'column', p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, color: 'inherit', textDecoration: 'none', '&:active': s.href && { bgcolor: 'action.hover' } }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Icon sx={{ fontSize: 26, color: 'primary.main' }} />
                <Typography variant="h4" component="h3">
                  {s.title}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 2, flex: 1 }}>
                {s.text}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  <Box component="span" sx={{ fontWeight: 500, fontSize: 14, color: 'text.secondary', mr: 0.75 }}>
                    {t.common.from}
                  </Box>
                  {formatPrice(s.price, t.currency)}
                  {s.perFoot && (
                    <Box component="span" sx={{ fontWeight: 500, fontSize: 14, color: 'text.secondary', ml: 0.75 }}>
                      / {t.common.perFoot}
                    </Box>
                  )}
                </Typography>
                {s.href && <ChevronRightIcon sx={{ color: 'text.secondary' }} />}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
