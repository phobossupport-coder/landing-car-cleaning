import { Box, Stack, Typography } from '@mui/material';
import { serif } from '../theme';

// Бігова дорожка з марками. reverse — рух у протилежний бік, speed — секунди на цикл.
export default function Marquee({ items, label, reverse = false, speed = 60 }) {
  const row = [...items, ...items];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography
        variant="overline"
        sx={{
          flexShrink: 0,
          px: { xs: 2, md: 4 },
          py: 2.5,
          fontSize: '0.6rem',
          color: 'text.secondary',
          borderRight: '1px solid',
          borderColor: 'divider',
          minWidth: { xs: 96, md: 180 },
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
            '@keyframes marquee': { to: { transform: 'translateX(-50%)' } },
            '&:hover': { animationPlayState: 'paused' },
          }}
        >
          {row.map((p, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={{ xs: 3, md: 5 }} sx={{ pr: { xs: 3, md: 5 } }}>
              <Typography
                sx={{
                  fontFamily: serif,
                  fontWeight: 500,
                  fontSize: { xs: 18, md: 22 },
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(244,241,234,0.42)',
                  whiteSpace: 'nowrap',
                  transition: 'color .3s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {p}
              </Typography>
              <Box sx={{ width: 5, height: 5, transform: 'rotate(45deg)', bgcolor: 'primary.main', opacity: 0.6 }} />
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
