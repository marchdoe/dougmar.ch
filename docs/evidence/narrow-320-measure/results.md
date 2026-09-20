# 320 vs 360, the last ten nights

What this measures: the surface gate's blocking geometry checks
(`scripts/utils/surface-gate.js`) run against the ten most recent frozen
nightly designs in `public/archive/`, at the gate's existing mobile rung
(360x640) and again at the width under review (320x640). Home, about, and
one work page (`spaceman.html`, present on every night) were measured for
each date. The script is `measure.mjs` in this directory; it imports
`evaluateMeasurement`, `collectSurfaceMetrics`, `findClippedElements`,
`findTapTargetFailures`, and `findSmallCopy` straight from
`surface-gate.js` rather than reimplementing them, and does not touch that
file. Raw per-page output is in `raw-results.json`.

Serving matches `playwright.config.ts`: a full `pnpm build` followed by
`vite preview` against `dist/`, the same way `tests/e2e/site-health.spec.ts`
reaches `/archive/<date>/index.html`. Each archived page ships with a fixed
`[data-archive-frame]` rail baked in by `scripts/utils/archive-seal.js` —
identical on every date, so it would blur the design-to-design comparison.
It's removed from the DOM right after load, before anything is measured.

Mid-word-break counts come from a probe not in `surface-gate.js` at all,
reimplemented in `measure.mjs` from the "no word breaks across lines" test
on `origin/fix/display-type-shred-gate` (PR #534): every word (a run of
letters/digits) is checked with `Range.getClientRects()`, and a word whose
rects land on more than one line counts as broken. Vertical `writing-mode`
and `hyphens: auto` are excluded, matching that branch.

One gap by design, not by oversight: `surface-gate.js`'s `measureRoute`
only runs the tap-target and small-copy advisory checks when
`viewport.width === 360` (line ~899). This script mirrors that rather than
patching it, so every "tap-target"/"small-copy" cell at 320 below is blank
— not because nothing is undersized there, but because the gate never asks.

## Results

| date | chassis | ratio | blocking @360 | blocking @320 | overflow px @360 | overflow px @320 | word breaks @360 | word breaks @320 |
|---|---|---|---|---|---|---|---|---|
| 2026-09-11 | space-mono-archivo | type-dominant | 0 | 4 clipped | 0 | 0 | 6 | 6 |
| 2026-09-12 | spectral-albert | field-dominant | 0 | 3 (1 overflow, 2 clipped) | 0 | 3 | 0 | 0 |
| 2026-09-13 | big-shoulders-atkinson | drenched | 0 | 1 clipped | 0 | 0 | 0 | 0 |
| 2026-09-14 | bitter-mulish | balanced | 1 clipped | 1 clipped | 0 | 0 | 3 | 9 |
| 2026-09-15 | anybody-franklin | type-dominant | 3 (1 overflow, 2 clipped) | 4 (1 overflow, 3 clipped) | 39 | 76 | 0 | 0 |
| 2026-09-16 | alfa-rubik | field-dominant | 6 (2 overflow, 4 clipped) | 8 (3 overflow, 5 clipped) | 50 | 90 | 0 | 3 |
| 2026-09-17 | zilla-worksans | drenched | 0 | 6 (3 overflow, 3 clipped) | 0 | 23 | 0 | 0 |
| 2026-09-18 | bricolage-manrope | balanced | 6 (1 overflow, 5 clipped) | 6 (1 overflow, 5 clipped) | 14 | 54 | 0 | 0 |
| 2026-09-19 | unbounded-figtree | type-dominant | 8 (3 overflow, 5 clipped) | 12 (3 overflow, 9 clipped) | 41 | 81 | 2 | 2 |
| 2026-09-20 | space-mono-archivo | field-dominant | 0 | 3 clipped | 0 | 0 | 6 | 9 |

