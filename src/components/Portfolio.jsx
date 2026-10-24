import { useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Section, { SectionTitle } from './Section';
import Reveal from './Reveal';
import { portfolioCases, portfolioSrc } from '../data';
import { mono, serif } from '../theme';
import { useLang } from '../i18n';

const arrow = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: 10,
  transform: 'translateY(-50%)',
  bgcolor: 'rgba(10,10,11,0.6)',
  border: '1px solid rgba(201,168,106,0.4)',
  color: 'text.primary',
  opacity: 0,
  transition: 'opacity .3s',
  '&:hover': { bgcolor: 'rgba(10,10,11,0.85)', color: 'primary.main' },
  '&:focus-visible': { opacity: 1 },
  display: { xs: 'none', md: 'inline-flex' },
});

// Кейс: обкладинка + деталі в каруселі на CSS scroll-snap (свайп на телефоні, стрілки на комп'ютері).
function CaseCard({ item, p }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const total = item.photos.length;
  const go = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth, behavior: 'smooth' });
  const onScroll = () => {
    const el = track.current;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <Box>
      <Box sx={{ position: 'relative', '&:hover .arrow': { opacity: 1 } }}>
        <Box
          ref={track}
          onScroll={onScroll}
          sx={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, aspectRatio: '4 / 5', bgcolor: 'background.paper' }}
        >
          {item.photos.map((n, i) => (
            <Box
              key={n}
              component="img"
              src={portfolioSrc(item.id, n, 640)}
              srcSet={`${portfolioSrc(item.id, n, 640)} 640w, ${portfolioSrc(item.id, n, 1080)} 1080w`}
              sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
              alt={`${item.name} — ${p.work} (${i + 1}/${total})`}
              loading="lazy"
              draggable={false}
              sx={{ flex: '0 0 100%', width: 1, height: 1, objectFit: 'cover', scrollSnapAlign: 'start', display: 'block' }}
            />
          ))}
        </Box>
        <Typography sx={{ position: 'absolute', top: 14, right: 14, fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', color: 'text.primary', bgcolor: 'rgba(10,10,11,0.55)', px: 1.25, py: 0.5 }}>
          {index + 1} / {total}
        </Typography>
        {index > 0 && (
          <IconButton className="arrow" aria-label={p.prev} onClick={() => go(-1)} sx={arrow('left')}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        {index < total - 1 && (
          <IconButton className="arrow" aria-label={p.next} onClick={() => go(1)} sx={arrow('right')}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ pt: 2.5, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
        <Typography sx={{ fontFamily: serif, fontSize: 24, lineHeight: 1.15 }}>{item.name}</Typography>
        <Typography sx={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'primary.main', mt: 0.75 }}>{p.work}</Typography>
      </Box>
    </Box>
  );
}

export default function Portfolio() {
  const { t } = useLang();
  const p = t.portfolio;
  return (
    <Section id="gallery">
      <SectionTitle overline={p.overline} title={p.title} subtitle={p.subtitle} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 5, md: 4 } }}>
        {portfolioCases.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 100}>
            <CaseCard item={item} p={p} />
          </Reveal>
        ))}
      </Box>
    </Section>
  );
}
