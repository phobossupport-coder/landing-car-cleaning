import { createTheme } from '@mui/material/styles';

// Світла практична тема: білий фон, темний текст, один синій акцент для кнопок і цін.
// Один шрифт — Inter (є латиниця з норвезькими літерами та кирилиця).
export const accent = '#1B5FD9';
export const ink = '#14181F';
export const muted = '#566070';
export const line = '#E3E6EB';
export const surface = '#F5F6F8';
export const sans = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: accent, dark: '#1448A8', contrastText: '#FFFFFF' },
    secondary: { main: ink },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    text: { primary: ink, secondary: muted },
    divider: line,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: sans,
    h1: { fontWeight: 700, fontSize: '2.125rem', lineHeight: 1.15, letterSpacing: '-0.02em', '@media (min-width:900px)': { fontSize: '3.5rem' } },
    h2: { fontWeight: 700, fontSize: '1.65rem', lineHeight: 1.2, letterSpacing: '-0.015em', '@media (min-width:900px)': { fontSize: '2.4rem' } },
    h3: { fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.25 },
    h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.3 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 },
    button: { fontWeight: 600, fontSize: '1rem', textTransform: 'none', letterSpacing: 0 },
    body1: { lineHeight: 1.6, fontSize: '1rem' },
    body2: { lineHeight: 1.55, fontSize: '0.9375rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth', WebkitTextSizeAdjust: '100%' },
        body: { backgroundColor: '#FFFFFF', paddingBottom: 'calc(76px + env(safe-area-inset-bottom))', '@media (min-width:900px)': { paddingBottom: 0 } },
        '@media (prefers-reduced-motion: reduce)': { '*': { animation: 'none !important', transition: 'none !important', scrollBehavior: 'auto !important' } },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 48, padding: '10px 22px' },
        sizeLarge: { minHeight: 52, padding: '12px 26px', fontSize: '1.0625rem' },
        outlined: { borderColor: '#C9CED6', color: ink, '&:hover': { borderColor: ink, background: surface } },
      },
    },
    MuiIconButton: { styleOverrides: { root: { width: 48, height: 48 } } },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: '#FFFFFF' }, input: { fontSize: '1rem' } } },
    MuiAccordion: {
      styleOverrides: {
        root: { background: 'transparent', borderBottom: `1px solid ${line}`, '&:before': { display: 'none' } },
      },
    },
  },
});

export default theme;
