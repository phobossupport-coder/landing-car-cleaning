import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Палітра «нічного шоуруму»: глибокий графіт, шампань-золото та тонкі лінії.
// Заголовки — класична антиква Cormorant Garamond, текст — Inter.
export const gold = '#C9A86A';
export const goldGradient = 'linear-gradient(135deg, #EAD6A3 0%, #C9A86A 45%, #9C7F45 100%)';
export const serif = '"Cormorant Garamond", "Times New Roman", serif';
export const sans = '"Inter", system-ui, sans-serif';
// Моноширинний — для службових підписів у стилі Valmora: навігація, лічильники, мітки.
export const mono = '"JetBrains Mono", ui-monospace, monospace';
export const hairline = 'rgba(255,255,255,0.09)';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: gold, light: '#E6CF9A', dark: '#9C7F45', contrastText: '#0A0A0B' },
    secondary: { main: '#F4F1EA' },
    background: { default: '#0A0A0B', paper: '#111113' },
    text: { primary: '#F4F1EA', secondary: '#9A9790' },
    divider: hairline,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: sans,
    h1: { fontFamily: serif, fontWeight: 500, fontSize: '5rem', lineHeight: 1.02, letterSpacing: '-0.01em' },
    h2: { fontFamily: serif, fontWeight: 500, fontSize: '3.25rem', lineHeight: 1.08, letterSpacing: '-0.01em' },
    h3: { fontFamily: serif, fontWeight: 500, fontSize: '2.1rem', lineHeight: 1.15 },
    h4: { fontFamily: serif, fontWeight: 600, fontSize: '1.6rem', lineHeight: 1.2 },
    h5: { fontFamily: serif, fontWeight: 600, fontSize: '1.3rem', lineHeight: 1.3 },
    overline: { fontFamily: sans, fontWeight: 500, letterSpacing: '0.32em', fontSize: '0.68rem', lineHeight: 2, textTransform: 'uppercase' },
    button: { fontFamily: sans, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.74rem' },
    body1: { lineHeight: 1.8, fontSize: '1rem' },
    body2: { lineHeight: 1.7 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: {
          backgroundColor: '#0A0A0B',
          '&::after': {
            // Ледь помітне «зерно» плівки — прибирає пласкість чорного фону.
            content: '""',
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            pointerEvents: 'none',
            opacity: 0.045,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          },
        },
        '::selection': { background: gold, color: '#0A0A0B' },
        '*::-webkit-scrollbar': { width: 8 },
        '*::-webkit-scrollbar-track': { background: '#0A0A0B' },
        '*::-webkit-scrollbar-thumb': { background: '#2A2A2E', borderRadius: 8 },
        '@media (prefers-reduced-motion: reduce)': { '*': { animation: 'none !important', transition: 'none !important' } },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 0, padding: '14px 30px', transition: 'all .35s ease' },
        sizeLarge: { padding: '18px 40px' },
        contained: {
          background: goldGradient,
          color: '#0A0A0B',
          '&:hover': { background: goldGradient, filter: 'brightness(1.08)', boxShadow: '0 12px 40px rgba(201,168,106,0.25)' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.22)',
          color: '#F4F1EA',
          '&:hover': { borderColor: gold, color: gold, background: 'rgba(201,168,106,0.06)' },
        },
        outlinedSecondary: {
          borderColor: 'rgba(255,255,255,0.22)',
          color: '#F4F1EA',
          '&:hover': { borderColor: gold, color: gold, background: 'rgba(201,168,106,0.06)' },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { variant: 'standard', fullWidth: true } },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': { borderBottomColor: 'rgba(255,255,255,0.18)' },
          '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
          '&:after': { borderBottomColor: gold },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { letterSpacing: '0.04em', '&.Mui-focused': { color: gold } } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          borderBottom: `1px solid ${hairline}`,
          '&:before': { display: 'none' },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme, { factor: 2.4 });
