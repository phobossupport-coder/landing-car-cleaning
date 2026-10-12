import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import no from './no';
import en from './en';
import de from './de';
import uk from './uk';
import ru from './ru';

// Порядок = порядок у перемикачі. Перша мова — за замовчуванням (основні клієнти — Норвегія).
export const languages = [no, en, de, uk, ru];
const byCode = Object.fromEntries(languages.map((l) => [l.code, l]));
const STORAGE_KEY = 'stella-lang';

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && byCode[saved]) return saved;
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && byCode[fromUrl]) return fromUrl;
    for (const tag of navigator.languages || [navigator.language]) {
      const base = tag.toLowerCase().split('-')[0];
      if (base === 'nb' || base === 'nn') return 'no';
      if (byCode[base]) return base;
    }
  } catch {
    /* localStorage може бути недоступним */
  }
  return languages[0].code;
}

const LanguageContext = createContext({ lang: 'no', setLang: () => {}, t: no });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detect);
  const t = byCode[lang] || no;

  const setLang = (code) => {
    if (!byCode[code]) return;
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'no' ? 'nb' : lang;
    document.title = t.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
