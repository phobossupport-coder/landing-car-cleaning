# Repository Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the landing-page repository lint, formatting, a test runner with first tests, CI, an English README and a `CLAUDE.md`, so later work (AWS deployment, interface changes) runs with TDD and automated checks.

**Architecture:** Add ESLint 10 (flat config) + Prettier, Vitest 3 on top of the existing Vite 5 build, a `src/test/` folder with setup and render helpers, and a GitHub Actions `ci.yml`. No product code changes except exporting `detect()` from the i18n module for testing. Spec Part A.

**Tech Stack:** ESLint 10, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`, Prettier 3, Vitest 3.2 (Vite 5 compatible), jsdom, Testing Library (react, jest-dom, user-event).

**Spec:** `docs/superpowers/specs/2026-10-12-aws-deployment-design.md` (§3) and `docs/project-spec.md`.

## Global Constraints

- Node 22 (`.nvmrc`); run `nvm use` first. `engines.node >= 20` stays.
- Vite stays at 5.x, so `vitest` and `@vitest/coverage-v8` must be `^3.2` (Vitest 4+ needs Vite 6+).
- Prettier: `singleQuote: true`, `printWidth: 160`, `trailingComma: 'all'`, `semi: true`.
- All user-facing text lives in `src/i18n/<lang>.js`; the five files keep identical key structure and array lengths.
- Styling only through MUI `sx`; MUI Grid v2 `size` prop.
- Documentation in English; commit messages in Ukrainian.
- Never commit `.env*` (except `.env.example`), `dist/`, `node_modules/`, `coverage/`.
- Before every commit: `npm run lint && npm run format:check && npm test && npm run build` pass.

## Review Focus

1. `detect()` when `localStorage` throws (Safari private mode) must still return a language, not crash — test in Task 3.
2. `detect()` when `navigator.languages` is undefined (old WebViews) must fall back to `navigator.language` — test in Task 3.
3. `formatPrice(0, …)` must not throw; Services shows "on request" for falsy prices, but the formatter is still reachable — test in Task 2.
4. A translation file with an extra or missing array element silently breaks index matching with `data.js` — structure test in Task 4 must fail on a length mismatch, proven by a deliberately broken fixture.
5. The App smoke test must fail if a section id disappears, so renaming an anchor is caught — Task 5 asserts every id.

---

### Task 1: ESLint + Prettier

**Files:**
- Create: `eslint.config.js`, `.prettierrc`, `.prettierignore`
- Modify: `package.json` (scripts, devDependencies)

**Interfaces:**
- Produces: npm scripts `lint`, `lint:fix`, `format`, `format:check` used by Task 6 CI.

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D eslint @eslint/js globals eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-config-prettier prettier
```

- [ ] **Step 2: Create `.prettierrc` and `.prettierignore`**

`.prettierrc`: `{ "singleQuote": true, "printWidth": 160, "trailingComma": "all", "semi": true }`.
`.prettierignore`: `dist`, `node_modules`, `coverage`, `package-lock.json`.

- [ ] **Step 3: Create `eslint.config.js`**

Flat config array, ESM. Entries: global ignores `dist/**`, `node_modules/**`, `coverage/**`; `@eslint/js` `recommended`; `eslint-plugin-react` `configs.flat.recommended` and `configs.flat['jsx-runtime']` with `settings.react.version: 'detect'`; `eslint-plugin-react-hooks` flat recommended config (the plugin exports it as `configs.flat.recommended`; if that key is missing in the installed version use `configs['recommended-latest']`); `eslint-plugin-react-refresh` `configs.vite`; `languageOptions.globals` = `globals.browser`; last entry `eslint-config-prettier` to switch off formatting rules. Files pattern `**/*.{js,jsx,mjs}`.

- [ ] **Step 4: Add scripts to `package.json`**

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 5: Run lint, fix real findings**

Run: `npm run lint`
Expected: exit 0. If the plugin reports `react-refresh/only-export-components` for `src/i18n/index.jsx` (it exports both a component and `languages`/`useLang`), add `{ allowExportNames: ['languages', 'useLang', 'detect'] }` to the rule options rather than disabling it. Any other finding is a real bug: fix it in place.

- [ ] **Step 6: Commit configuration**

```bash
git add eslint.config.js .prettierrc .prettierignore package.json package-lock.json
git commit -m "ESLint 10 (flat config) та Prettier"
```

