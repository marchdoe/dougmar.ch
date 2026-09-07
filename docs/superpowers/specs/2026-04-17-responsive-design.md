# Responsive Design System — Design Spec

**Date:** 2026-04-17
**Author:** Doug March + Claude (brainstorming)
**Branch:** `feat/responsive-design`
**Status:** Design approved; awaiting implementation plan.

## Problem

The pipeline currently produces designs that are strong on desktop (best:
24/25 on 2026-04-14 Specimen) but break catastrophically on mobile and
inconsistently on tablet. Observed failures across the last 6 builds:

- **2026-04-13 Specimen** — "DOUG MARCH" hero overflows 360px, rendering
  as "DOUG / MARC"
- **2026-04-17 Index** — fixed left sidebar consumes 40% of 360px
  viewport; "Spaceman" hero clips horizontally
- **2026-04-10 Gallery Wall** — header cramming (logo + nav + title +
  date + pill) produces unreadable overlap at 360px; 3-column grid
  survives tablet but is clearly not designed for it

Zero responsive guidance exists in any prompt file today. "viewport"
appears only as metaphor ("first viewport"); no mention of breakpoints,
`@media`, `clamp()`, or mobile/tablet strategy. The mobile failures are
not bugs — they are the model doing what it was asked to do.

## Goals

1. Designs look great on mobile (360px), tablet (768px), laptop
   (1024px), and desktop (1440px) — not just desktop.
2. Measurement is automatic and continuous — every build is scored.
3. Failures feed back into tomorrow's prompt so the system improves
   over time without constant manual prompt edits.
4. Nothing blocks the pipeline. Soft-fail throughout.

## Non-Goals

- Hard-failing builds on responsive violations. Daily redesign ships
  regardless; scores inform future prompts and human review.
- Retooling the chassis / preset system. Responsive is handled in CSS
  by the designer, not in the token layer.
- 320px / 1440px+ edge case perfection. Four representative viewports
  (360, 768, 1024, 1440) are the sample points.
