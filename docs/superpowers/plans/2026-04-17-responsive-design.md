# Responsive Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Measure every daily build against four viewports (360 / 768 / 1024 / 1440), surface the metrics in /dev, and feed yesterday's worst failure into today's prompt so the system improves over time.

**Architecture:** Four new modules communicate through a JSON metrics contract. `viewport-screenshotter` captures PNGs. `responsive-scorer` inspects the DOM via Playwright and writes metrics. `prompt-feedback-selector` picks a cautionary example from recent history. `/dev` displays screenshots + metrics + trend dashboard. Each module has one job and is independently testable.

**Tech Stack:** Node.js ESM, Playwright (already installed via `@playwright/test`), TanStack Start / React, Panda CSS, vitest. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-17-responsive-design.md`

---

## File Structure

**New files:**
- `scripts/utils/viewport-screenshotter.js` — screenshot N viewports
- `scripts/utils/responsive-scorer.js` — score a URL via Playwright
- `scripts/utils/prompt-feedback-selector.js` — pick a failure to inject
- `app/routes/dev.responsive.tsx` — trend dashboard route
- `app/components/responsive-card.tsx` — rating panel card
- `tests/utils/responsive-scorer.test.js` — scorer unit tests
- `tests/utils/prompt-feedback-selector.test.js` — selector unit tests
- `tests/scripts/viewport-screenshotter.test.js` — screenshotter integration test
- `tests/fixtures/responsive/*.html` — scoring fixtures (one per failure mode)
- `tests/e2e/dev-responsive-panel.spec.ts` — rating card e2e
- `tests/e2e/dev-responsive-trend.spec.ts` — trend dashboard e2e

**Modified files:**
- `scripts/prompts/unified-designer.md` — add responsive section
- `scripts/prompts/seeds/*.md` — per-archetype mobile strategy (8 files)
- `scripts/utils/archiver.js` — copy 4 viewport PNGs to public/archive/
- `scripts/utils/prompt-builder.js` — inject lesson from recent failures
- `scripts/daily-redesign.js` — orchestrate screenshot + score + write
- `app/dev-panel.tsx` — render responsive card above rating inputs
- `app/server/archive-impl.ts` — add `readResponsiveHistory()`

---

# Phase 1: Measurement

Build `responsive-scorer.js` check-by-check (TDD), then `viewport-screenshotter.js`, then wire into the pipeline.

**Note on test infrastructure:** The scorer checks rely on real computed styles and bounding rects, which jsdom cannot faithfully produce. All scorer tests launch a real Chromium instance via `@playwright/test`, with `testTimeout` bumped to 30_000ms in the test file. One shared browser across tests (`beforeAll`/`afterAll`), new page per test.

## Task 1: Create test fixture directory and known-good fixture

**Files:**
- Create: `tests/fixtures/responsive/clean.html`

- [ ] **Step 1: Create directory and fixture**

```bash
mkdir -p tests/fixtures/responsive
```

Write `tests/fixtures/responsive/clean.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: sans-serif; font-size: 16px; line-height: 1.5; }
    header { display: flex; gap: 16px; padding: 16px; }
    header > * { flex: 0 0 auto; }
    a, button { display: inline-block; min-width: 44px; min-height: 44px; padding: 12px; }
    main { padding: 16px; max-width: 65ch; margin: 0 auto; }
    h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 16px; }
    p { margin: 0 0 16px; }
  </style>
</head>
<body>
  <header>
    <a href="/">Logo</a>
    <nav><a href="/about">About</a></nav>
  </header>
  <main>
    <h1>Clean Page</h1>
    <p>This page should pass every responsive check at every viewport.</p>
  </main>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add tests/fixtures/responsive/clean.html
git commit -m "test(responsive): clean fixture for scorer baseline"
```

---

## Task 2: horizontalScroll check (TDD)

**Files:**
- Create: `tests/fixtures/responsive/overflow-horizontal.html`
- Create: `tests/utils/responsive-scorer.test.js`
- Create: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failure fixture**

Write `tests/fixtures/responsive/overflow-horizontal.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; padding: 0; }
    body { font-family: sans-serif; }
    h1 { font-size: 180px; white-space: nowrap; margin: 0; }
  </style>
</head>
<body>
  <h1>DOUG MARCH</h1>
</body>
</html>
```

- [ ] **Step 2: Write failing test**

Write `tests/utils/responsive-scorer.test.js`:

```js
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'url'
import path from 'path'
import { scoreResponsive } from '../../scripts/utils/responsive-scorer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(__dirname, '../fixtures/responsive')
const fixtureUrl = (name) => `file://${path.join(FIXTURES, name)}`

describe('responsive-scorer', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 30_000)
  afterAll(async () => {
    await browser.close()
  })

  describe('horizontalScroll check', () => {
    it('flags horizontal overflow at 360px', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('overflow-horizontal.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.horizontalScroll).toBe(true)
    }, 30_000)

    it('does not flag clean pages', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.horizontalScroll).toBe(false)
    }, 30_000)
  })
})
```

- [ ] **Step 3: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL with `Cannot find module '../../scripts/utils/responsive-scorer.js'`.

- [ ] **Step 4: Write minimal implementation**

Write `scripts/utils/responsive-scorer.js`:

```js
import { chromium } from '@playwright/test'

const CHECKS = {
  horizontalScroll: () =>
    document.documentElement.scrollWidth > window.innerWidth,
}

/**
 * Score a URL across viewports.
 * Each check runs in the page context after setting viewport.
 *
 * @param {string} url
 * @param {Array<{name, width, height}>} viewports
 * @param {object} [opts]
 * @param {import('@playwright/test').Browser} [opts.browser] - optional
 *   externally-managed browser (tests reuse one; production launches its own)
 * @returns {Promise<object>} metrics
 */
export async function scoreResponsive(url, viewports, opts = {}) {
  const ownBrowser = !opts.browser
  const browser = opts.browser || (await chromium.launch({ headless: true }))

  try {
    const page = await browser.newPage()
    const viewportResults = {}

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(300)

      const checks = {}
      for (const [name, fn] of Object.entries(CHECKS)) {
        checks[name] = await page.evaluate(fn)
      }

      viewportResults[vp.name] = {
        width: vp.width,
        height: vp.height,
        checks,
      }
    }

    await page.close()
    return { viewports: viewportResults }
  } finally {
    if (ownBrowser) await browser.close()
  }
}
```

- [ ] **Step 5: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/responsive/overflow-horizontal.html \
        tests/utils/responsive-scorer.test.js \
        scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): horizontalScroll check + TDD harness"
```

