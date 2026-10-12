import { Box, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import Reveal from './Reveal';
import { gallery } from '../data';
import { serif } from '../theme';

// Асиметрична сітка: перша і остання роботи займають дві колонки.
const wide = (i) => i === 0 || i === gallery.length - 1;

export default function Gallery() {
  return (
    <Section id="gallery">
      <SectionTitle overline="Портфоліо" title="Нещодавно виїхали зі студії" subtitle="Кожна робота — із фотозвітом і замірами до та після." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        {gallery.map((g, i) => (
          <Reveal key={g.src} delay={(i % 4) * 90} sx={{ gridColumn: wide(i) ? { md: 'span 2' } : 'auto' }}>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: { xs: '4 / 3', md: wide(i) ? '2 / 1' : '1 / 1' },
                '&:hover img': { transform: 'scale(1.05)', filter: 'saturate(1)' },
                '&:hover .cap': { opacity: 1, transform: 'none' },
              }}
            >
              <Box component="img" src={g.src} alt={`${g.title} — ${g.work}`} loading="lazy" sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', transition: 'transform 1.2s cubic-bezier(.2,.7,.2,1), filter .8s', filter: 'saturate(0.85)' }} />
              <Box
                className="cap"
                sx={{
                  position: 'absolute',
                  inset: 'auto 0 0 0',
                  p: 3,
                  background: 'linear-gradient(0deg, rgba(10,10,11,0.9), transparent)',
                  opacity: { xs: 1, md: 0 },
                  transform: { md: 'translateY(12px)' },
                  transition: 'all .5s',
                }}
              >
                <Typography sx={{ fontFamily: serif, fontSize: 22, lineHeight: 1.1 }}>{g.title}</Typography>
                <Typography variant="overline" color="primary" sx={{ fontSize: '0.6rem' }}>
                  {g.work}
                </Typography>
              </Box>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Section>
  );
}
