import { Box } from '@mui/material';

// Без анімацій: на телефоні вміст має з’являтися одразу.
// Компонент лишається обгорткою, щоб не змінювати розмітку секцій.
export default function Reveal({ children, delay, y, sx, ...rest }) {
  return (
    <Box sx={sx} {...rest}>
      {children}
    </Box>
  );
}
