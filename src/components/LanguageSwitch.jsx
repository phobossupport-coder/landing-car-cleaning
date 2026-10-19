import { ButtonBase, Stack } from '@mui/material';
import { languages, useLang } from '../i18n';

// Перемикач мов: NO EN DE UA RU. Кнопки мають зону дотику 44 px.
export default function LanguageSwitch({ sx }) {
  const { lang, setLang, t } = useLang();
  return (
    <Stack component="nav" aria-label={t.header.language} direction="row" spacing={0.5} sx={sx}>
      {languages.map((l) => {
        const active = l.code === lang;
        return (
          <ButtonBase
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-current={active ? 'true' : undefined}
            aria-label={l.name}
            sx={{
              minWidth: 44,
              minHeight: 44,
              px: 1,
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 600,
              color: active ? 'primary.contrastText' : 'text.secondary',
              bgcolor: active ? 'primary.main' : 'transparent',
              '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' },
            }}
          >
            {l.label}
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
