import { Box, Container, Typography } from '@mui/material';
import Reveal from './Reveal';

// Надзаголовок із золотою рискою — єдиний стиль для всіх секцій.
export function Eyebrow({ children, align = 'center', sx }) {
  return (
    <Typography
      variant="overline"
      color="primary"
      component="p"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: 2,
        '&::before': { content: '""', width: 36, height: '1px', bgcolor: 'primary.main', opacity: 0.8 },
        ...(align === 'center' && { '&::after': { content: '""', width: 36, height: '1px', bgcolor: 'primary.main', opacity: 0.8 } }),
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

export function SectionTitle({ overline, title, subtitle, align = 'center' }) {
  return (
    <Reveal sx={{ textAlign: align, mb: { xs: 6, md: 9 }, maxWidth: align === 'center' ? 760 : 'none', mx: align === 'center' ? 'auto' : 0 }}>
      <Eyebrow align={align}>{overline}</Eyebrow>
      <Typography variant="h2" component="h2" sx={{ mt: 2 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 2.5, fontSize: '1.08rem', maxWidth: 620, mx: align === 'center' ? 'auto' : 0 }}>
          {subtitle}
        </Typography>
      )}
    </Reveal>
  );
}

export default function Section({ id, children, sx, dark, disableContainer }) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        position: 'relative',
        py: { xs: 11, md: 16 },
        bgcolor: dark ? '#070708' : 'background.default',
        scrollMarginTop: 72,
        ...sx,
      }}
    >
      {disableContainer ? children : <Container maxWidth="lg">{children}</Container>}
    </Box>
  );
}
