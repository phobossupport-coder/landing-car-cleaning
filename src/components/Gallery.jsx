import { Box, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import { gallery } from '../data';

// Асиметрична сітка: перша і остання роботи займають дві колонки.
const span = (i) => (i === 0 || i === gallery.length - 1 ? { md: 'span 2' } : {});

export default function Gallery() {
  return (
    <Section id="gallery">
      <SectionTitle overline="Портфоліо" title="Наші роботи" subtitle="Кілька авто, що нещодавно виїхали зі студії." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {gallery.map((g, i) => (
          <Box
            key={g.src}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: { xs: '4 / 3', md: i === 0 || i === gallery.length - 1 ? '2 / 1' : '1 / 1' },
              gridColumn: span(i),
              '&:hover img': { transform: 'scale(1.06)' },
              '&:hover .cap': { opacity: 1, transform: 'none' },
            }}
          >
            <Box component="img" src={g.src} alt={g.title} loading="lazy" sx={{ width: 1, height: 1, objectFit: 'cover', transition: 'transform .8s ease' }} />
            <Box
              className="cap"
              sx={{
                position: 'absolute',
                inset: 'auto 0 0 0',
                p: 3,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)',
                opacity: { xs: 1, md: 0 },
                transform: { md: 'translateY(10px)' },
                transition: 'all .4s',
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{g.title}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