- Composition judgment ("does the mobile specimen still feel like a
  specimen?"). That remains a human rating in /dev.

## Design Decisions (locked during brainstorming)

| # | Decision | Chosen |
|---|---|---|
| 1 | Enforcement philosophy | Soft-fail + metrics reporting; no build-killer checks |
| 2 | What counts as broken | Layout integrity (scroll, clipping, overlap) + readability (body size, tap targets, line length) auto-checked; composition stays human-rated |
| 3 | Breakpoints | Industry-common: 360, 768, 1024, 1440 |
| 4 | Mobile-first guidance location | `unified-designer.md` **plus** per-seed collapse strategies |
| 5 | Metrics surface | Archive JSON + /dev panel shows 4 viewport screenshots + new `/dev/responsive` trend dashboard |
| 6 | Timing | Automatic in pipeline every build + on-demand "Re-score" button for backfill |
| 7 | Approach | Approach 2 — philosophy + measurement + self-improving prompt feedback loop |

## Architecture

Four new units, each with one clear job:

1. **`viewport-screenshotter`** — given a URL and viewports, produce PNGs.
   Does not know about scoring or archives.
2. **`responsive-scorer`** — given a URL and viewports, run DOM
   inspection and return a metrics object. Does not know about
   screenshots, archives, or prompt injection.
3. **`prompt-feedback-selector`** — given a history of metrics JSON,
   pick a cautionary example to inject into today's prompt. Does not
   know how scoring works, just reads the output.
4. **`/dev` UI** — reads metrics + screenshots from disk; pure display.

The metrics JSON schema is the contract between layers. Change a scorer
rule without touching /dev; change display without touching the
pipeline.

Data flow:

```
pipeline → viewport-screenshotter → 4 PNGs + responsive-metrics.json
                                         ↓
                      archive/YYYY-MM-DD/build-{id}/
                      public/archive/YYYY-MM-DD/screenshots/
                                         ↓
                         /dev UI (card + trend dashboard)
                                         ↓
                 prompt-feedback-selector (next day's prompt)
```

## Prompt Layer

### Edit 1 — `scripts/prompts/unified-designer.md`

New section slotted after "Accessibility", before "Required Files":

```markdown
## Responsive — Mobile-First, Not Desktop-Squashed

You are designing for three characters: phone (360px), tablet (768px),
laptop/desktop (1024px / 1440px). Start your composition at 360px and
enhance upward. A design that looks great on desktop but overflows or
clips on mobile is a failed build regardless of how striking the
desktop view is.

**Mobile-first means:**
- Default CSS targets 360px. Use `@media (min-width: ...)` to add
  complexity at larger widths — never subtract at smaller.
- Large type uses `clamp()` or `vw` with caps, not fixed px. A
  specimen-scale hero at 120px on desktop should collapse to ~48px on
  mobile.
- Fixed sidebars, multi-column grids, and persistent nav rails must
  have a collapse strategy below the tablet breakpoint (usually
  stacking into a single column).
- Header chrome (logo + nav + signals) must not overlap at 360px. If
  everything can't fit, stack or hide behind a toggle.
- Touch targets ≥ 44×44px on any viewport ≤ 768px.
- Body text ≥ 16px at all viewports.
- Line length ≤ 75 characters at all viewports.

**What gets checked automatically:**
Every build runs at 360 / 768 / 1024 / 1440 and is scored on:
horizontal scroll, content clipping, header overlap, body text size,
tap-target size, line length. Failures are logged and fed back into
tomorrow's prompt as negative examples.
```

### Edit 2 — `scripts/utils/prompt-builder.js`

Inject a "Lesson from Recent Builds" section conditionally:

```js
const recentLesson = await selectRecentFailure({
  history: await readResponsiveHistory(),
  today: new Date(),
})
if (recentLesson) {
  userPrompt += `\n\n## Lesson from Recent Builds\n\n${recentLesson}`
}
```

### Edit 3 — per-seed collapse strategies

Each archetype seed gains a short (2–4 line) "Mobile strategy" section:

| Seed | Mobile strategy |
|---|---|
| **specimen.md** | Specimen fills viewport width; label block stacks below, not beside. Hero type uses `clamp(48px, 14vw, 180px)`. |
| **broadsheet.md** | Masthead stacks vertically (logo → name → nav pill row → date). Columns collapse to single column with masthead-style rules. |
| **gallery-wall.md** | Wall becomes a vertical scroll of framed artifacts. Scale is relative to viewport width, not absolute. |
| **split.md** | Two halves become two stacked sections; divider becomes a horizontal rule. Asymmetry carries via aspect-ratio difference. |
| **scroll.md** | Signal marginalia collapses to inline captions, not floating pull-quotes. |
| **stack.md** | Bands use `min-height` tokens that scale down — no `100vh` without a mobile fallback. |
| **poster.md** | Retains single dominant element; scale hero via `clamp()`. Secondary info stays at poster's bottom. |
| **index.md** | Table rows collapse to stacked cards at ≤ 768px. Year/role become inline labels, not columns. |

Token-designer.md is untouched. The chassis and preset system stay as
they are — responsive is handled in CSS by the unified designer, not in
tokens.

## Measurement Layer

### `scripts/utils/viewport-screenshotter.js`

```js
/**
 * Screenshot a URL at multiple viewports.
 * Reuses a single browser instance; resizes page between viewports.
 *
 * @param {string} url
 * @param {Array<{name, width, height}>} viewports
 * @param {string} outDir - absolute path
 * @returns {Promise<Array<{name, width, height, path}>>}
 */
export async function screenshotViewports(url, viewports, outDir) { ... }
```

Does not know about archive dirs, metrics, or scoring. Writes PNGs to
the directory given. Single `chromium.launch`, one `page.setViewportSize`
call per viewport (not a new page).

### `scripts/utils/responsive-scorer.js`

```js
/**
 * @param {string} url
 * @param {Array<{name, width, height}>} viewports
 * @returns {Promise<ResponsiveMetrics>}
 */
