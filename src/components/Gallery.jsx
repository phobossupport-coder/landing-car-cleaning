import { Box, Typography } from '@mui/material';
import Section, { SectionTitle } from './Section';
import { galleryMeta } from '../data';
import { useLang } from '../i18n';

export default function Gallery() {
  const { t } = useLang();
  const gallery = galleryMeta.map((g, i) => ({ ...g, work: t.gallery.works[i] }));
  return (
    <Section id="gallery" dark>
      <SectionTitle title={t.gallery.title} subtitle={t.gallery.subtitle} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 1, md: 2 } }}>
        {gallery.map((g) => (
          <Box key={g.src}>
            <Box component="img" src={g.src} alt={`${g.title} — ${g.work}`} loading="lazy" sx={{ width: 1, aspectRatio: '4 / 3', objectFit: 'cover', display: 'block', borderRadius: 2 }} />
            <Typography sx={{ fontWeight: 600, fontSize: 14, mt: 0.75 }}>{g.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {g.work}
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