- [ ] **Step 7: Format the codebase once, verify, commit separately**

Run: `npm run format && npm run format:check && npm run lint && npm run build`
Expected: `format:check` prints "All matched files use Prettier code style!", build succeeds.

```bash
git add -A
git commit -m "Форматування коду Prettier (printWidth 160)"
```

---

### Task 2: Vitest setup and `formatPrice` tests

**Files:**
- Create: `src/test/setup.js`, `src/i18n/currency.test.js`
- Modify: `vite.config.js` (test block), `package.json` (scripts, devDependencies)

**Interfaces:**
- Produces: `npm test` (`vitest run`), `npm run test:watch`; `src/test/setup.js` registering jest-dom matchers and a `window.matchMedia` stub, used by every later test.

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest@^3.2 @vitest/coverage-v8@^3.2 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Add the `test` block to `vite.config.js`**

```js
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.js'],
  include: ['src/**/*.test.{js,jsx}', 'infra/**/*.test.mjs'],
  css: false,
},
```
Keep the existing `base` line untouched (GitHub Pages still uses it).

- [ ] **Step 3: Create `src/test/setup.js`**

Imports `@testing-library/jest-dom/vitest`; defines `window.matchMedia` stub returning `{ matches: false, media, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }` when `window.matchMedia` is undefined; calls `afterEach(cleanup)` from `@testing-library/react`.

- [ ] **Step 4: Add scripts**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write the failing test `src/i18n/currency.test.js`**

```js
import { describe, expect, it } from 'vitest';
import { currencies, formatPrice } from './currency';

describe('formatPrice', () => {
  it.each([
    [5500, 'NOK', '5 500 kr'],
    [990, 'NOK', '990 kr'],
    [16500, 'NOK', '16 500 kr'],
    [5500, 'EUR', '500 €'],
    [3300, 'EUR', '300 €'],
    [10900, 'EUR', '990 €'],
    [16500, 'EUR', '1 500 €'],
    [149, 'EUR', '15 €'],
    [5500, 'UAH', '24 000 ₴'],
    [990, 'UAH', '4 350 ₴'],
    [149, 'UAH', '650 ₴'],
  ])('formats %i NOK in %s as %s', (nok, code, expected) => {
    expect(formatPrice(nok, code)).toBe(expected);
  });

  it('falls back to NOK for an unknown currency', () => {
    expect(formatPrice(5500, 'XXX')).toBe('5 500 kr');
  });

  it('defaults to NOK when no currency is given', () => {
    expect(formatPrice(5500)).toBe('5 500 kr');
  });

  it('formats zero without throwing', () => {
    expect(formatPrice(0, 'EUR')).toBe('0 €');
  });

  it('exposes the three supported currencies', () => {
    expect(Object.keys(currencies)).toEqual(['NOK', 'EUR', 'UAH']);
  });
});
```

- [ ] **Step 6: Run the test**

Run: `npm test -- src/i18n/currency.test.js`
Expected: PASS (the module already exists; this test pins current behaviour). If any `it.each` row fails, the expected value in the plan was computed from `rate`/`step` in `currency.js`; recheck the arithmetic before touching the code.

- [ ] **Step 7: Commit**

```bash
git add vite.config.js src/test/setup.js src/i18n/currency.test.js package.json package-lock.json
git commit -m "Vitest + Testing Library, тести formatPrice"
```

---

### Task 3: Language detection tests

**Files:**
- Modify: `src/i18n/index.jsx` (export `detect`)
- Create: `src/i18n/detect.test.jsx`

**Interfaces:**
- Produces: `export function detect(): 'no' | 'en' | 'de' | 'uk' | 'ru'` from `src/i18n/index.jsx` (same body as today, now exported).

- [ ] **Step 1: Write the failing test `src/i18n/detect.test.jsx`**