---

## Task 3: clippedElements check

**Files:**
- Create: `tests/fixtures/responsive/clipped-hero.html`
- Modify: `tests/utils/responsive-scorer.test.js`
- Modify: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failure fixture**

Write `tests/fixtures/responsive/clipped-hero.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; padding: 0; overflow: hidden; }
    body { font-family: sans-serif; }
    .hero { position: absolute; left: 50px; width: 800px; background: red; padding: 20px; color: white; }
  </style>
</head>
<body>
  <div class="hero">This hero is 800px wide starting at 50px — clipped beyond 360px.</div>
</body>
</html>
```

Note: `overflow: hidden` on body suppresses horizontal scroll but element is still clipped — exactly the bug we need to catch.

- [ ] **Step 2: Add failing test**

Append to `tests/utils/responsive-scorer.test.js` inside the `describe('responsive-scorer')` block:

```js
  describe('clippedElements check', () => {
    it('flags elements extending past the viewport', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clipped-hero.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.clippedElements.length).toBeGreaterThan(0)
      expect(metrics.viewports.mobile.checks.clippedElements[0].tag).toBe('DIV')
    }, 30_000)

    it('does not flag clean pages', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.clippedElements).toEqual([])
    }, 30_000)
  })
```

- [ ] **Step 3: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL — `clippedElements` is `undefined`.

- [ ] **Step 4: Add check to implementation**

In `scripts/utils/responsive-scorer.js`, extend the `CHECKS` object:

```js
const CHECKS = {
  horizontalScroll: () =>
    document.documentElement.scrollWidth > window.innerWidth,

  clippedElements: () => {
    const vw = window.innerWidth
    const out = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.right > vw + 1) {
        out.push({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 50),
          right: Math.round(r.right),
        })
      }
    }
    return out
  },
}
```

- [ ] **Step 5: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/responsive/clipped-hero.html \
        tests/utils/responsive-scorer.test.js \
        scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): clippedElements check"
```

---

## Task 4: headerOverlap check

**Files:**
- Create: `tests/fixtures/responsive/header-overlap.html`
- Modify: `tests/utils/responsive-scorer.test.js`
- Modify: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failure fixture**

Write `tests/fixtures/responsive/header-overlap.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; padding: 0; }
    header { position: relative; }
    header > * {
      position: absolute; top: 0;
      padding: 12px; background: rgba(255,0,0,0.3);
    }
    .logo { left: 0; width: 200px; }
    .nav   { left: 100px; width: 200px; }
  </style>
</head>
<body>
  <header>
    <div class="logo">Logo</div>
    <div class="nav">Nav</div>
  </header>
</body>
</html>
```

- [ ] **Step 2: Add failing test**

Append:

```js
  describe('headerOverlap check', () => {
    it('flags overlapping header children', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('header-overlap.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.headerOverlap.length).toBeGreaterThan(0)
    }, 30_000)

    it('does not flag non-overlapping header', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.headerOverlap).toEqual([])
    }, 30_000)
  })
```

- [ ] **Step 3: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL — `headerOverlap` is `undefined`.

- [ ] **Step 4: Add check**

Extend `CHECKS`:

```js
  headerOverlap: () => {
    const header = document.querySelector('header') || document.querySelector('nav')
    if (!header) return []
    const kids = [...header.children].map(el => ({ el, r: el.getBoundingClientRect() }))
    const overlaps = []
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i].r, b = kids[j].r
        const xOverlap = !(a.right <= b.left || b.right <= a.left)
        const yOverlap = !(a.bottom <= b.top || b.bottom <= a.top)
        if (xOverlap && yOverlap) {
          overlaps.push({
            a: kids[i].el.tagName + (kids[i].el.className ? '.' + kids[i].el.className : ''),
            b: kids[j].el.tagName + (kids[j].el.className ? '.' + kids[j].el.className : ''),
          })
        }
      }
    }
    return overlaps
  },
```

- [ ] **Step 5: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/responsive/header-overlap.html \
        tests/utils/responsive-scorer.test.js \
        scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): headerOverlap check"
```

---

## Task 5: bodyTextSize check

**Files:**
- Create: `tests/fixtures/responsive/tiny-body.html`
- Modify: `tests/utils/responsive-scorer.test.js`
- Modify: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failure fixture**

Write `tests/fixtures/responsive/tiny-body.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body { font-family: sans-serif; font-size: 12px; margin: 16px; }</style></head>
<body><main><p>This body text is 12 pixels — below the 16px floor.</p></main></body>
</html>
```

- [ ] **Step 2: Add failing test**

Append:

```js
  describe('bodyTextSize check', () => {
    it('flags body text below 16px', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('tiny-body.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.bodyTextSize.min).toBeLessThan(16)
      expect(metrics.viewports.mobile.checks.bodyTextSize.passing).toBe(false)
    }, 30_000)

    it('passes on 16px body', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.bodyTextSize.passing).toBe(true)
    }, 30_000)
  })
```

- [ ] **Step 3: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL.

- [ ] **Step 4: Add check**

Extend `CHECKS`:

```js
  bodyTextSize: () => {
    const root = document.querySelector('main') || document.body
    let min = Infinity
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let n
    while ((n = walker.nextNode())) {
      const text = (n.textContent || '').trim()
      if (text.length < 8) continue
      const parent = n.parentElement
      if (!parent) continue
      const fs = parseFloat(getComputedStyle(parent).fontSize)
      if (fs && fs < min) min = fs
    }
    if (min === Infinity) return { min: null, passing: true }
    return { min: Math.round(min * 10) / 10, passing: min >= 16 }
  },
```

- [ ] **Step 5: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (8 tests).

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/responsive/tiny-body.html \
        tests/utils/responsive-scorer.test.js \
        scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): bodyTextSize check"
```

---

## Task 6: tapTargetFailures check

**Files:**
- Create: `tests/fixtures/responsive/small-tap-targets.html`
- Modify: `tests/utils/responsive-scorer.test.js`
- Modify: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failure fixture**

Write `tests/fixtures/responsive/small-tap-targets.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:sans-serif;margin:16px} a,button{padding:2px;font-size:10px;display:inline-block}</style></head>
<body>
  <nav><a href="/about">About</a> <button>Menu</button></nav>
