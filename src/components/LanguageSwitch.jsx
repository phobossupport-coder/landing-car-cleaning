import { Box, ButtonBase, Stack } from '@mui/material';
import { languages, useLang } from '../i18n';

// Текстовий перемикач мов: NO · EN · DE · UA · RU. Активна — золотом.
export default function LanguageSwitch({ size = 'small', sx }) {
  const { lang, setLang, t } = useLang();
  const big = size === 'large';
  return (
    <Stack component="nav" aria-label={t.header.language} direction="row" alignItems="center" sx={{ ...sx }}>
      {languages.map((l, i) => (
        <Stack key={l.code} direction="row" alignItems="center">
          {i > 0 && <Box sx={{ width: 3, height: 3, transform: 'rotate(45deg)', bgcolor: 'rgba(255,255,255,0.22)', mx: big ? 1.5 : 0.4 }} />}
          <ButtonBase
            onClick={() => setLang(l.code)}
            aria-current={l.code === lang ? 'true' : undefined}
            aria-label={l.name}
            sx={{
              fontFamily: 'Inter',
              fontSize: big ? 14 : 11,
              fontWeight: 500,
              letterSpacing: '0.16em',
              px: 0.4,
              py: 0.5,
              color: l.code === lang ? 'primary.main' : 'text.secondary',
              position: 'relative',
              transition: 'color .3s',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 4,
                right: 4,
                bottom: 0,
                height: '1px',
                bgcolor: 'primary.main',
                transform: l.code === lang ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform .35s',
              },
              '&:hover': { color: l.code === lang ? 'primary.main' : 'text.primary' },
            }}
          >
            {l.label}
          </ButtonBase>
        </Stack>
      ))}
    </Stack>
  );
}
