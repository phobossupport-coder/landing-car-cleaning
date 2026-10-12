# Stella Detailing Studio — Project Specification (current state)

Status: baseline as of 2026-10-12, commit `67265d9`.
This document describes what exists today. Planned changes live in `docs/superpowers/specs/`.

## 1. Purpose

Single-page marketing site for a premium car and yacht detailing studio in Oslo, Norway.
Goal: convince a visitor to book a free inspection via the contact form, phone, or WhatsApp.
Primary market is Norway; secondary audiences are English-, German-, Ukrainian- and Russian-speaking customers.

## 2. Tech stack

| Layer | Choice | Version (installed) |
|---|---|---|
| UI | React | 18.3 |
| Components / styling | MUI (Material UI) + Emotion | 7.3 |
| Icons | `@mui/icons-material` | 7.3 |
| Fonts | `@fontsource/inter`, `@fontsource/cormorant-garamond` (self-hosted) | 5.x |
| Build | Vite + `@vitejs/plugin-react` | 5.4 |
| Runtime | Node.js | 22 (`.nvmrc`), `engines.node >= 20` |

No router, no state library, no CSS files, no backend, no tests, no linter.

Scripts: `npm run dev` (port 5173), `npm run build` (outputs `dist/`), `npm run preview`.

## 3. Repository layout

```
index.html              HTML shell, lang="nb", Norwegian meta title/description, favicon
vite.config.js          base = process.env.BASE_PATH || '/'
public/favicon.svg
src/main.jsx            Root: ThemeProvider + CssBaseline + LanguageProvider + App; font imports
src/App.jsx             Section order (see §5)
src/theme.js            MUI theme: dark palette, gold accent, serif headings
src/data.js             Language-independent data: brand, images, brand lists, prices, metadata
src/i18n/index.jsx      LanguageProvider, language detection, useLang()
src/i18n/currency.js    formatPrice(nok, code)
src/i18n/{no,en,de,uk,ru}.js   One translation object per language
src/components/*.jsx    One file per section + shared helpers (Section, Reveal, LanguageSwitch)
.github/workflows/pages.yml    Deploy to GitHub Pages on push to main (active)
.github/workflows/deploy.yml   Deploy to AWS S3 + CloudFront (skipped until S3_BUCKET var exists)
DEPLOY.md, MARKET.md, README.md  Ukrainian-language docs (deploy guide, market analysis, readme)
```

`dist/` and `node_modules/` are git-ignored.

## 4. Design system (`src/theme.js`)

- Palette mode `dark`. Background `#0A0A0B`, paper `#111113`, text `#F4F1EA` / secondary `#9A9790`.
- Accent gold `#C9A86A` with gradient `#EAD6A3 → #C9A86A → #9C7F45` used for contained buttons.
- `shape.borderRadius: 0`; hairline dividers `rgba(255,255,255,0.09)`.
- Headings: Cormorant Garamond (serif). Body, overline, buttons: Inter. `responsiveFontSizes` with factor 2.4.
- Global CSS via `MuiCssBaseline`: smooth scroll, film-grain overlay (`body::after`), gold selection, custom scrollbar, reduced-motion kill-switch.
- Component overrides: Button (square, gradient contained, outlined hover gold), TextField default `standard` + `fullWidth`, Accordion transparent with bottom hairline, Chip square.
- Exports `gold`, `goldGradient`, `serif`, `sans`, `hairline` for use in components.

All styling is done with the MUI `sx` prop. Components use MUI Grid v2 (`size={{ xs, sm, md }}`).

## 5. Page structure (`src/App.jsx` order)

| # | Component | `id` | Content |
|---|---|---|---|
| 1 | `Header` | — | Fixed AppBar, blur on scroll, logo, desktop nav (≥ lg), `LanguageSwitch`, phone (≥ xl), "Book" CTA, mobile Drawer |
| 2 | `Hero` | `top` | Full-viewport hero: Unsplash background with slow zoom, eyebrow, two-line H1, text, two CTAs, 4 stats, two `Marquee` rows (car brands, yacht brands) |
| 3 | `Services` | `services` | 6 service cards in a 3-column bordered grid, icon, number, "from" price; 6th card links to `#yachts` |
| 4 | `Winter` | `winter` | Seasonal winter-prep programme: image with season label, 8 steps, price, duration, CTA |
| 5 | `BeforeAfter` | `results` | Text + pointer-driven before/after slider (currently same image with a filter on the "before" side) |
| 6 | `Yachts` | `yachts` | Full-bleed yacht background, intro, 4 points, price per foot, CTA |
| 7 | `Packages` | `packages` | 3 packages (Gloss / Correction / Concours), middle one featured and raised; features, duration, price, CTA |
| 8 | `Process` | `process` | 5 numbered steps with sticky image column |
| 9 | `Gallery` | `gallery` | 6 Unsplash images in an asymmetric 4-column grid, hover captions |
| 10 | `Reviews` | `reviews` | 3 testimonials with client car |
| 11 | `Faq` | `faq` | 6 accordion items, first expanded |
| 12 | `Contact` | `contact` | 4 trust points, contact details, form (name, phone, car, service select, message), success Snackbar |
| 13 | `Footer` | — | Logo, nav links, Instagram/WhatsApp buttons, copyright, `LanguageSwitch`, floating WhatsApp FAB |