</body>
</html>
```

- [ ] **Step 2: Add failing test**

```js
  describe('tapTargetFailures check', () => {
    it('flags links/buttons under 44x44 at mobile', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('small-tap-targets.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.tapTargetFailures.length).toBeGreaterThanOrEqual(2)
    }, 30_000)

    it('does not flag at desktop width', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('small-tap-targets.html'),
        [{ name: 'desktop', width: 1440, height: 900 }],
        { browser }
      )
      expect(metrics.viewports.desktop.checks.tapTargetFailures).toEqual([])
    }, 30_000)

    it('passes on clean page', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.viewports.mobile.checks.tapTargetFailures).toEqual([])
    }, 30_000)
  })
```

- [ ] **Step 3: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL.

- [ ] **Step 4: Add check**

Extend `CHECKS`. Note — tap-target rule only applies at mobile/tablet widths (≤ 768). Scorer must know the current viewport; pass it in:

In `scripts/utils/responsive-scorer.js`, modify the scoring loop:

```js
const CHECKS = {
  // ... existing checks stay pure (no args) ...

  tapTargetFailures: (viewportWidth) => {
    if (viewportWidth > 768) return []
    const selectors = 'a[href], button, [role="button"], input[type="button"], input[type="submit"]'
    const out = []
    for (const el of document.querySelectorAll(selectors)) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.width < 44 || r.height < 44) {
        out.push({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 30),
          w: Math.round(r.width),
          h: Math.round(r.height),
        })
      }
    }
    return out
  },
}
```

Modify the evaluation loop to pass viewport width:

```js
      const checks = {}
      for (const [name, fn] of Object.entries(CHECKS)) {
        // Pass viewport width as second arg — most checks ignore it.
        checks[name] = await page.evaluate(
          ([fnStr, vw]) => {
            // eslint-disable-next-line no-new-func
            const f = new Function('return ' + fnStr)()
            return f(vw)
          },
          [fn.toString(), vp.width]
        )
      }
```

- [ ] **Step 5: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (11 tests).

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/responsive/small-tap-targets.html \
        tests/utils/responsive-scorer.test.js \
        scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): tapTargetFailures check (mobile/tablet only)"
```

---

## Task 7: lineLengthFailures check

**Files:**
- Create: `tests/fixtures/responsive/long-lines.html`
- Modify: `tests/utils/responsive-scorer.test.js`
- Modify: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failure fixture**

Write `tests/fixtures/responsive/long-lines.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:monospace;font-size:12px;margin:0;padding:16px;max-width:none}p{margin:0}</style></head>
<body>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</body>
</html>
```

At 1440px with small monospace, this will render as one line > 75 chars.

- [ ] **Step 2: Add failing test**

```js
  describe('lineLengthFailures check', () => {
    it('flags paragraphs with average line length > 75 chars', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('long-lines.html'),
        [{ name: 'desktop', width: 1440, height: 900 }],
        { browser }
      )
      expect(metrics.viewports.desktop.checks.lineLengthFailures.length).toBeGreaterThan(0)
    }, 30_000)

    it('passes when max-width constrains lines', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [{ name: 'desktop', width: 1440, height: 900 }],
        { browser }
      )
      expect(metrics.viewports.desktop.checks.lineLengthFailures).toEqual([])
    }, 30_000)
  })
```

- [ ] **Step 3: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL.

- [ ] **Step 4: Add check**

Extend `CHECKS`:

```js
  lineLengthFailures: () => {
    // Approximate: chars per paragraph / rendered line count.
    // Rendered lines ≈ clientHeight / computed line-height.
    const out = []
    for (const p of document.querySelectorAll('p')) {
      const text = (p.textContent || '').trim()
      if (text.length < 100) continue
      const cs = getComputedStyle(p)
      const lh = parseFloat(cs.lineHeight) ||
                 (parseFloat(cs.fontSize) * 1.5)
      const lines = Math.max(1, Math.round(p.clientHeight / lh))
      const avgChars = text.length / lines
      if (avgChars > 75) {
        out.push({
          chars: text.length,
          lines,
          avgPerLine: Math.round(avgChars),
          excerpt: text.slice(0, 40),
        })
      }
    }
    return out
  },
```

- [ ] **Step 5: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (13 tests).

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/responsive/long-lines.html \
        tests/utils/responsive-scorer.test.js \
        scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): lineLengthFailures check"
```

---

## Task 8: Per-viewport scoring and overallScore aggregation

**Files:**
- Modify: `tests/utils/responsive-scorer.test.js`
- Modify: `scripts/utils/responsive-scorer.js`

- [ ] **Step 1: Write failing test for scoring math**

Append:

```js
  describe('scoring math', () => {
    it('clean page scores 5 at every viewport', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('clean.html'),
        [
          { name: 'mobile', width: 360, height: 640 },
          { name: 'desktop', width: 1440, height: 900 },
        ],
        { browser }
      )
      expect(metrics.viewports.mobile.score).toBe(5)
      expect(metrics.viewports.desktop.score).toBe(5)
      expect(metrics.overallScore).toBe(5)
    }, 30_000)

    it('overflow page scores <5 at mobile and overall = min(viewports)', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('overflow-horizontal.html'),
        [
          { name: 'mobile', width: 360, height: 640 },
          { name: 'desktop', width: 1440, height: 900 },
        ],
        { browser }
      )
      expect(metrics.viewports.mobile.score).toBeLessThan(5)
      expect(metrics.overallScore).toBe(metrics.viewports.mobile.score)
    }, 30_000)

    it('emits worstFailure for bad build', async () => {
      const metrics = await scoreResponsive(
        fixtureUrl('overflow-horizontal.html'),
        [{ name: 'mobile', width: 360, height: 640 }],
        { browser }
      )
      expect(metrics.worstFailure).toBeTruthy()
      expect(metrics.worstFailure.viewport).toBe('mobile')
      expect(metrics.worstFailure.check).toBeTruthy()
    }, 30_000)
  })
```

- [ ] **Step 2: Run test, verify failure**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: FAIL — `score`, `overallScore`, `worstFailure` not emitted.

- [ ] **Step 3: Add scoring to implementation**

In `scripts/utils/responsive-scorer.js`, replace the return statement with full scoring:

```js
/**
 * Count failures for a viewport's checks.
 */
function countFailures(checks) {
  let n = 0
  if (checks.horizontalScroll) n++
  if (Array.isArray(checks.clippedElements) && checks.clippedElements.length) n++
  if (Array.isArray(checks.headerOverlap) && checks.headerOverlap.length) n++
  if (checks.bodyTextSize && checks.bodyTextSize.passing === false) n++
  if (Array.isArray(checks.tapTargetFailures) && checks.tapTargetFailures.length) n++
  if (Array.isArray(checks.lineLengthFailures) && checks.lineLengthFailures.length) n++
  return n
}

