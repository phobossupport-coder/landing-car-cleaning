# Valmora-style redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cinematic scroll-driven hero from the owner's footage, Valmora details across the page, tachometer spec strip, and a real portfolio — without lengthening the path to the booking form.

**Architecture:** Media is prepared offline by two Node scripts (`ffmpeg-static`, `sharp`) into `public/hero/` and `public/portfolio/`; the app reads a `manifest.json` and draws WebP frames on a canvas from scroll progress. Pure logic (scroll → frame/stop, stat count-up, load order) lives in small modules with Vitest tests; React components stay thin.

**Tech Stack:** React 18, MUI 7, Vite, Vitest + jsdom, ffmpeg-static, sharp, @fontsource/jetbrains-mono.

**Spec:** `docs/superpowers/specs/2026-10-24-valmora-redesign-design.md`

## Global Constraints

- Nothing of DD73 may appear in any committed frame or photo (logo card, "DD73"/"73" lettering, orange numbered garage doors, their reflections). Every media commit is preceded by a contact-sheet review.
- No studio shots, no film/PPF shots.
- Hero frames total ≤ 2.5 MB; poster ≤ 80 KB; portfolio 1080 px images ≤ 160 KB each.
- Source video and original photos are never committed.
- All public asset URLs are prefixed with `import.meta.env.BASE_URL` (GitHub Pages serves from a sub-path).
- Prices only via `serviceMeta` + `formatPrice`; all copy in all 5 languages (`no`, `en`, `de`, `uk`, `ru`).
- Page length outside the hero must not grow; MobileBar, short form and package prefill keep working.
- Commit messages in Ukrainian; docs in English; work stays on `redesign-valmora` until the owner OKs the merge.

## Review Focus

- Very fast flick past the hero on a phone → canvas never shows a blank frame (nearest loaded frame is drawn). Test: `nearestLoaded` in Task 1.
- `p` outside [0, 1] (overscroll bounce on iOS, resize mid-scroll) → clamped, no out-of-range frame index. Test: `frameForProgress` clamps in Task 1.
- `manifest.json` missing/404 or reduced motion → poster-only static hero, CTA still works. Covered in Task 3 visual check with `prefers-reduced-motion` and a forced manifest failure.
- Stat values with separators/suffixes (`1 200+`, `100%`, `9`) count up and land exactly on the original string. Test: `parseStat`/`formatStat` round-trip in Task 5.
- Language switch while scrolled inside the hero → captions switch, frame/stop unchanged (state keyed by progress, not by text). Checked in Task 3 visual pass.

---

### Task 1: Scroll math + test tooling

**Files:**

- Modify: `package.json` (devDeps `vitest`, `jsdom`; script `"test": "vitest run"`)
- Create: `vitest.config.js` (environment `jsdom`)
- Create: `src/hero/scroll.js`
- Test: `src/hero/scroll.test.js`

**Interfaces:**

- Produces:
  - `INTRO_END = 0.12`; `STOP_BOUNDS = [[0.12, 0.34], [0.34, 0.56], [0.56, 0.78], [0.78, 1]]`
  - `clamp01(p: number): number`
  - `stopForProgress(p: number): number` → `-1` for intro, `0..3` otherwise (boundary belongs to the later stop; `p >= 1` → 3)
  - `frameForProgress(p: number, stops: {from:number,to:number}[]): number` → intro → `stops[0].from`; inside stop i → `from + round(t·(to−from))`, `t` = position inside the stop's bounds
  - `loadOrder(count: number): number[]` → every 4th index ascending first (0, 4, 8…), then the remaining ascending; each index exactly once
  - `nearestLoaded(i: number, loaded: boolean[]): number` → `i` if loaded, else the closest loaded index (ties → lower), `-1` if none

