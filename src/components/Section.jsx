import { Box, Container, Typography } from '@mui/material';
import { surface } from '../theme';

export function SectionTitle({ title, subtitle, sx }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 5 }, maxWidth: 680, ...sx }}>
      <Typography variant="h2" component="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
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
      sx={{ py: { xs: 6, md: 10 }, bgcolor: dark ? surface : 'background.default', scrollMarginTop: { xs: 56, md: 72 }, ...sx }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
