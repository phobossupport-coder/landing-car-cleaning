# Stella Detailing Studio — лендінг детейлінг-студії

React 18 + MUI 7 + Vite. Потрібен Node.js 20+ (див. `.nvmrc`).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # збірка в dist/
npm test        # тести (Vitest)
```

- Тексти всіма мовами: `src/i18n/<мова>.js`; ціни, контакти, кейси портфоліо: `src/data.js`
- Тема (кольори, шрифти): `src/theme.js`
- Підключення GitHub і AWS, деплой: [DEPLOY.md](DEPLOY.md)
- Аналіз європейського ринку: [MARKET.md](MARKET.md)

## Медіа (hero і портфоліо)

Оригінали відео й фото в репозиторій не потрапляють — лише оброблені файли в `public/`.

```bash
npm run hero:frames -- "<відео.mp4>"            # кадри hero → public/hero/
npm run portfolio:photos -- "<папка з фото>"    # фото портфоліо → public/portfolio/
```

- Таймкоди й обрізка зупинок hero — таблиця `SHOTS` у `scripts/hero-frames.mjs`; кадрування, затемнення й розмиття номерів — `PHOTOS` у `scripts/portfolio-photos.mjs`.
- Скрипт hero друкує шлях до контактного аркуша: перед комітом перегляньте всі кадри. На фото й відео не має бути нічого від DD73 (вивіска, ворота з номерами, їх відображення).
- `npm test` перевіряє бюджет: кадри hero ≤ 2,5 МБ, фото портфоліо ≤ 160 КБ.