- [ ] **Step 1: Write failing tests** — `stopForProgress(0)===-1`, `(0.12)===0`, `(0.5)===1`, `(0.99)===3`, `(1.5)===3`; `frameForProgress(-0.2, S)===S[0].from`, `(0.12, S)===S[0].from`, `(0.34-1e-9, S)===S[0].to`, `(1, S)===S[3].to`, `(2, S)===S[3].to`, monotonic non-decreasing over 0..1 step 0.01; `loadOrder(10)` deep-equals `[0,4,8,1,2,3,5,6,7,9]`; `nearestLoaded(5, [T,F,F,F,F,F,F,T])===7` (distance 2 beats 5); `nearestLoaded(3, [T,F,F,F,F,F,T])===0` (tie 3 vs 3 → lower); all-false → `-1`.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL (module not found).
- [ ] **Step 3: Implement `src/hero/scroll.js`.**
- [ ] **Step 4: Run `npm test`** — Expected: PASS.
- [ ] **Step 5: Commit** «Hero: математика скролу (кадр, зупинка, порядок завантаження) + Vitest».

### Task 2: Hero frames pipeline and assets

**Files:**

- Modify: `package.json` (devDep `ffmpeg-static`; script `"hero:frames": "node scripts/hero-frames.mjs"`)
- Create: `scripts/hero-frames.mjs`
- Create: `public/hero/frames/0001.webp …`, `public/hero/poster.jpg`, `public/hero/manifest.json`
- Test: `src/hero/manifest.test.js`

**Interfaces:**

- Produces: `public/hero/manifest.json` = `{ "count": N, "width": 600, "height": 1066, "fps": number, "stops": [{ "id": "paint"|"ceramic"|"wheels"|"interior", "from": int, "to": int }] }`; frames named `frames/%04d.webp` (1-based file names, 0-based indices in code).

- [ ] **Step 1: Write failing test** `manifest.test.js`: manifest exists; `stops.length===4`, ids in order; `stops[0].from===0`, `stops[3].to===count-1`, each `from<to`, consecutive stops touch or overlap by ≤ crossfade frames; `count` files exist; sum of frame sizes ≤ 2.5·1024·1024; poster ≤ 80·1024.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL (no manifest).
- [ ] **Step 3: Implement `scripts/hero-frames.mjs <video>`.** Edit table (seconds): paint 1.55–2.38; ceramic 13.05–13.82; wheels 17.04–17.53 with `scale=iw*1.35:-1,crop=720:1280:(iw-720)/2:ih-1280` (anchored low); interior 17.62–19.22 with top 16 % cut (`crop=iw:ih*0.84:0:ih*0.16`) then rescale to 720×1280. Per shot `trim`+`setpts`; grade `eq=contrast=1.08:saturation=0.9:gamma=0.96,colorbalance=rh=0.04:bh=-0.03,vignette=PI/5`; join with `xfade=transition=fade:duration=0.3`; final `fps` chosen so total ≈ 72 frames; `scale=600:1066`; WebP `-quality 72`. Stop frame ranges computed from shot durations, crossfade split at the midpoint. Poster = frame 0 as JPG q 82. Script prints sizes and writes a contact sheet to a temp dir for review.
- [ ] **Step 4: Run** `npm run hero:frames -- "<video>"` then `npm test` — Expected: PASS; contact sheet reviewed: no DD73 trace (if any frame fails, tighten trims/crop and rerun).
- [ ] **Step 5: Commit** «Hero: скрипт монтажу і кадри з власного відео».

### Task 3: HeroStory component

**Files:**

- Create: `src/hero/useHeroFrames.js` (fetch manifest, progressive `Image` loading via `loadOrder`, returns `{ manifest, images, loaded, failed }`)
- Create: `src/components/HeroStory.jsx` (replaces `Hero.jsx` usage; `Hero.jsx` keeps only the `Marquee` export → move it to `src/components/Marquee.jsx` and delete `Hero.jsx`)
- Modify: `src/App.jsx`, `src/components/MobileBar.jsx`, `src/i18n/*.js` (`hero.stops[]`, `hero.skip`), `src/data.js` (`heroStopMeta = [{ id:'paint', service:0 }, { id:'ceramic', service:1 }, { id:'wheels', service:null }, { id:'interior', service:2 }]`)

