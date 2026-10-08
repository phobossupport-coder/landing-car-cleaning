import { Box, Container, Typography } from '@mui/material';

export function SectionTitle({ overline, title, subtitle, align = 'center' }) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 5, md: 8 }, maxWidth: align === 'center' ? 720 : 'none', mx: align === 'center' ? 'auto' : 0 }}>
      <Typography variant="overline" color="primary" component="p">
        {overline}
      </Typography>
      <Typography variant="h2" component="h2" sx={{ mt: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.1rem' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default function Section({ id, children, sx, dark }) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: dark ? '#08080A' : 'background.default',
        scrollMarginTop: 72,
        ...sx,
      }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
