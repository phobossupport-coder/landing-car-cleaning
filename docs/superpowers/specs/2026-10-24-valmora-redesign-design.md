# Valmora-style redesign — Design

Date: 2026-10-24
Status: approved in brainstorming, awaiting implementation plan
Branch: `redesign-valmora`
Reference: scrolltide.co template "Valmora" (scroll-driven frame sequence, camera tour of a car's details, specification counting up on a tachometer, tiny letter-spaced navigation)

## 1. Goals

1. Give the first screen a cinematic, scroll-driven story in the spirit of Valmora, built from the owner's own footage.
2. Bring Valmora's details (monospace labels, hairlines, stop counters, tachometer) to the rest of the page without making the path to the booking form longer.
3. Replace the stock portfolio with the owner's real work, curated and graded to match the site.
4. Keep everything that drives conversion: always-visible CTA, mobile sticky bar, short form, prefilled packages.

Non-goals: a full-page pinned scroll story, 3D/Three.js, a camera orbit (the source footage has none), new copy for existing sections, real contacts and the form backend (left for the very end, see `docs/superpowers/specs/2026-10-12-aws-deployment-design.md`).

## 2. Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Scope | Cinematic hero + restyle of the rest; the rest scrolls normally (no pinning) |
| Visual style | "A · Evolution": keep gold `#C9A86A` gradient, Cormorant Garamond + Inter; add JetBrains Mono for labels, hairlines, stop counters, more air in the hero |
| Hero story | 4 stops built from close-ups (paint → ceramic → wheels → interior), no orbit |
| Hero scroll length | ~2 extra screens (section height ≈ 300svh); CTA visible the whole time |
| Hero source | Owner's reel `Перетворили та захистили цей суперкар…mp4` (Corvette C8, 720×1280, 26 s). Owner confirmed it is their team's work and they hold the rights |
| Hard constraint | Nothing of DD73 (former partner) may appear: no logo card, no "DD73"/"73" facade lettering, no orange numbered garage doors, no reflections of them |
| Also excluded | Shots implying a studio (site says mobile-only) and film/PPF wrapping shots (Stella does not offer PPF) |
| Rendering technique | Pre-extracted WebP frame sequence drawn on `<canvas>` by scroll position (not `<video>` scrubbing: choppy on iOS Safari) |
| Portfolio | 14 of the owner's 42 photos across 5 cars, graded and cropped; replaces stock gallery; nav label "Роботи" → "Портфоліо" |
| Tests | Add Vitest for pure logic; visual checks with headless Chrome at 390 px and 1440 px |
| Delivery | Work on branch `redesign-valmora`; merging to `main` (= deploy to GitHub Pages) only with the owner's explicit OK |

## 3. Hero scroll story

### 3.1 Structure and states

`<section id="top">` is ~300svh tall; inside it a `position: sticky` stage fills the viewport. Scroll progress `p ∈ [0, 1]` = how far the section has scrolled past the top, divided by (section height − viewport height).

| State | `p` range | Text over the frame |
|---|---|---|
| Intro | 0 – 0.12 | Eyebrow, H1 "Досконалість / у кожному відблиску", lead text, CTA, note (current hero copy) |
| 01 Paint correction | 0.12 – 0.34 | Counter `01 / 04` + hairline, title, one-line benefit, price "від 5 500 kr" |
| 02 Ceramic coating | 0.34 – 0.56 | `02 / 04`, "9H, гарантія до 5 років", "від 7 500 kr" |
| 03 Wheels & calipers | 0.56 – 0.78 | `03 / 04`, "очищення й кераміка проти пилу та солі" (no price) |
| 04 Interior detailing | 0.78 – 1 | `04 / 04`, "шкіра, Alcantara", "від 3 800 kr" |

- During Intro the stage holds frame 0 (first frame of stop 01). Within a stop's `p` range, `p` maps linearly onto that stop's frame range from `manifest.json` (`from`–`to`), so each shot plays across its own scroll range; crossfade frames sit at the range edges.
- Intro text fades out as stop captions fade in (opacity + 12 px translate, 300 ms).
- The primary CTA "Безкоштовний огляд" (prefills nothing) and a small mono link "Пропустити ↓" (scrolls to `#mobile`) stay pinned at the bottom of the stage in every state.
- Prices come from `serviceMeta` (same source as the Services section) through `formatPrice`, never hard-coded in translations.
- Stop titles/benefits are translated in all 5 languages under `t.hero.stops[]`.

### 3.2 Layout

- **Phone (< md):** canvas covers the whole stage (`object-fit: cover` behaviour implemented in the draw call), bottom gradient to `#0A0A0B`, text block and CTA at the bottom, header on top.
- **Desktop (≥ md):** two columns. Left: intro text, then the list of stops 01–04 as a table of contents (active stop in gold, others muted; clicking a stop scrolls to its range). Right: the portrait frame (9:16) in a 1 px gold hairline frame, ~80vh tall. Behind it a second, heavily blurred and darkened copy of the current frame fills the background as ambient light. The 720p source is never stretched full-width.
- The vertical "Detailing Studio · Est. 2017" side label is removed.

### 3.3 Loading and fallbacks

- `public/hero/poster.jpg` (first frame, ≤ 80 KB) is rendered as an `<img>` immediately and is the LCP element.
- Frames load progressively: every 4th frame first, then the rest. When the exact frame is not loaded yet, draw the nearest loaded one.
- Canvas draws are throttled with `requestAnimationFrame`; resize recalculates the canvas size with `devicePixelRatio` capped at 2.
- `prefers-reduced-motion: reduce` → no sticky stage: the section becomes one screen with the poster, intro text, CTA and the four stops as a static list.
- If `manifest.json` fails to load, the poster-only layout is used (same as reduced motion).

### 3.4 Interaction with the sticky mobile bar

`MobileBar` appears only after the hero section has scrolled out of view (replaces the fixed 480 px threshold), so the bar never duplicates the hero CTA. It still hides while the contact form or footer is visible.

## 4. Video edit pipeline

- `scripts/hero-frames.mjs`, run as `npm run hero:frames -- <path-to-video>`. Uses `ffmpeg-static` (devDependency), so no system ffmpeg is needed.
- The script holds the edit as data: for each stop the source in/out timecodes and a crop/zoom:

| Stop | Source shot (s) | Crop |
|---|---|---|
| 01 Paint | 1.50 – 2.43, door panel with emblem | none |
| 02 Ceramic | 13.00 – 13.87, applicator on carbon/leather | none |
| 03 Wheels | 17.00 – 17.57, wheel and red caliper | zoom ×1.35 anchored low, hides facade lettering |
| 04 Interior | 17.57 – 19.27, pan across seats | cut top 16 % (orange door frame, plant) |

- Processing: drop audio; trim each shot (a few frames inside the cut points to avoid flashes); apply crop; grade (slightly lifted contrast, deeper shadows, warm highlights, saturation −10 %, soft vignette); join with 0.3 s crossfades.
- The joined clip (~4 s at 30 fps) is resampled to ~72 frames so file size stays in budget.
- Output to `public/hero/`: ~72 frames `frames/0001.webp …` at 600×1066 (WebP q≈72), `poster.jpg`, `manifest.json` `{ count, width, height, stops: [{ id, from, to }] }`. Budget: frames total ≤ 2.5 MB.
- The source video is never committed. Re-shooting means editing the timecode table and re-running the script.
- Before committing, every output frame is reviewed (contact sheet) for any DD73 trace; any trace fails the frame.

## 5. Restyle of the rest of the page

- **Fonts:** add `@fontsource/jetbrains-mono` (400, 500). A `mono` font token in `theme.js`.
- **Header:** logo + two-line mono tagline "Mobile detailing / Oslo · est. 2017"; nav in mono, ~10.5 px, letter-spacing ≈ 0.22em; the "Запис" CTA becomes a gold text link (Valmora's highlighted "Private viewing"); hairline under the header. Mobile: logo + mono "МЕНЮ ☰".
- **Section eyebrows:** `Eyebrow` switches to mono and gets an optional index, rendered as `02 — ПОСЛУГИ` with the hairline. Indices follow page order.
- **Numbers in cards** (services, winter steps, process, yachts) use mono.
- **Spec strip** (new, directly below the hero): four tachometer gauges — `1 200+` cars, `100%` jobs with a photo report, `9` years, `5` years warranty. Each gauge is an SVG 240° arc with tick marks; when the strip enters the viewport (once), the arc fills and the number counts up over ~1.2 s with ease-out; reduced motion shows final values. Phone: 2×2 grid. The car-brand marquee moves under the strip. Values and labels come from the existing `t.hero.stats`.
- **Unchanged:** gold buttons, MobileBar, contact form, copy and prices, section order, vertical paddings (page length must not grow except for the hero's own scroll).

## 6. Portfolio

### 6.1 Selection (owner's photos, `~/Pictures/Фото для сайта/`, all 1080×1920)

| Case | Cover | Details |
|---|---|---|
| BMW M5 (matte) | 04 front ¾ | 06 wheel with blue caliper, 07 headlight |
| BMW M5 Touring G99 | 05 tail light with M5 badge | 06 orange seat, 03 front ¾ |
| Chevrolet Corvette C8 | 01 front | 03 rear, 05 wheel |
| Mercedes-AMG G63 | 03 front ¾ | 05 grille, 08 "V8 Biturbo" badge |
| Volkswagen Touareg | 05 deep black paint close-up | 03 front ¾ |

Work done on every case: "Корекція лаку + кераміка" (translated).

### 6.2 Processing

- `scripts/portfolio-photos.mjs` (`npm run portfolio:photos -- <photos-dir>`), using `sharp` (devDependency). Per photo the config holds: crop window (4:5, positioned to exclude the facade), optional top darkening gradient, and plate-blur rectangles.
- The background building belongs to DD73: crop it out where possible; where a strip remains, darken it to near-black with a gradient; if a photo cannot be cleaned, swap it for another from the same car and note it in the PR. No numbered doors, facade lettering or orange door frames may remain recognisable. Licence plates are blurred.
- Grade matches the hero: deeper shadows, warm highlights, saturation −10 %, soft vignette.
- Output to `public/portfolio/<case>/<n>.webp` in two widths (640 and 1080) for `srcset`; budget ≤ 160 KB per 1080 image.
- Originals are never committed.

### 6.3 Section

- Replaces `Gallery` (`#gallery` anchor and nav position kept; label "Роботи" → "Портфоліо" in all languages).
- Five case cards (phone: one column; tablet: 2; desktop: 3 + 2). Each card shows the cover (4:5), car name in Cormorant, mono label "Корекція лаку + кераміка".
- Each card is a small swipeable carousel (CSS scroll-snap, no library) through cover + details with mono counter `1 / 3`; arrows on desktop hover.
- `galleryMeta` in `src/data.js` is replaced by `portfolioCases` (ids, names, photo paths); translated strings live in `t.portfolio`.

## 7. Testing and verification

- Add Vitest + jsdom (aligns with `docs/superpowers/plans/2026-10-12-repo-setup.md`, Task 2). Unit tests:
  - `frameForProgress(p, manifest)` and `stopForProgress(p, stops)` — bounds, monotonicity, stop edges.
  - Tachometer value formatting/count-up mapping.
  - `manifest.json` matches files on disk and the frame budget (≤ 2.5 MB); every portfolio path in `portfolioCases` exists.
- Visual checks with headless Chrome (puppeteer-core, scratch tooling, not committed) at 390 px and 1440 px: intro and each stop, spec strip, portfolio; horizontal overflow check in all 5 languages; reduced-motion render.
- Manual DD73 review of all hero frames and portfolio images (contact sheets) before each commit that adds media.
- `vite build` must pass; Lighthouse is not a gate.

## 8. Risks

- **720p source** looks soft on large retina screens — mitigated by the framed portrait layout on desktop.
- **Hero weight** (≈ 2.5 MB) on slow mobile connections — mitigated by poster-first and progressive loading.
- **Location is recognisable** (Ukrainian plates, the same building in many shots) while the site targets Oslo — plates blurred; the owner is aware.
- **Short shots** (0.6–1.7 s) mean few frames per stop; captions carry the stop while the shot holds on its last frame.