export async function scoreResponsive(url, viewports) { ... }
```

Each check runs inside the page context via Playwright:

- **horizontalScroll** — `document.documentElement.scrollWidth > window.innerWidth`
- **clippedElements** — any element whose `getBoundingClientRect().right`
  exceeds `window.innerWidth + 1` (the +1 absorbs subpixel rounding)
- **headerOverlap** — bounding-rect intersection across direct children
  of the first `<header>` or nav container
- **bodyTextSize** — minimum computed `font-size` of text nodes inside
  `<main>` or `<body>`
- **tapTargetFailures** — `<a>`, `<button>`, `[role=button]` elements
  with bounding box < 44×44 at viewports ≤ 768
- **lineLengthFailures** — rendered paragraphs whose line count × line
  length implies > 75 characters on any line (approximation via
  `paragraph.textContent.length / visualLines`)

### Metrics JSON schema

Written to `archive/YYYY-MM-DD/build-{id}/responsive-metrics.json`:

```json
{
  "buildId": "1776...",
  "date": "2026-04-17",
  "archetype": "Specimen",
  "viewports": {
    "mobile":  { "width": 360,  "height": 640,  "checks": { ... }, "score": 2 },
    "tablet":  { "width": 768,  "height": 1024, "checks": { ... }, "score": 4 },
    "laptop":  { "width": 1024, "height": 768,  "checks": { ... }, "score": 5 },
    "desktop": { "width": 1440, "height": 900,  "checks": { ... }, "score": 5 }
  },
  "overallScore": 2,
  "worstFailure": {
    "viewport": "mobile",
    "check": "horizontalScroll",
    "detail": "document.scrollWidth was 540, viewport 360 — hero type overflowed",
    "suggestedCause": "fixed font-size on hero; use clamp()"
  }
}
```

- Per-viewport `score` is 1–5, inverted from failure count (0 failures = 5, 1 = 4, 2 = 3, 3 = 2, ≥4 = 1).
- `overallScore` = minimum across viewports (weak-link metric).
- `worstFailure` = the single worst individual check; what gets injected into tomorrow's prompt.

### Orchestration

In `scripts/daily-redesign.js`, after the existing `captureSnapshot()` call:

```js
const viewports = [
  { name: 'mobile',  width: 360,  height: 640 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'laptop',  width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
]
try {
  await screenshotViewports(previewUrl, viewports, buildDir)
  const metrics = await scoreResponsive(previewUrl, viewports)
  await writeFile(
    path.join(buildDir, 'responsive-metrics.json'),
    JSON.stringify(metrics, null, 2)
  )
} catch (err) {
  console.warn(`  responsive scoring failed (non-blocking): ${err.message}`)
}
```

Non-blocking. Pipeline does not fail if scoring fails.

## Surfacing Layer

### Rating panel card (`app/dev-panel.tsx`)

New card rendered above the existing human rating inputs when
`responsive-metrics.json` exists for the selected build:

- Header row: "Responsive Score N/5"
- Row of 4 thumbnail screenshots, labeled with viewport + score
- Click a thumbnail → lightbox full-size
- Failure list in plain English (same strings that feed the prompt)

Screenshots are copied to `public/archive/YYYY-MM-DD/screenshots/{viewport}-{buildId}.png`
by the archive step. /dev references them via normal static path.

### New route `/dev/responsive`

New file `app/routes/dev.responsive.tsx`. Four sections:

1. **Overall score over time** — line chart, last 30 builds, 7-day moving average as a dashed line
2. **Per-viewport score over time** — 4-line chart (mobile, tablet, laptop, desktop)
3. **Failure types (last 30 builds)** — horizontal bar chart of check-type frequencies
4. **Worst by archetype** — table, avg score per archetype, build count
5. **Worst recent builds** — clickable list; each row links to the rating panel for that build

Charts are hand-rolled inline SVG (zero deps) to match the minimal-dep
aesthetic of /dev. No visx / recharts.

Data loading via a new server function `readResponsiveHistory()` in
`app/server/archive-impl.ts`. Scans `archive/*/build-*/responsive-metrics.json`,
returns the last N builds.

### "Re-score" button

On the rating panel, a button calls `/api/dev-rescore` which runs the
screenshotter + scorer against the selected build's archived HTML
(served from public/archive). Used for backfilling historical metrics
and for re-running after scoring rules change.

## Feedback Loop (retired)

This section specified a selector that picked a cautionary example from
recent build history and injected it into the next prompt, gated behind
an env var. Issue #479 found no workflow ever set that variable, the
archetype matching it depended on was never exercised, and
`scripts/utils/lessons.js` already carries the same findings to every
agent — so the selector, its history reader, and the tracking field on
`responsive-metrics.json` were all removed.

## Testing Strategy

### Unit tests (fast, no browser)

- `tests/utils/responsive-scorer.test.js` — each check against jsdom
  fixtures:
  - `overflow-horizontal.html` → `horizontalScroll: true`
  - `clipped-hero.html` → `clippedElements.length === 1`
  - `tiny-body.html` → `bodyTextSize: { min: 12 }`
  - `small-tap-targets.html` → `tapTargetFailures.length > 0`
  - `clean.html` → all checks pass
- `tests/utils/prompt-feedback-selector.test.js` — synthetic history
  arrays exercising each selection branch (cold-start, matching
  archetype, fallback, reuse-cap, age-cap, all-null).

### Integration tests (real browser, bumped timeout)

- `tests/scripts/viewport-screenshotter.test.js` — Playwright against a
  known fixture on a local static server; assert 4 PNGs with expected
  dimensions. `testTimeout: 30_000`.
- `tests/scripts/responsive-metrics-pipeline.test.js` — feed synthetic
  build through screenshotter + scorer + archiver; assert
  `responsive-metrics.json` shape. `testTimeout: 30_000`.

### E2E tests (Playwright against dev server)

- `tests/e2e/dev-responsive-panel.spec.ts` — rating panel renders card,
  all 4 screenshots visible, failure list populated.
- `tests/e2e/dev-responsive-trend.spec.ts` — /dev/responsive renders
  all 4 chart sections; clickable build rows navigate correctly.

### Mocking rule

Unit tests MUST NOT launch browsers. Per the recent CI fix
(`archiver-color-scheme.test.js`), browser-launching operations must
bump `testTimeout` or be mocked. Only the two integration tests named
above launch real browsers.

## Rollout Plan

Five phases. Each ships independently, each is valuable on its own,
each is rolled back without touching the others.

| Phase | Scope | Rollback |
|---|---|---|
| 1. Measurement | `viewport-screenshotter` + `responsive-scorer` + orchestration in `daily-redesign.js` + extend `archiver.js` to copy screenshots to `public/` | revert commit, delete 2 files |
| 2. Prompt layer | `unified-designer.md` + 8 seed files | revert prompt files |
| 3. /dev rating card | `app/dev-panel.tsx` card renders when metrics exist | revert component |
| 4. Feedback loop | `prompt-feedback-selector.js` + injection in `prompt-builder.js`, gated behind an env var (retired by #479) | flip env var off |
| 5. Trend dashboard | `app/routes/dev.responsive.tsx` + `readResponsiveHistory()` | delete route file |

### Sequencing reasoning

- Measurement first — the system is worthless without data, and we
  need the baseline to prove prompt changes worked.
- Prompt layer second — the change most likely to move the needle.
- /dev card third — humans can see what's happening before the
  dashboard is ready.
- Feedback loop fourth — needs a few days of metrics to pull from
  without null-returning.
- Dashboard last — needs history (~10+ builds) to be visually
  meaningful.

### Gate between phases

- After phase 1: run 3–5 builds, verify metrics written correctly.
- After phase 2: run 5–7 builds, check scores improve vs baseline.
- If phase 2 shows no improvement: rethink the prompt layer before
  adding the feedback loop. Bad prompts don't get fixed by looping
  them back into themselves.

## Open Questions

None at spec time. All scope decisions locked in brainstorming. If
implementation surfaces ambiguity, resolve in the implementation plan,
not here.

## Future Work (out of scope)

- Container queries (`@container`) for components that should respond
  to their parent, not the viewport. Useful once designs use more
  nested compositional elements.
- Fluid typography tokens baked into the chassis — would remove the
  need for the designer to remember `clamp()`. Deferred until we see
  whether prompt guidance alone gets us there.
- Real-device testing (Playwright has device emulation for touch +
  retina). Current plan only tests viewport widths. Device emulation
  may catch failures the current approach misses (hover assumptions,
  touch jitter).
- Archetype-specific responsive rules in the scorer (e.g., a Specimen
  build should fail if the specimen element shrinks below 60% of
  viewport width at mobile). Deferred until general rules mature.