```jsx
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detect } from './index';

const setLanguages = (languages, language = languages?.[0]) => {
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true });
  Object.defineProperty(window.navigator, 'language', { value: language, configurable: true });
};

describe('detect', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    setLanguages(['fr-FR']);
  });
  afterEach(() => vi.restoreAllMocks());

  it('prefers the saved language', () => {
    localStorage.setItem('stella-lang', 'ru');
    window.history.replaceState({}, '', '/?lang=de');
    expect(detect()).toBe('ru');
  });

  it('ignores an unknown saved language and uses ?lang=', () => {
    localStorage.setItem('stella-lang', 'xx');
    window.history.replaceState({}, '', '/?lang=de');
    expect(detect()).toBe('de');
  });

  it('maps nb and nn to no', () => {
    setLanguages(['nb-NO', 'en']);
    expect(detect()).toBe('no');
    setLanguages(['nn']);
    expect(detect()).toBe('no');
  });

  it('uses the first supported browser language', () => {
    setLanguages(['fr', 'uk-UA', 'en']);
    expect(detect()).toBe('uk');
  });

  it('defaults to no when nothing matches', () => {
    expect(detect()).toBe('no');
  });

  it('falls back to navigator.language when languages is undefined', () => {
    setLanguages(undefined, 'de-DE');
    expect(detect()).toBe('de');
  });

  it('survives a throwing localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    setLanguages(['en-GB']);
    expect(detect()).toBe('no');
  });
});
```
Note on the last test: the current implementation wraps everything in one `try`, so a throwing `localStorage` skips URL and navigator detection and returns `'no'`. The test pins that it does not crash; the expected value is `'no'`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/i18n/detect.test.jsx`
Expected: FAIL, `detect` is not exported.

- [ ] **Step 3: Export `detect`**

In `src/i18n/index.jsx` change `function detect()` to `export function detect()`. No other change.

- [ ] **Step 4: Run tests and lint**

Run: `npm test -- src/i18n/detect.test.jsx && npm run lint`
Expected: 7 passed; lint exit 0 (adjust `allowExportNames` from Task 1 if `react-refresh` complains).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/index.jsx src/i18n/detect.test.jsx eslint.config.js
git commit -m "Тести визначення мови, експорт detect()"
```

---

### Task 4: Translation structure test

**Files:**
- Create: `src/i18n/structure.test.js`

**Interfaces:**
- Produces: nothing reused; guards `project-spec.md` §6.2 invariants.

- [ ] **Step 1: Write the test**

```js
import { describe, expect, it } from 'vitest';
import no from './no';
import en from './en';
import de from './de';
import uk from './uk';
import ru from './ru';

// Every leaf becomes "path:type"; arrays also record their length so a missing item is caught.
export function keyPaths(value, prefix = '') {
  if (Array.isArray(value)) {
    return [`${prefix}.length=${value.length}`, ...value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`))];
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((k) => keyPaths(value[k], prefix ? `${prefix}.${k}` : k));
  }
  return [`${prefix}:${typeof value}`];
}

const reference = keyPaths(no);

describe('translation files', () => {
  it.each([
    ['en', en],
    ['de', de],
    ['uk', uk],
    ['ru', ru],
  ])('%s has the same structure as no', (_, lang) => {
    expect(keyPaths(lang)).toEqual(reference);
  });

  it('keyPaths reports a length mismatch', () => {
    expect(keyPaths({ a: [1, 2] })).not.toEqual(keyPaths({ a: [1] }));
  });

  it('declares the expected currency per language', () => {
    expect([no, en, de, uk, ru].map((l) => [l.code, l.currency])).toEqual([
      ['no', 'NOK'],
      ['en', 'EUR'],
      ['de', 'EUR'],
      ['uk', 'UAH'],
      ['ru', 'UAH'],
    ]);
  });
});
```

- [ ] **Step 2: Run the test**

Run: `npm test -- src/i18n/structure.test.js`
Expected: PASS. If a language fails, the diff names the path (for example `hero.stats[1].suffix:string` present in one file only). That is a real inconsistency: align the translation files so the same keys exist everywhere (add the missing `suffix` or remove the extra one, matching `no.js`). Do not weaken the comparator.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/structure.test.js src/i18n/*.js
git commit -m "Тест узгодженості структури перекладів"
```

---

### Task 5: App smoke test and render helper

**Files:**
- Create: `src/test/render.jsx`, `src/App.test.jsx`

**Interfaces:**
- Produces: `renderWithProviders(ui, { lang = 'en' } = {})` from `src/test/render.jsx`: sets `localStorage['stella-lang']`, wraps `ui` in `ThemeProvider theme={theme}` + `LanguageProvider`, returns Testing Library's render result. Used by the Contact test in the AWS plan.

