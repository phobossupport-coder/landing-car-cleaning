import { Box, Button, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AirlineSeatReclineExtraOutlinedIcon from '@mui/icons-material/AirlineSeatReclineExtraOutlined';
import UmbrellaOutlinedIcon from '@mui/icons-material/UmbrellaOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Section, { SectionTitle } from './Section';
import { services } from '../data';

const icons = {
  polish: AutoAwesomeIcon,
  shield: ShieldOutlinedIcon,
  seat: AirlineSeatReclineExtraOutlinedIcon,
  rain: UmbrellaOutlinedIcon,
  wax: WaterDropOutlinedIcon,
};

export default function Services() {
  return (
    <Section id="services">
      <SectionTitle
        overline="Послуги"
        title="П’ять послуг — один бездоганний результат"
        subtitle="Від відновлення лаку до довготривалого захисту кузова, скла й салону."
      />
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <Box
              key={s.title}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '90px 1.2fr 1fr' },
                gap: { xs: 2, md: 6 },
                py: { xs: 5, md: 7 },
                px: { md: 2 },
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: 'background .3s',
                '&:hover': { bgcolor: 'background.paper' },
                '&:hover .num': { color: 'primary.main' },
              }}
            >
              <Typography className="num" sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: { xs: 32, md: 48 }, lineHeight: 1, color: 'rgba(255,255,255,0.12)', transition: 'color .3s' }}>
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Icon sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h3" component="h3">
                    {s.title}
                  </Typography>
                </Stack>
                <Typography color="text.secondary">{s.text}</Typography>
                {s.details && (
                  <Stack spacing={1} mt={2.5}>
                    {s.details.map((d) => (
                      <Stack key={d} direction="row" spacing={1.5}>
                        <CheckIcon fontSize="small" color="primary" sx={{ mt: 0.4 }} />
                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                          {d}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
              <Stack justifyContent="space-between" alignItems="flex-start" spacing={3}>
                <Box sx={{ borderLeft: '2px solid', borderColor: 'primary.main', pl: 3, py: 0.5 }}>
                  <Typography variant="overline" color="primary" component="p">
                    {s.fact.label}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 }}>{s.fact.value}</Typography>
                </Box>
                <Button href="#contact" variant="outlined" color="secondary">
                  Записатися
                </Button>
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