Shared helpers:
- `Section` (padding, optional dark background, `scrollMarginTop: 72`), `SectionTitle`, `Eyebrow`.
- `Reveal` fades/slides children in on first intersection; disabled under `prefers-reduced-motion`.
- `LanguageSwitch` text buttons NO · EN · DE · UA · RU.

Navigation anchors are shared across languages in `data.navHrefs`: `#services #winter #yachts #packages #gallery #reviews #faq`.

## 6. Content model

### 6.1 Language-independent data (`src/data.js`)

- `brand`: name `STELLA`, tagline `Detailing Studio`, phone, `phoneHref`, email, address, Instagram, WhatsApp URL, `since: 2017`.
- `images`: 5 Unsplash URLs (hero, beforeAfter, studio, winter, yacht) via `img(id, width)` helper.
- `carBrands` (12), `yachtBrands` (10) for the marquee.
- `serviceMeta` (6): icon key, price in NOK, optional `perFoot`, optional `href`.
- `winterMeta`: price 5900 NOK, season `2026/27`.
- `packageMeta` (3): name, price in NOK, `featured` flag.
- `galleryMeta` (6): image URL, vehicle title.
- `reviewCars` (3).

Prices were derived from Oslo market prices (October 2026) minus 15 %; rationale is in a comment in `data.js`.

### 6.2 Translations (`src/i18n/<lang>.js`)

Each file exports one object with identical structure. Top-level keys:
`code currency label name meta nav header hero common services winter yachts results packages process gallery reviews trust faq contact footer`.

Arrays are matched by index with `data.js` metadata, so array lengths must be identical across all five languages:
`nav` (7), `hero.stats` (4), `services.items` (6), `winter.steps` (8), `yachts.points` (4), `results.points` (4),
`packages.items` (3), `process.steps` (5), `gallery.works` (6), `reviews.items` (3), `trust` (4), `faq.items` (6).

Language → currency: `no → NOK`, `en → EUR`, `de → EUR`, `uk → UAH`, `ru → UAH`.

### 6.3 Language detection (`src/i18n/index.jsx`)

Order: `localStorage['stella-lang']` → `?lang=` query parameter → `navigator.languages` (`nb`/`nn` map to `no`) → default `no`.
On change: persists to localStorage, sets `<html lang>` (`nb` for Norwegian), updates `document.title` and the description meta tag.

### 6.4 Currency (`src/i18n/currency.js`)

Base prices in NOK. Rates hard-coded (mid-market, October 2026): EUR 0.091, UAH 4.4.
Rounding step depends on currency and magnitude (`step`, ×10 above 10 000, min(step, 5) below 100).
Output format: thousands separated by a space, symbol after the number (`5 500 kr`, `500 €`).

## 7. Contact form (current behaviour)

`src/components/Contact.jsx` — `onSubmit` prevents default, resets the form, shows a success Snackbar.
Nothing is sent anywhere. Service select options are built from the winter programme, the three packages, the six services and a "need a consultation" option.

## 8. Build and deployment (current)

- `npm run build` → `dist/` with hashed assets and self-hosted woff/woff2 fonts.
- GitHub repository: `phobossupport-coder/landing-car-cleaning` (public), default branch `main`.
- GitHub Pages is live at `https://phobossupport-coder.github.io/landing-car-cleaning/`, deployed by `pages.yml` with `BASE_PATH=/landing-car-cleaning/`.
- `deploy.yml` (AWS) exists but is skipped: it requires repository variables `S3_BUCKET`, `AWS_REGION`, `CLOUDFRONT_DISTRIBUTION_ID` and secret `AWS_ROLE_ARN`.

## 9. Known placeholders and gaps

- Phone (`+380 67 000 00 00`), address, email, Instagram and WhatsApp links are placeholders.
- All photos are Unsplash stock; the before/after slider uses the same photo on both sides.
- Stats (1 200+ cars, 40+ yachts, 9 years), reviews and brand lists are illustrative.
- Form does not submit anywhere.
- No tests, no lint, no formatting config; no CI check before deploy.
- `index.html` meta tags are Norwegian only; other languages update them client-side, so crawlers see Norwegian.
- Exchange rates are static and must be updated by hand.

## 10. Non-functional characteristics

- Fully static; can be served from any object storage or CDN.
- Respects `prefers-reduced-motion`.
- Mobile layout: hamburger Drawer below `lg`, phone number hidden below `xl`, stacked grids.
- Single JS bundle (no code splitting); fonts loaded for Latin, Cyrillic, Greek and Vietnamese subsets.
