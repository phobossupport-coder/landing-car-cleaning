import { Box, Grid, Stack, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AirlineSeatReclineExtraOutlinedIcon from '@mui/icons-material/AirlineSeatReclineExtraOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import AnchorOutlinedIcon from '@mui/icons-material/AnchorOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Section, { SectionTitle } from './Section';
import Reveal from './Reveal';
import { serviceMeta } from '../data';
import { serif } from '../theme';
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
  const cur = t.currency;
  const services = t.services.items.map((s, i) => ({ ...s, ...serviceMeta[i] }));
  return (
    <Section id="services">
      <SectionTitle
        overline={t.services.overline}
        title={t.services.title}
        subtitle={t.services.subtitle}
      />
      <Grid container spacing={0} sx={{ borderTop: '1px solid', borderLeft: '1px solid', borderColor: 'divider' }}>
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          const isLink = Boolean(s.href);
          return (
            <Grid key={s.title} size={{ xs: 12, sm: 6, md: 4 }} sx={{ borderRight: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Reveal delay={(i % 3) * 120} sx={{ height: 1 }}>
                <Box
                  component={isLink ? 'a' : 'div'}
                  href={s.href}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 1,
                    minHeight: { md: 340 },
                    p: { xs: 4, md: 5 },
                    position: 'relative',
                    color: 'inherit',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    transition: 'background .4s',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '1px',
                      width: 0,
                      background: 'linear-gradient(90deg, #EAD6A3, #C9A86A, transparent)',
                      transition: 'width .6s cubic-bezier(.2,.7,.2,1)',
                    },
                    '&:hover': { bgcolor: 'background.paper' },
                    '&:hover::before': { width: '100%' },
                    '&:hover .num': { color: 'primary.main', opacity: 1 },
                    '&:hover .icon': { color: 'primary.light', transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography
                    className="num"
                    sx={{ position: 'absolute', top: 28, right: 32, fontFamily: serif, fontSize: 20, color: 'text.secondary', opacity: 0.5, transition: 'all .4s' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Icon className="icon" sx={{ fontSize: 30, color: 'primary.main', mb: 3.5, transition: 'all .4s' }} />
                  <Typography variant="h4" component="h3" sx={{ mb: 1.5 }}>
                    {s.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 4, flex: 1 }}>
                    {s.text}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                    <Typography sx={{ fontFamily: serif, fontSize: 22, color: 'primary.light' }}>
                      {!s.price ? (
                        <Box component="span" sx={{ fontStyle: 'italic' }}>{t.common.onRequest}</Box>
                      ) : (
                        <>
                          <Box component="span" sx={{ fontFamily: 'Inter', fontSize: 12, color: 'text.secondary', mr: 1, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.common.from}</Box>
                          {formatPrice(s.price, cur)}
                          {s.perFoot && (
                            <Box component="span" sx={{ fontFamily: 'Inter', fontSize: 12, color: 'text.secondary', ml: 1 }}>/ {t.common.perFoot}</Box>
                          )}
                        </>
                      )}
                    </Typography>
                    {isLink && <ArrowOutwardIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                  </Stack>
                </Box>
              </Reveal>
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
}