**Interfaces:**

- Consumes: Task 1 functions; Task 2 manifest.
- Produces: `<HeroStory />` with `id="top"`; `MobileBar` visibility = hero out of view (IntersectionObserver on `#top`) && form/footer not visible.

- [ ] **Step 1: Implement** section `height: 300svh` (`100svh` + reduced-motion / failed manifest), sticky stage, canvas draw on rAF with cover-fit and DPR ≤ 2; progress from `getBoundingClientRect`. Phone layout = full-bleed canvas + bottom gradient + caption block + pinned CTA row (`Безкоштовний огляд` + mono `Пропустити ↓` → `#mobile`). Desktop (≥ md) = left text + clickable stop list (scroll to `top + (bounds[0]+0.01)·range`), right 9:16 framed canvas (gold 1 px hairline, ~80vh) over a blurred, darkened full-bleed copy (CSS `filter: blur(40px) brightness(.35)` on a second canvas drawn at low res). Poster `<img>` until first frame drawn. Intro copy fades out, stop caption fades in (opacity + 12 px, 300 ms).
- [ ] **Step 2: Add i18n** `hero.stops` (title + benefit for 4 stops) and `hero.skip` in 5 languages; remove `hero.side`.
- [ ] **Step 3: Verify** `npm test && npx vite build`; headless Chrome 390×844 and 1440×900 screenshots at p = 0, 0.2, 0.45, 0.67, 0.9; reduced-motion screenshot; manifest-404 screenshot (rename temporarily in `dist`); MobileBar hidden inside hero, shown after it; language switch inside hero keeps stop.
- [ ] **Step 4: Commit** «Hero: скрол-історія з 4 зупинок на canvas».

### Task 4: Mono typography, header, numbered eyebrows

**Files:**

- Modify: `package.json` (`@fontsource/jetbrains-mono`), `src/main.jsx` (400, 500), `src/theme.js` (export `mono`), `src/components/Header.jsx`, `src/components/Section.jsx` (`Eyebrow` gets `index?: number` → renders `0X — LABEL` in mono), section components passing indices in page order, number labels in Services/Winter/Process/Yachts/Packages to `mono`, `src/components/Footer.jsx` nav to mono.
- Copy: `t.header.tagline = ['Mobile detailing', 'Oslo · est. 2017']` (same in all languages — brand line).

- [ ] **Step 1: Implement** header per spec §5 (mono nav ~10.5 px, letter-spacing .22em; gold text-link CTA; hairline; mobile `МЕНЮ ☰` uses `t.header.menu`).
- [ ] **Step 2: Verify** build + screenshots 390/1440 of header and two sections; overflow check in 5 languages at 360 px.
- [ ] **Step 3: Commit** «Рестайл: моно-шрифт, шапка і нумеровані надзаголовки в стилі Valmora».

### Task 5: Tachometer spec strip

**Files:**

- Create: `src/components/stats.js`, `src/components/SpecStrip.jsx`
- Test: `src/components/stats.test.js`
- Modify: `src/App.jsx` (SpecStrip right after HeroStory, Marquee inside it)

**Interfaces:**

- Produces: `parseStat(value: string): { number: number, prefix: string, suffix: string }`; `formatStat(n: number, parsed): string` (groups thousands with a regular space like the source); `easeOutCubic(t)`; `countAt(target: number, t: number): number` (rounded, `t` clamped to [0,1]).