"Blocking" counts error-severity findings only (`overflow`, `clipped` with
text, `running-copy`), summed across the three pages measured. Overflow px
is the worst of the three pages (`document.documentElement.scrollWidth`
minus the viewport width). A page can carry a clipped-element finding with
0px document overflow — an ancestor has `overflow: hidden`, so the box is
cut without the document itself scrolling; see the gate's own comment on
this at `surface-gate.js:201-212`.

## Finding types that only show up at 320

- **New document-level overflow on a page that was flush at 360.**
  2026-09-12 `/`: 0px overflow at 360, 3px at 320, with two new clipped
  `<SECTION>` elements ("Featured…Spaceman…" and "Selected work…FishSticks…")
  each landing 3px past the edge.
- **A clipped element with no document overflow at all, at either width.**
  2026-09-11 `/about`: a `<DIV>` holding "Bachelor of Fine Arts · Visual
  Communication and D…" lands 6px past the 320px edge, cut by a parent with
  `overflow: hidden`. `document.documentElement.scrollWidth` reads 320 at
  both widths, so nothing about total page width would ever catch this —
  only the per-element clip walk does.
- **The same clipped element on every route of a night that was clean at
  360.** 2026-09-20 `/`, `/about`, and `/work/spaceman` each cut off an
  `<A>Doug March</A>` link by 4px at 320. Zero clipped findings on any of
  the three at 360.
- **New mid-word breaks with none at 360.** 2026-09-14 `/about`: 0 breaks at
  360, 7 at 320 — "Consultant" at 32px needs 173px of column, "Communication"
  needs 250px, five others land the same way. The 360 page sets the same
  type in a column wide enough to hold every one of those words on one line.
- **A third clipped element joins two that were already there.** 2026-09-15
  `/`: at 360 two `<SPAN>` elements clip ("Experiment2008…" twice); at 320 a
  `<P>` holding "Deep in both. Not a generalist." also clips, 5px past the
  edge — a sentence that fit whole at 360.

## What the numbers say

Five of the ten nights (2026-09-11, -12, -13, -17, -20) ship with zero
blocking findings at 360. All five pick up new blocking findings at 320 —
not worse versions of an existing problem, but findings that don't exist at
360 at all. None of the ten nights are clean at 320; the pass rate goes from
5 of 10 to 0 of 10. On the five nights that already fail at 360, 320 mostly
deepens the same faults rather than adding new kinds — 2026-09-16's `/about`
goes from 50px to 90px of overflow on the same two clipped bio-line `<DIV>`s,
not a new element. Failures don't sort cleanly by chassis ratio: every ratio
bucket (type-dominant, field-dominant, drenched, balanced) has at least one
night that's clean at 360, and every bucket has at least one that already
fails there. The one pattern that does hold: both "balanced" nights
(bitter-mulish, bricolage-manrope) carry a blocking finding at 360 already,
before 320 enters the picture, while the other three ratios split roughly
evenly between clean-at-360 and already-broken. Separately, the tap-target
and small-copy advisories that fire on 8 of the 10 nights at 360 fire on
none of them at 320, because the gate only runs that check at width 360 —
moving the narrow-viewport contract to 320 without widening that guard would
mean the smallest tap targets on the narrowest screen go unmeasured.

## Screenshots

- `best-320-2026-09-13.png` — 2026-09-13, big-shoulders-atkinson/drenched,
  home page at 320: 1 blocking finding total across all three pages, the
  fewest of the ten nights.
- `worst-320-2026-09-19.png` — 2026-09-19, unbounded-figtree/type-dominant,
  home page at 320: 12 blocking findings total, the most of the ten nights.

## What didn't work as described

Nothing blocked the approach. Two adjustments from the brief, both noted
inline above: the tap-target/small-copy advisory gap is real and left
unpatched per instructions, and overflow can read 0px on a page that still
has clipped content, because the gate's clip check and its document-overflow
check answer different questions (the former follows an `overflow: hidden`
ancestor, the latter doesn't need one to fire).