/** failure count → 1..5 (inverted, capped at 4+ failures = 1) */
function scoreFromFailureCount(n) {
  if (n === 0) return 5
  if (n === 1) return 4
  if (n === 2) return 3
  if (n === 3) return 2
  return 1
}

/** Pick the first failing check type (for worstFailure reporting) */
function firstFailingCheck(checks) {
  if (checks.horizontalScroll) return 'horizontalScroll'
  if (checks.clippedElements?.length) return 'clippedElements'
  if (checks.headerOverlap?.length) return 'headerOverlap'
  if (checks.bodyTextSize?.passing === false) return 'bodyTextSize'
  if (checks.tapTargetFailures?.length) return 'tapTargetFailures'
  if (checks.lineLengthFailures?.length) return 'lineLengthFailures'
  return null
}

function formatFailureDetail(check, viewportResult) {
  const c = viewportResult.checks
  switch (check) {
    case 'horizontalScroll':
      return `document.scrollWidth exceeded viewport ${viewportResult.width}px`
    case 'clippedElements':
      return `${c.clippedElements.length} element(s) extended past the viewport (first: <${c.clippedElements[0].tag}>)`
    case 'headerOverlap':
      return `${c.headerOverlap.length} overlapping pair(s) in the header`
    case 'bodyTextSize':
      return `body text min ${c.bodyTextSize.min}px (floor 16px)`
    case 'tapTargetFailures':
      return `${c.tapTargetFailures.length} interactive element(s) below 44×44px`
    case 'lineLengthFailures':
      return `${c.lineLengthFailures.length} paragraph(s) over 75 chars per line`
    default:
      return 'unknown'
  }
}
```

Inside the scoring loop, after the `checks` are collected:

```js
      viewportResults[vp.name] = {
        width: vp.width,
        height: vp.height,
        checks,
        score: scoreFromFailureCount(countFailures(checks)),
      }
```

After the viewport loop, add overall + worstFailure:

```js
    const overallScore = Math.min(
      ...Object.values(viewportResults).map(v => v.score)
    )

    let worstFailure = null
    const worstVp = Object.entries(viewportResults)
      .sort(([, a], [, b]) => a.score - b.score)[0]
    if (worstVp && worstVp[1].score < 5) {
      const [vpName, vpResult] = worstVp
      const check = firstFailingCheck(vpResult.checks)
      if (check) {
        worstFailure = {
          viewport: vpName,
          check,
          detail: formatFailureDetail(check, vpResult),
        }
      }
    }

    await page.close()
    return { viewports: viewportResults, overallScore, worstFailure }
```

- [ ] **Step 4: Run test, verify passes**

Run: `pnpm test tests/utils/responsive-scorer.test.js`
Expected: PASS (16 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/utils/responsive-scorer.test.js scripts/utils/responsive-scorer.js
git commit -m "feat(responsive): per-viewport score + overallScore + worstFailure"
```

---

## Task 9: viewport-screenshotter.js

**Files:**
- Create: `scripts/utils/viewport-screenshotter.js`
- Create: `tests/scripts/viewport-screenshotter.test.js`

- [ ] **Step 1: Write failing test**

Write `tests/scripts/viewport-screenshotter.test.js`:

```js
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm, stat } from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { screenshotViewports } from '../../scripts/utils/viewport-screenshotter.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLEAN = `file://${path.join(__dirname, '../fixtures/responsive/clean.html')}`

describe('viewport-screenshotter', () => {
  let outDir
  beforeAll(async () => {
    outDir = await mkdtemp(path.join(tmpdir(), 'vpscreen-'))
  })
  afterAll(async () => {
    await rm(outDir, { recursive: true, force: true })
  })

  it('writes one PNG per viewport', async () => {
    const viewports = [
      { name: 'mobile', width: 360, height: 640 },
      { name: 'tablet', width: 768, height: 1024 },
    ]
    const results = await screenshotViewports(CLEAN, viewports, outDir)
    expect(results.length).toBe(2)
    for (const r of results) {
      const s = await stat(r.path)
      expect(s.size).toBeGreaterThan(500)
      expect(r.path.endsWith(`${r.name}.png`)).toBe(true)
    }
  }, 30_000)
})
```

- [ ] **Step 2: Run test, verify failure**

Run: `pnpm test tests/scripts/viewport-screenshotter.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

Write `scripts/utils/viewport-screenshotter.js`:

```js
import { chromium } from '@playwright/test'
import path from 'path'

/**
 * Screenshot a URL at multiple viewports.
 * Single browser, one page, resize between viewports.
 *
 * @param {string} url
 * @param {Array<{name: string, width: number, height: number}>} viewports
 * @param {string} outDir - absolute path; must exist
 * @param {object} [opts]
 * @param {import('@playwright/test').Browser} [opts.browser]
 * @returns {Promise<Array<{name, width, height, path}>>}
 */
export async function screenshotViewports(url, viewports, outDir, opts = {}) {
  const ownBrowser = !opts.browser
  const browser = opts.browser || (await chromium.launch({ headless: true }))

  try {
    const page = await browser.newPage()
    const results = []
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500)
      const outPath = path.join(outDir, `${vp.name}.png`)
      await page.screenshot({ path: outPath, type: 'png', fullPage: false })
      results.push({ name: vp.name, width: vp.width, height: vp.height, path: outPath })
    }
    await page.close()
    return results
  } finally {
    if (ownBrowser) await browser.close()
  }
}
```

- [ ] **Step 4: Run test, verify passes**

Run: `pnpm test tests/scripts/viewport-screenshotter.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/utils/viewport-screenshotter.js \
        tests/scripts/viewport-screenshotter.test.js
git commit -m "feat(responsive): viewport-screenshotter (Playwright, 4 viewports)"
```

---

## Task 10: Wire measurement into daily-redesign.js

**Files:**
- Modify: `scripts/daily-redesign.js`

- [ ] **Step 1: Locate the post-build archive section**

Run: `grep -n "captureSnapshot\|archive(" scripts/daily-redesign.js`
Note the line numbers where snapshot / archive happen after the build step.

- [ ] **Step 2: Add imports near the top of `scripts/daily-redesign.js`**

```js
import { screenshotViewports } from './utils/viewport-screenshotter.js'
import { scoreResponsive } from './utils/responsive-scorer.js'
```

- [ ] **Step 3: After the existing archive + snapshot call, add scoring**

Find the code that writes files into `buildDir` (the archive build directory). After those writes, add:

