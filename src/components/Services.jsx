import { Box, Grid, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import AirlineSeatReclineExtraOutlinedIcon from '@mui/icons-material/AirlineSeatReclineExtraOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Section, { SectionTitle } from './Section';
import { services } from '../data';

const icons = {
  polish: AutoAwesomeIcon,
  shield: ShieldOutlinedIcon,
  layers: LayersOutlinedIcon,
  seat: AirlineSeatReclineExtraOutlinedIcon,
  wash: WaterDropOutlinedIcon,
  light: LightModeOutlinedIcon,
};

export default function Services() {
  return (
    <Section id="services">
      <SectionTitle
        overline="Послуги"
        title="Повний цикл догляду за кузовом"
        subtitle="Від делікатної мийки до багатоетапної корекції лаку та довготривалого захисту."
      />
      <Grid container spacing={0} sx={{ borderTop: '1px solid', borderLeft: '1px solid', borderColor: 'divider' }}>
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <Grid
              key={s.title}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{
                p: { xs: 4, md: 5 },
                borderRight: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                transition: 'background .3s',
                '&:hover': { bgcolor: 'background.paper' },
                '&:hover .num': { color: 'primary.main' },
              }}
            >
              <Typography className="num" sx={{ position: 'absolute', top: 24, right: 28, fontFamily: 'Montserrat', fontWeight: 700, color: 'rgba(255,255,255,0.12)', transition: 'color .3s' }}>
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Icon sx={{ fontSize: 36, color: 'primary.main', mb: 3 }} />
              <Typography variant="h4" component="h3" gutterBottom>
                {s.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {s.text}
              </Typography>
              <Box sx={{ fontWeight: 600, color: 'primary.light' }}>{s.price}</Box>
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
}