- [ ] **Step 1: Write failing tests** — `formatStat(parseStat(v).number, parseStat(v)) === v` for `'1 200+'`, `'100%'`, `'9'`; `countAt(1200, 0)===0`, `countAt(1200, 1)===1200`, `countAt(1200, 2)===1200`, monotonic.
- [ ] **Step 2: Run `npm test`** — FAIL.
- [ ] **Step 3: Implement** `stats.js`; `SpecStrip` = 4 SVG gauges (240° arc, 24 ticks, gold fill via `stroke-dashoffset`), count-up 1.2 s once on intersection, reduced motion → final values; 2×2 on phone, 4 columns ≥ md; suffix (years) as in old stats; Marquee below.
- [ ] **Step 4: Run tests + build + screenshot** strip on 390/1440 (after count-up).
- [ ] **Step 5: Commit** «Смуга-тахометр із цифрами під hero».

### Task 6: Portfolio photo pipeline and assets

**Files:**

- Modify: `package.json` (devDep `sharp`; script `"portfolio:photos": "node scripts/portfolio-photos.mjs"`)
- Create: `scripts/portfolio-photos.mjs`, `public/portfolio/<case>/<n>-640.webp`, `…-1080.webp`
- Modify: `src/data.js` (`portfolioCases` replaces `galleryMeta`)
- Test: `src/portfolio.test.js`

**Interfaces:**

- Produces: `portfolioCases: { id: string, name: string, photos: string[] }[]` with ids `bmw-m5-matte`, `bmw-m5-touring`, `corvette-c8`, `amg-g63`, `touareg`; photo names `'1'|'2'|'3'` (1 = cover). Helper `portfolioSrc(id, n, w: 640|1080)` → `${BASE_URL}portfolio/${id}/${n}-${w}.webp`.

- [ ] **Step 1: Write failing test** — every `portfolioCases` photo exists in both widths; each 1080 file ≤ 160 KB; 5 cases; 2–3 photos each.
- [ ] **Step 2: Run `npm test`** — FAIL.
- [ ] **Step 3: Implement script** with per-photo config `{ case, n, src: '<folder>/<file>', top: 0..1 (crop window top as fraction of free height), fade: 0..0.4 (top darkening gradient height), blur: [[x,y,w,h], …] }` for the selection in spec §6.1; pipeline: extract 4:5 window (1080×1350) → composite blurred plate regions → grade (`modulate saturation .9`, `linear` contrast 1.08, warm tint, vignette overlay SVG) → top gradient overlay → WebP 1080 q 74 and 640 q 72.
- [ ] **Step 4: Run** script, review contact sheet for DD73 (doors, lettering, orange frames, reflections) and plates; adjust windows or swap a photo for another from the same car until clean; `npm test` PASS.
- [ ] **Step 5: Commit** «Портфоліо: відбір і стилізація власних фото».

### Task 7: Portfolio section and navigation

**Files:**

- Create: `src/components/Portfolio.jsx`; delete `src/components/Gallery.jsx`
- Modify: `src/App.jsx`, `src/i18n/*.js` (`gallery` → `portfolio: { overline, title, subtitle, work }`, nav label → Портфоліо/Portfolio/Portefølje/Portfolio/Портфолио)

- [ ] **Step 1: Implement** `#gallery` section: case cards (1 col / 2 sm / 3 md), each a CSS scroll-snap carousel with `srcSet` 640/1080, `loading="lazy"`, mono counter `1 / 3` updated from scroll, desktop hover arrows (buttons scroll by one slide), car name in Cormorant, mono `work` label.
- [ ] **Step 2: Verify** build, swipe works in headless Chrome (scroll the track, counter updates), screenshots 390/1440, 5-language overflow.
- [ ] **Step 3: Commit** «Портфоліо: кейси з каруселлю, пункт меню «Портфоліо»».

### Task 8: Final verification

- [ ] Full-page screenshots 390 and 1440 (uk, no); conversion path: hero CTA → form; package prefill still works; MobileBar behaviour; reduced motion; `npm test`; `vite build`; total `dist` size reported; final DD73 sweep over `public/hero` and `public/portfolio` contact sheets.
- [ ] Update `README.md` (media scripts usage) and commit «Документація: скрипти медіа для hero і портфоліо».