```js
// Responsive measurement — soft-fail, non-blocking.
try {
  const previewUrl = 'http://localhost:5173/' // dev server is already up at this point
  const viewports = [
    { name: 'mobile',  width: 360,  height: 640 },
    { name: 'tablet',  width: 768,  height: 1024 },
    { name: 'laptop',  width: 1024, height: 768 },
    { name: 'desktop', width: 1440, height: 900 },
  ]
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch({ headless: true })
  try {
    const screenshotDir = buildDir  // same build dir; filenames {name}.png scoped by viewport
    // Use sub-dir to avoid collision with existing screenshot.png
    const { mkdir } = await import('fs/promises')
    const vpDir = `${buildDir}/viewports`
    await mkdir(vpDir, { recursive: true })
    await screenshotViewports(previewUrl, viewports, vpDir, { browser })

    const metrics = await scoreResponsive(previewUrl, viewports, { browser })
    metrics.buildId = buildId
    metrics.date = dateStr
    metrics.archetype = archetype || null

    const { writeFile } = await import('fs/promises')
    await writeFile(
      `${buildDir}/responsive-metrics.json`,
      JSON.stringify(metrics, null, 2),
      'utf8'
    )
    console.log(`  responsive metrics written (overall ${metrics.overallScore}/5)`)
  } finally {
    await browser.close()
  }
} catch (err) {
  console.warn(`  responsive scoring failed (non-blocking): ${err.message}`)
}
```

Note: `buildId`, `dateStr`, `archetype`, `buildDir` must be in scope. If the existing code uses different names, adapt accordingly — the intent is "after we've built the site and archived it, also measure it."

- [ ] **Step 4: Manual smoke test**

Trigger one daily redesign locally:
```bash
pnpm --filter=none node scripts/daily-redesign.js --dry-run 2>&1 | tail -20
```

