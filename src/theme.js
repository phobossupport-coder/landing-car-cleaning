import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Темна «шоурумна» палітра з шампань-золотим акцентом —
// типова для преміальних європейських детейлінг-студій.
const gold = '#C9A86A';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: gold, light: '#E2C998', dark: '#A88A4F', contrastText: '#0B0B0D' },
    secondary: { main: '#F5F5F7' },
    background: { default: '#0B0B0D', paper: '#141418' },
    text: { primary: '#F5F5F7', secondary: '#A1A1AA' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: '4rem', lineHeight: 1.05, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: '2.75rem', lineHeight: 1.15, letterSpacing: '-0.01em' },
    h3: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: '1.35rem' },
    h5: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, fontSize: '1.1rem' },
    overline: { fontWeight: 600, letterSpacing: '0.25em', fontSize: '0.75rem', lineHeight: 2 },
    button: { fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
    body1: { lineHeight: 1.7 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 2, padding: '12px 28px' },
        sizeLarge: { padding: '16px 36px' },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          '&:before': { display: 'none' },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