- [ ] **Step 1: Create `src/test/render.jsx`**

Implements the signature above using `@testing-library/react` `render`, `src/theme.js` default export and `LanguageProvider` from `src/i18n`.

- [ ] **Step 2: Write the failing test `src/App.test.jsx`**

```jsx
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test/render';

const sectionIds = ['top', 'services', 'winter', 'results', 'yachts', 'packages', 'process', 'gallery', 'reviews', 'faq', 'contact'];

describe('App', () => {
  it('renders every section anchor', () => {
    renderWithProviders(<App />);
    for (const id of sectionIds) expect(document.getElementById(id)).not.toBeNull();
  });

  it('renders the English hero when lang is en', () => {
    renderWithProviders(<App />, { lang: 'en' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/perfection/i);
  });

  it('switches html lang to nb for Norwegian', () => {
    renderWithProviders(<App />, { lang: 'no' });
    expect(document.documentElement.lang).toBe('nb');
  });
});
```
`en.js` has `hero.title1: 'Perfection'`, so the regex matches the rendered H1.

- [ ] **Step 3: Run to verify it fails, then passes**

Run: `npm test -- src/App.test.jsx`
Expected first run: FAIL (`render.jsx` missing or assertion). After Step 1 is complete: 3 passed. If jsdom throws on a missing browser API (`IntersectionObserver` is already guarded; `matchMedia` is stubbed in setup), add the stub to `src/test/setup.js`, not to product code.

- [ ] **Step 4: Run the whole suite and lint**

Run: `npm run lint && npm run format:check && npm test`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add src/test/render.jsx src/App.test.jsx
git commit -m "Smoke-тест App і хелпер рендеру з провайдерами"
```

---

### Task 6: `CLAUDE.md`, English `README.md`, CI workflow

**Files:**
- Create: `CLAUDE.md`, `.github/workflows/ci.yml`
- Modify: `README.md` (rewrite in English)

**Interfaces:**
- Consumes: scripts from Tasks 1–2.
- Produces: CI job `check` that the AWS plan extends with `cfn-lint`.

- [ ] **Step 1: Write `CLAUDE.md`**

English, under 120 lines, exactly these sections in this order: **Project** (one paragraph, link to `docs/project-spec.md`), **Commands** (`nvm use`, `npm install`, `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:watch`), **Code map** (`src/data.js`, `src/i18n/`, `src/theme.js`, `src/components/`, `src/test/`, `infra/`, `docs/`), **Rules** (the eight rules from spec §3.1 verbatim: no user-facing text in components; add array items in all five languages; `sx` only; Grid v2 `size`; prices only in `data.js`; never edit `dist/`; never commit secrets or `.env`; keep `structure.test.js` green), **Workflow** (brainstorm → spec → plan → TDD; the pre-commit command line from Global Constraints; commit messages in Ukrainian; docs in English), **Deployment** (links to `docs/deploy-runbook.md` and `infra/README.md`, marked "created by the AWS deployment plan").

- [ ] **Step 2: Rewrite `README.md` in English**

Title, one-line description, requirements (Node 22), quick start (`nvm use && npm install && npm run dev`), scripts table, links: `docs/project-spec.md`, `docs/superpowers/specs/`, `docs/superpowers/plans/`, `MARKET.md` (Ukrainian), `DEPLOY.md` (Ukrainian, to be replaced by `docs/deploy-runbook.md`).

- [ ] **Step 3: Create `.github/workflows/ci.yml`**

Name `CI`; triggers `push` (all branches) and `pull_request`; one job `check` on `ubuntu-latest`: `actions/checkout@v4`, `actions/setup-node@v4` with `node-version-file: .nvmrc` and `cache: npm`, then `npm ci`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build`. `permissions: contents: read`.

- [ ] **Step 4: Verify locally and commit**

Run: `npm run lint && npm run format:check && npm test && npm run build`
Expected: green.

```bash
git add CLAUDE.md README.md .github/workflows/ci.yml
git commit -m "CLAUDE.md, README англійською, CI workflow"
```

- [ ] **Step 5: Push and confirm CI**

Run: `git push && gh run watch --exit-status $(gh run list --workflow CI --limit 1 --json databaseId -q '.[0].databaseId')`
Expected: the `CI` run completes with `success`. The existing `Deploy to GitHub Pages` run must also stay green.