(Or whatever the project's manual-run command is — check `package.json` scripts.)

Expected: `responsive metrics written (overall N/5)` appears in output; the latest build dir under `archive/` contains `responsive-metrics.json` + `viewports/*.png`.

- [ ] **Step 5: Commit**

```bash
git add scripts/daily-redesign.js
git commit -m "feat(responsive): score + screenshot every daily build (soft-fail)"
```

---

## Task 11: archiver.js — copy viewport screenshots to public/archive/

**Files:**
- Modify: `scripts/utils/archiver.js`

- [ ] **Step 1: Find `copyToPublic()`**

Run: `grep -n "copyToPublic\|public/archive" scripts/utils/archiver.js`

- [ ] **Step 2: Extend `copyToPublic()` to copy viewport PNGs**

After the existing screenshot.png copy and site HTML copy, add:

```js
  // Copy viewport screenshots (if the build produced them)
  const vpSrc = path.join(buildDir, 'viewports')
  if (existsSync(vpSrc)) {
    const vpDest = path.join(publicBase, dateStr, 'viewports')
    await mkdir(vpDest, { recursive: true })
    const vpEntries = await readdir(vpSrc)
    for (const f of vpEntries) {
      if (f.endsWith('.png')) {
        await copyFile(path.join(vpSrc, f), path.join(vpDest, f))
      }
    }
    console.log(`  copied viewport screenshots to public/archive/${dateStr}/viewports/`)
  }
```

- [ ] **Step 3: Manual smoke test**

Re-run a build locally as in Task 10 Step 4. Verify:
```bash
ls public/archive/YYYY-MM-DD/viewports/
```
Expected: 4 PNGs (mobile.png, tablet.png, laptop.png, desktop.png).

- [ ] **Step 4: Commit**

```bash
git add scripts/utils/archiver.js
git commit -m "feat(responsive): copy viewport PNGs to public/archive/"
```

---

# Phase 2: Prompt layer

## Task 12: Add responsive section to unified-designer.md

**Files:**
- Modify: `scripts/prompts/unified-designer.md`

- [ ] **Step 1: Locate insertion point**

Run: `grep -n "^## " scripts/prompts/unified-designer.md`
Find the line number of `## Accessibility` and `## Required Files`. New section goes between them.

- [ ] **Step 2: Insert responsive section**

Insert (before `## Required Files`, after the accessibility section ends):

```markdown
## Responsive — Mobile-First, Not Desktop-Squashed

You are designing for three characters: phone (360px), tablet (768px), laptop/desktop (1024px / 1440px). Start your composition at 360px and enhance upward. A design that looks great on desktop but overflows or clips on mobile is a failed build regardless of how striking the desktop view is.

**Mobile-first means:**
- Default CSS targets 360px. Use `@media (min-width: ...)` to add complexity at larger widths — never subtract at smaller.
- Large type uses `clamp()` or `vw` with caps, not fixed px. A specimen-scale hero at 120px on desktop should collapse to ~48px on mobile.
- Fixed sidebars, multi-column grids, and persistent nav rails must have a collapse strategy below the tablet breakpoint (usually stacking into a single column).
- Header chrome (logo + nav + signals) must not overlap at 360px. If everything can't fit, stack or hide behind a toggle.
- Touch targets ≥ 44×44px on any viewport ≤ 768px.
- Body text ≥ 16px at all viewports.
- Line length ≤ 75 characters at all viewports.

**What gets checked automatically:**
Every build runs at 360 / 768 / 1024 / 1440 and is scored on: horizontal scroll, content clipping, header overlap, body text size, tap-target size, line length. Failures are logged and fed back into tomorrow's prompt as negative examples.

```

- [ ] **Step 3: Commit**

```bash
git add scripts/prompts/unified-designer.md
git commit -m "feat(prompt): mobile-first responsive section in unified-designer"
```

---

## Task 13: Per-seed mobile strategies

**Files:**
- Modify: `scripts/prompts/seeds/specimen.md`
- Modify: `scripts/prompts/seeds/broadsheet.md`
- Modify: `scripts/prompts/seeds/gallery-wall.md`
- Modify: `scripts/prompts/seeds/split.md`
- Modify: `scripts/prompts/seeds/scroll.md`
- Modify: `scripts/prompts/seeds/stack.md`
- Modify: `scripts/prompts/seeds/poster.md`
- Modify: `scripts/prompts/seeds/index.md`

- [ ] **Step 1: Append the mobile strategy block to each seed file**

Each file gets a section appended at the end. Exact content per seed:

**specimen.md:**
```markdown

## Mobile strategy

Specimen fills the full viewport width on mobile; the label block (metadata, callouts, signals) stacks **below** the specimen, not beside. Hero type uses `font-size: clamp(3rem, 14vw, 11.25rem)` so the specimen-scale character survives shrinking without overflow. The specimen element itself should be ≥ 60% of viewport height on mobile — don't let it collapse into something indistinguishable from normal body content.
```

**broadsheet.md:**
```markdown

## Mobile strategy

Masthead stacks vertically on mobile: logo → name (Playfair, smaller) → nav as a pill row → date. Columns collapse to a single column with section dividers styled like masthead rules (full-width horizontal lines, not gutters). Datelines and kickers stay visible; they define the archetype.
```

**gallery-wall.md:**
```markdown

## Mobile strategy

Wall becomes a vertical scroll of framed artifacts on mobile. Each artifact keeps its scale *relative* to viewport width (e.g. 80vw for featured pieces, 60vw for thumbnails) rather than absolute pixels. The curator's logic should still read — don't just list items end to end; keep the varied rhythm.
```

**split.md:**
```markdown

## Mobile strategy

Two halves become two stacked sections on mobile. The divider becomes a horizontal rule (or negative space between sections). Asymmetry carries via aspect-ratio difference — the dominant half gets more vertical space. Avoid flipping which half dominates between viewports.
```

**scroll.md:**
```markdown

## Mobile strategy

Already fluid by nature. Ensure signal marginalia (weather, scores, quotes) collapses to **inline** captions or small-caps labels, not floating pull-quotes. Don't place marginalia in the margin at 360px — there is no margin. Tuck them between content beats instead.
```

**stack.md:**
```markdown

## Mobile strategy

Already naturally mobile-friendly. Use `min-height` tokens that scale down — no `height: 100vh` without a mobile fallback like `min-height: 500px`. Bands should stack with clear visual breaks at all widths.
```

**poster.md:**
```markdown

## Mobile strategy

Retains single dominant element on mobile — scale the hero via `clamp()`. Secondary info (nav, metadata, footer) stays anchored to the poster's bottom, not fighting the hero. If the hero needs to reflow (e.g. "DOUG / MARCH" instead of "DOUG MARCH"), the reflow should look intentional, not cramped.
```

**index.md:**
```markdown

## Mobile strategy

Table rows collapse to stacked cards at ≤ 768px. Year / role / description become inline labels within each card, not adjacent columns. The overall "index" character is preserved by keeping consistent row rhythm and visible row numbers or bullets.
```

Run this to check all seed files exist first:

```bash
ls scripts/prompts/seeds/
```

If any seed file is missing from the list above, skip that one and note it — the plan assumes all 8 exist.

- [ ] **Step 2: Commit**

```bash
git add scripts/prompts/seeds/
git commit -m "feat(prompt): mobile strategy in every archetype seed"
```

---

# Phase 3: /dev rating card

## Task 14: Server function `readResponsiveMetrics`

**Files:**
- Modify: `app/server/archive-impl.ts`

- [ ] **Step 1: Locate file**

Run: `grep -n "^export\|function" app/server/archive-impl.ts | head -20`

- [ ] **Step 2: Add function**

Append:

```ts
/**
 * Read responsive-metrics.json for a given build.
 * Returns null if the file doesn't exist.
 */
export async function readResponsiveMetrics(date: string, buildId: string): Promise<any | null> {
  const p = `archive/${date}/build-${buildId}/responsive-metrics.json`
  try {
    const { readFile } = await import('fs/promises')
    const raw = await readFile(p, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}
```

- [ ] **Step 3: Add a server route exposing it**

Find the pattern used by other server functions in this file. If there's a TanStack server-function wrapper (`createServerFn`), use it; otherwise expose as a route at `/api/dev-responsive/:date/:buildId`.

- [ ] **Step 4: Commit**

```bash
git add app/server/archive-impl.ts
git commit -m "feat(responsive): readResponsiveMetrics server function"
```

---

## Task 15: ResponsiveCard component

**Files:**
- Create: `app/components/responsive-card.tsx`
- Modify: `app/dev-panel.tsx`

- [ ] **Step 1: Write component**

Write `app/components/responsive-card.tsx`:

```tsx
import React from 'react'

type CheckResults = {
  horizontalScroll?: boolean
  clippedElements?: Array<{ tag: string; text: string }>
  headerOverlap?: Array<{ a: string; b: string }>
  bodyTextSize?: { min: number | null; passing: boolean }
  tapTargetFailures?: Array<{ tag: string; text: string; w: number; h: number }>
  lineLengthFailures?: Array<{ chars: number; lines: number; avgPerLine: number }>
}

type ViewportResult = {
  width: number
  height: number
  checks: CheckResults
  score: number
}

export type ResponsiveMetrics = {
  buildId: string
  date: string
  archetype: string | null
  viewports: Record<string, ViewportResult>
  overallScore: number
  worstFailure: { viewport: string; check: string; detail: string } | null
}

export function ResponsiveCard({ metrics, date }: { metrics: ResponsiveMetrics | null; date: string }) {
  if (!metrics) return null

  const c = {
    bg: '#0e1014', border: '#2a2f36', muted: '#8a8f97',
    text: '#dce0e6', cyan: '#00e5ff', font: 'JetBrains Mono, monospace',
  }
  const order: Array<keyof typeof metrics.viewports> = ['mobile', 'tablet', 'laptop', 'desktop']
  const base = `/archive/${date}/viewports`

  return (
    <div style={{ border: `1px solid ${c.border}`, padding: 12, marginBottom: 12, fontFamily: c.font, fontSize: 11, color: c.text, background: c.bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>Responsive Score</strong>
        <span style={{ color: c.cyan, fontWeight: 700 }}>{metrics.overallScore} / 5</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {order.map(name => {
          const v = metrics.viewports[name as string]
          if (!v) return null
          return (
            <div key={name as string} style={{ border: `1px solid ${c.border}`, padding: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: c.muted, marginBottom: 4 }}>
                <span>{name} {v.width}</span>
                <span>{v.score}/5</span>
              </div>
              <a href={`${base}/${name}.png`} target="_blank" rel="noreferrer">
                <img src={`${base}/${name}.png`} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </a>
            </div>
          )
        })}
      </div>
      {metrics.worstFailure && (
        <div style={{ marginTop: 8, padding: 8, border: `1px solid ${c.border}`, color: c.muted }}>
          <strong style={{ color: c.text }}>{metrics.worstFailure.viewport}</strong>{' '}
          — {metrics.worstFailure.check}: {metrics.worstFailure.detail}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Render in dev-panel.tsx**

Open `app/dev-panel.tsx`. Find where the build's rating inputs begin (search for `ratingCategories`). Add just before that block:

```tsx
import { ResponsiveCard } from './components/responsive-card'
```
at top of file, and inline:

```tsx
<ResponsiveCard metrics={responsiveMetrics} date={ratingDate} />
```

Load `responsiveMetrics` via the server function from Task 14. Pattern: if the existing code uses a `useEffect` + fetch pattern for build data, follow it; if it uses TanStack query, use that.

- [ ] **Step 3: Manual smoke test**

Run dev server, navigate to /dev, select a build that has `responsive-metrics.json`. Expect: card appears above rating inputs, 4 thumbnails, failure line if applicable.

- [ ] **Step 4: Commit**

```bash
git add app/components/responsive-card.tsx app/dev-panel.tsx
git commit -m "feat(dev): responsive card in rating panel"
```

---

# Phase 4: Feedback loop (retired)

This phase built `scripts/utils/read-responsive-history.js` and `scripts/utils/prompt-feedback-selector.js` to inject a cautionary lesson from a recent failing build into the React Engineer's prompt, gated behind an env var no workflow ever set. Issue #479 found the gate always off, the archetype matching never exercised, and `lessons.js` already carrying the same findings to every agent, and removed the path along with both files and their tests.


# Phase 5: Trend dashboard

## Task 19: /dev/responsive route + inline SVG charts

**Files:**
- Create: `app/routes/dev.responsive.tsx`
- Create: `app/components/responsive-trend.tsx`
- Modify: `app/server/archive-impl.ts` (add history reader for server side)

- [ ] **Step 1: Expose readResponsiveHistory on the server**

In `app/server/archive-impl.ts`, add:

```ts
/**
 * Read recent builds' responsive-metrics.json for the trend dashboard.
 */
export async function readResponsiveHistoryServer(limit = 30): Promise<any[]> {
  // Thin adapter around scripts/utils/read-responsive-history.js for TanStack server use.
  const mod = await import('../../scripts/utils/read-responsive-history.js')
  return mod.readResponsiveHistory({ limit })
}
```

- [ ] **Step 2: Write the route**

Write `app/routes/dev.responsive.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { ResponsiveTrend } from '../components/responsive-trend'
import { readResponsiveHistoryServer } from '../server/archive-impl'

export const Route = createFileRoute('/dev/responsive')({
  component: ResponsivePage,
  loader: async () => ({
    history: await readResponsiveHistoryServer(30),
  }),
})

function ResponsivePage() {
  const { history } = Route.useLoaderData()
  return (
    <div style={{ padding: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: '#0e1014', color: '#dce0e6', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 14, marginBottom: 16 }}>Responsive — last 30 builds</h1>
      <ResponsiveTrend history={history} />
    </div>
  )
}
```

- [ ] **Step 3: Write the chart component**

Write `app/components/responsive-trend.tsx`:

```tsx
import React from 'react'

type HistoryItem = {
  buildId: string
  date: string
  archetype: string | null
  overallScore: number
  viewports: Record<string, { score: number }>
  worstFailure?: { check: string } | null
}

const COLORS = { border: '#2a2f36', muted: '#8a8f97', text: '#dce0e6', cyan: '#00e5ff', fail: '#ff6b6b' }

function LineChart({ data, label }: { data: Array<{ x: number; y: number; labelX?: string }>; label: string }) {
  const W = 600, H = 120, pad = 24
  if (data.length === 0) return <div style={{ color: COLORS.muted }}>no data</div>
  const xs = data.map(d => d.x), ys = data.map(d => d.y)
  const xMin = Math.min(...xs), xMax = Math.max(...xs)
  const yMin = 1, yMax = 5
  const sx = (x: number) => pad + ((x - xMin) / Math.max(1, xMax - xMin)) * (W - pad * 2)
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - pad * 2)
  const poly = data.map(d => `${sx(d.x)},${sy(d.y)}`).join(' ')
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>{label}</div>
      <svg width={W} height={H} style={{ border: `1px solid ${COLORS.border}` }}>
        <polyline points={poly} fill="none" stroke={COLORS.cyan} strokeWidth={1.5} />
        {data.map((d, i) => (
          <circle key={i} cx={sx(d.x)} cy={sy(d.y)} r={2.5} fill={COLORS.cyan}>
            <title>{`${d.labelX || d.x}: ${d.y}/5`}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

function BarChart({ rows }: { rows: Array<{ label: string; count: number }> }) {
  const max = Math.max(1, ...rows.map(r => r.count))
  return (
    <div style={{ marginBottom: 16 }}>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, marginBottom: 2 }}>
          <span style={{ width: 180 }}>{r.label}</span>
          <div style={{ flex: 1, background: COLORS.border, height: 12, position: 'relative' }}>
            <div style={{ width: `${(r.count / max) * 100}%`, height: '100%', background: COLORS.fail }} />
          </div>
          <span style={{ width: 40, textAlign: 'right', color: COLORS.muted }}>{r.count}</span>
        </div>
      ))}
    </div>
  )
}

export function ResponsiveTrend({ history }: { history: HistoryItem[] }) {
  // Sort oldest-first for chart
  const asc = [...history].sort((a, b) => a.date.localeCompare(b.date))

  const overallData = asc.map((h, i) => ({ x: i, y: h.overallScore, labelX: h.date }))

  const perVp = ['mobile', 'tablet', 'laptop', 'desktop']
  const perVpSeries = perVp.map(name => ({
    name,
    data: asc.map((h, i) => ({ x: i, y: h.viewports?.[name]?.score ?? 0, labelX: h.date })),
  }))

  const failCounts: Record<string, number> = {}
  for (const h of history) {
    if (h.worstFailure?.check) failCounts[h.worstFailure.check] = (failCounts[h.worstFailure.check] || 0) + 1
  }
  const failRows = Object.entries(failCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count }))

  const byArchetype: Record<string, { total: number; n: number }> = {}
  for (const h of history) {
    const k = h.archetype || 'unknown'
    if (!byArchetype[k]) byArchetype[k] = { total: 0, n: 0 }
    byArchetype[k].total += h.overallScore
    byArchetype[k].n += 1
  }
  const archRows = Object.entries(byArchetype)
    .map(([k, { total, n }]) => ({ archetype: k, avg: (total / n).toFixed(1), n }))
    .sort((a, b) => parseFloat(a.avg) - parseFloat(b.avg))

  const worstBuilds = [...history]
    .filter(h => h.overallScore <= 3)
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 10)

  return (
    <div>
      <LineChart data={overallData} label={`Overall score (last ${asc.length} builds)`} />
      {perVpSeries.map(s => (
        <LineChart key={s.name} data={s.data} label={`${s.name} score`} />
      ))}

      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4, marginTop: 16 }}>Failure types</div>
      <BarChart rows={failRows} />

      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4, marginTop: 16 }}>Worst by archetype</div>
      <table style={{ fontSize: 11, borderCollapse: 'collapse' }}>
        <thead><tr><th style={{ textAlign: 'left', padding: 4 }}>archetype</th><th style={{ padding: 4 }}>avg</th><th style={{ padding: 4 }}>n</th></tr></thead>
        <tbody>{archRows.map(r => (
          <tr key={r.archetype}><td style={{ padding: 4 }}>{r.archetype}</td><td style={{ padding: 4 }}>{r.avg}</td><td style={{ padding: 4 }}>{r.n}</td></tr>
        ))}</tbody>
      </table>

      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4, marginTop: 16 }}>Worst recent builds</div>
      <ul style={{ fontSize: 11, paddingLeft: 16 }}>
        {worstBuilds.map(b => (
          <li key={b.buildId}>
            <a href={`/dev?date=${b.date}&buildId=${b.buildId}`} style={{ color: COLORS.cyan }}>
              {b.date} · {b.archetype || '—'} · {b.overallScore}/5
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Manual smoke test**

Navigate to `http://localhost:5173/dev/responsive`. Expect: line chart(s), failure-type bar chart, archetype table, worst-builds list. If there's no history yet, components render with "no data" placeholders or empty states — that's fine.

- [ ] **Step 5: Commit**

```bash
git add app/routes/dev.responsive.tsx \
        app/components/responsive-trend.tsx \
        app/server/archive-impl.ts
git commit -m "feat(dev): /dev/responsive trend dashboard"
```

---

## Task 20: E2E tests

**Files:**
- Create: `tests/e2e/dev-responsive-panel.spec.ts`
- Create: `tests/e2e/dev-responsive-trend.spec.ts`

- [ ] **Step 1: Write rating-panel e2e test**

Write `tests/e2e/dev-responsive-panel.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('responsive card renders when metrics exist', async ({ page }) => {
  // Precondition: there must be at least one build in archive/ with responsive-metrics.json.
  // CI should plant a fixture before this runs if no natural build exists.
  await page.goto('/dev')

  const card = page.getByText('Responsive Score').first()
  await expect(card).toBeVisible({ timeout: 5000 })

  // Four viewport thumbs
  const thumbs = page.locator('img[src*="/viewports/"]')
  await expect(thumbs).toHaveCount(4)
})
```

- [ ] **Step 2: Write trend e2e test**

Write `tests/e2e/dev-responsive-trend.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('/dev/responsive renders all sections', async ({ page }) => {
  await page.goto('/dev/responsive')
  await expect(page.getByText('Overall score').first()).toBeVisible()
  await expect(page.getByText('Failure types').first()).toBeVisible()
  await expect(page.getByText('Worst by archetype').first()).toBeVisible()
  await expect(page.getByText('Worst recent builds').first()).toBeVisible()
})
```

- [ ] **Step 3: Run e2e tests**

Run: `pnpm exec playwright test tests/e2e/dev-responsive-panel.spec.ts tests/e2e/dev-responsive-trend.spec.ts`
Expected: PASS (or "no metrics yet" skip if archive is empty — note in test results).

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/dev-responsive-panel.spec.ts tests/e2e/dev-responsive-trend.spec.ts
git commit -m "test(responsive): e2e for dev rating card + trend dashboard"
```

---

## Task 21: Full suite run + push PR

- [ ] **Step 1: Run full unit + integration suite**

Run: `pnpm test`
Expected: all tests pass (previous 253 + new scorer + screenshotter + history + selector tests).

- [ ] **Step 2: Run e2e suite**

Run: `pnpm exec playwright test`
Expected: all pass.

- [ ] **Step 3: Push branch and open PR**

```bash
git push -u origin feat/responsive-design
gh pr create --title "feat: responsive design measurement + feedback loop" --body "$(cat <<'EOF'
## Summary
- Measure every daily build at 4 viewports (360 / 768 / 1024 / 1440)
- Score horizontal overflow, clipping, header overlap, body size, tap targets, line length
- Inject yesterday's worst failure into today's prompt (retired by #479; see Phase 4)
- New /dev rating card + /dev/responsive trend dashboard
- Mobile-first responsive section in unified-designer.md + per-seed strategies

Spec: `docs/superpowers/specs/2026-04-17-responsive-design.md`
Plan: `docs/superpowers/plans/2026-04-17-responsive-design.md`

## Test plan
- [ ] pnpm test passes (unit + integration)
- [ ] pnpm exec playwright test passes
- [ ] Trigger one local daily-redesign — verify responsive-metrics.json written
- [ ] Load /dev and /dev/responsive — verify rendering

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review notes

After writing this plan:

**Spec coverage:**
- § Architecture → Tasks 1–11 (measurement), 14–15 (UI), 16–18 (loop), 19 (dashboard) ✓
- § Prompt Layer → Tasks 12–13 ✓
- § Measurement Layer → Tasks 1–11 ✓
- § Surfacing Layer → Tasks 14–15, 19 ✓
- § Feedback Loop → Tasks 16–18 ✓
- § Testing Strategy → Tasks 1–9, 16, 17, 20 ✓
- § Rollout Plan Phase 1–5 → covered by task grouping ✓

**Placeholder scan:** no TBD/TODO found. Each step has actual code or exact commands.

**Type consistency:**
- `scoreResponsive(url, viewports, opts)` signature consistent across Tasks 2–8 ✓
- `screenshotViewports(url, viewports, outDir, opts)` signature consistent in Tasks 9 + 10 ✓
- `selectRecentFailure({ history, todayArchetype, today })` matches Task 17 definition + Task 18 call ✓
- `readResponsiveHistory({ root, limit })` matches Task 16 definition + Task 18 call ✓
- `responsive-metrics.json` schema consistent across writer (Task 10), selector (Tasks 16/17), and UI (Tasks 15/19) ✓

**Unused prior agreements:**
- "Re-score" button in /dev (Section 4 of spec) is NOT in the plan. **Decision:** deferred to future work — backfill for ~6 historical builds is small; we can script it manually once metrics ship. Adding it now inflates Phase 3 scope. Noted in spec as future work via re-score endpoint; plan explicitly does not create `/api/dev-rescore`.
