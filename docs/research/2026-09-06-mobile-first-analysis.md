# Where the phone gets lost: a mobile-first analysis of the daily redesign

**Date:** 2026-09-06
**Status:** analysis only. Nothing in the pipeline changed in this session. Evidence captures are in `docs/evidence/2026-09-06-mobile-first/`.

## The short version

The designer's phone page is usually fine. The page that ships is not, and nobody in the pipeline looks at what ships at 360.

Last night's mockup at 360 is 2101px tall and reads as a page: "6–0." then "Shutout." then the lede, then the box score. The live page at the same width is 5486px tall. "Shutout" renders as "Sh", the featured project "Spaceman" as "Sp", and the lede is set at display size. The night before, the mockup critic approved the phone in writing ("the radial idea survives intact") and the build then overflowed 360 by 21px with the work list severed.

Doug's two ratings since the phone became visible both say the same thing. 09-02: "mobile design was bad, home page did not look right, interior pages were visually broken on both mobile and desktop." 09-04: "Again failed on mobile, some of the text is too big for the size that was chosen. Layout is strange at the bottom, seems like there is a sidebar all by itself." The ask in that second rating is the brief for this document: "Try focusing more on mobile first design, and growing, rather than looking great on the desktop and shrinking the design per the viewport."

The measured mobile score over the only three instrumented nights went 4, 3, 1.

## What ships at 360

Three captures, all taken this afternoon or pulled from the archive of the shipped build.

**2026-09-06, mockup versus build.** `0906-mockup-360-full.jpg` beside `0906-live-home-360-full.jpg`. Same design, same day, same width. The mockup holds the score, the word, the lede and the stats in the first 900px. The build spends its first 640px on "6–" over "0." over "Sh", pushes the lede to display size, and repeats the trick on "Spaceman" further down. The archived critic crop, `0906-shipped-360-fold.jpg`, is exactly the first 640px of that build: the responsive metrics for the night record one clipped element, a 7px span reading "Final".

**2026-09-06, the about page.** `0906-live-about-360-full.jpg` is 9361px tall. The hero "4 Holes-in-one." is cut to "Ho / in / on". The intro paragraph is set as display type. Below it, the timeline runs as a narrow column of small type with an empty rail to its right, which is the "sidebar all by itself" from the 09-04 rating, one night later and on a different page. No critic has ever seen `/about` at 360.

**2026-09-05, the fold with no hero.** `0905-shipped-360-fold.jpg` is what the critic saw of the phone: a top bar with the date overlapping the name, a nav row, and three signal rows on gold. The hero phrase, "Mastery is a function of time and intense focus", is below the fold at 360 and also below it at 1440 (`0905-shipped-1440.jpg`). The mockup critic's approval of the phone that night was written against the mockup, not the build.

## Where the phone is lost

Six places, in the order they occur during a run.

### 1. The composition has no mobile form

The Art Director declares eight axes: columns, axis, symmetry, hero_zone, density, rhythm, shell_posture, field_ratio. Every value description in `scripts/utils/composition-grammar.js` is written for a wide canvas ("the upper-left quadrant", "a vertical rail"). The composition mandate picks the day's tuple on per-axis recency alone, so `radial` + `crowded` + `irregular-twelve` arrived on 09-05 because `diagonal` and `vertical` had run recently, with no check that a radial orbit has a 360px story.

Across the five most recent archived briefs, no `adBrief`, `brief.md`, `composition.json` or `header.json` carries a single narrow-width instruction. The Art Director's self-check asks four questions and all four are about 1440x900. Interior pages are five to fifteen lines of prose in `===INTERIOR_NOTES===`, which is where the display-sized intro paragraphs keep coming from. This is issue #452.

### 2. The engineer inverts the breakpoints

Round 1 on 09-06 overflowed 360 by 1311px on every route, `/`, `/about`, `/work`, `/experiments` and all seven case studies. That is the same fault as 09-04's 969px, and it happened after PR #455 told the engineer that the mockup's unqueried CSS is the phone and each `min-width` block is what a wider viewport adds. The repair loop fixed it, but it spent the round on it, and the round that follows a repair is the one nothing re-judges (see 5).

### 3. The type steps were fixed pixels

Until today, only `hero` was a clamp. `2xl` through `5xl` were fixed rems, and on the Alfa Slab chassis that shipped last night `4xl` was 287px and `5xl` 464px at every width. Any heading that reached for one of them was 287px wide on a 360px phone. That is "Sh". PR #462, merged this afternoon and not yet run, makes those four steps fluid with the same machinery `hero` uses, identical at 1440 and compressed at 360. It leaves two things it names itself: `xl` is still fixed at 67.8px, and `hero` still lands at about 110px at 360 on the three ratio-1.618 chassis, where the four fluid steps now compress to within 1.5% of each other and the display hierarchy flattens.

### 4. The gate cannot see a word wider than its box

`findClippedElements` compares each element's right edge to the viewport. A single word that overflows its block inside a parent with `overflow: hidden` is not an element and moves no box, so "Sh" and "Sp" shipped while the metrics reported one 7px span. The surface gate and the responsive scorer share this detector, so both are blind to it. Doug's "text is too big for the size that was chosen" is this class of fault, and the pipeline has no instrument for it.

### 5. Critics see 640px of the phone, once

Both critics receive exactly one 360 image: the homepage, viewport-clipped to the first 640px, light scheme only, at device scale factor 1 (`CRITIC_MOBILE_VIEWPORT` in `scripts/utils/snapshot.js`). `/about` is never captured at 360. Case studies are captured at 1440 only. The header crop the critics get is at 2x; the phone is not.

The screenshot critic runs once, before the repair rounds. On 09-06 the sequence was mockup critic REVISE then APPROVE, surface gate REVISE, screenshot critic REVISE, repair, surface gate REVISE again, ship. The build that shipped was never seen by a critic at any width. On 09-04 the gate's round-2 findings were byte-identical to round 1 and it shipped on a REVISE.

### 6. Nothing at 360 is fatal, and the numbers go unread

The surface gate forces one extra engineer round and then the build ships whatever the second measurement says. The responsive scorer is record-only, and its 16px body-text floor has failed every night since the 11.2px small step landed in #257, so its score is noise by construction. Tap targets, line length and header overlap are measured at 360 and reach no agent; their only consumer is the local dev panel. The explicit feedback loop, `RESPONSIVE_FEEDBACK_LOOP`, is gated on an env var set in no workflow and on an archetype string that is "descriptive only, never validated". Every archived `responsive-metrics.json` shows `usedInPromptFor: []`.

Hand-written routes have no path at all. `/work` and `/experiments` are measured, their owner resolves to `human`, and the pipeline writes a `NEEDS-HUMAN` entry into `verdicts.json` that nothing reads. `grep NEEDS-HUMAN` hits one line in the repo, the write site. It is also written inside the branch that only runs when the critic says REVISE, so a hand-written route can break at 360 on a night the critic says SHIP and leave no record. `/work` has overflowed 360 by 70px every night since instrumentation began (#464).

## What is already in flight

| change | state | what it covers |
|---|---|---|
| #453 clipping as a gate finding, both critics get a 360 render | merged 09-04 | finding 5, partially |
| #455 the mockup's breakpoints are the design | merged 09-04 | finding 2, evidently not enough |
| #462 display steps fluid at every width | merged 09-06, unrun | finding 3, the "Sh" class |
| #452 the composition's mobile clause | open, needs a decision | finding 1 |
| #464 `/work` overflows 360 and shows a lone rail | open | finding 6, the human half |

Tonight is the first night on #462. It should clear the fixed-pixel headings and tell us how much of the phone problem was type steps alone. My guess is about half.

## What to do, in order

1. **Let tonight run untouched.** One night of #462 before anything else changes, so its effect is measurable.

2. **Teach the gate to see text overflow.** For every text-bearing element at 360, compare `scrollWidth` to `clientWidth` and report an element whose text is wider than its box as `clipped`. Same detector for both the gate and the scorer, since they already share one. This is the smallest change that would have caught "Sh", "Sp" and "Ho / in / on".

3. **Re-judge the final build.** After the last repair round, run the screenshot critic's phone section again on the build that will ship. If it still says REVISE, that is the moment for the decision in the next section. Today the shipped state is the one state nobody sees.

4. **Give the critics the whole phone.** Full-page 360 capture of `/` at device scale factor 2, plus 360 captures of `/about` and one case study. The image ceiling is eight; the calibration reference and the second route capture are the ones to drop, not the phone. Put the 360 capture in the rating issue beside the 1440 one, so the grade is against the phone as well.

5. **Settle #452.** Add a mobile clause the designer must render and a critic can measure. The shape I would build: a ninth axis, `collapse`, with a fixed value list (stack, reorder, hero-only, rail-to-band, split-to-sequence), plus a required `===MOBILE===` block naming what carries the idea at 360, the stacking order, the hero step at 360, and whether the hero sits in the first fold. The mockup designer's self-check then has numbers, the mockup critic has a declaration to check the phone image against, and the uniqueness index gains a field. A free-prose block would be cheaper and would drift the way the lane files drifted before #255.

6. **Finish the chassis.** Make `xl` fluid, decide the 360 hero floor per chassis rather than the 64px catalog floor, and retire or retune the 16px body check so the scorer stops failing by construction.

7. **Fix the hand-written routes and route the NEEDS-HUMAN verdict.** `/work` needs a single-column track at base and a decision about the rail (#464); `/experiments` clips by 8px. Then have NEEDS-HUMAN open or comment on an issue instead of writing a verdict entry nobody reads, and write it regardless of what the critic said.

8. **Feed the phone back to the Art Director.** The lessons block already carries `@360` gate findings to the designer and engineer, but it is built after the Art Director call, so the AD never learns what its last composition became on a phone. Move the block earlier or add a one-line mobile lesson to the AD's inputs.

Items 2 through 4 are pipeline plumbing, a day's work together, and they make the phone visible on the night it ships. Item 5 is the design change and the one that answers Doug's "growing rather than shrinking" directly. Items 6 through 8 are follow-ups that stop the standing taxes.

## Decisions needed

1. When 360 still has errors after the last repair round, should the night fail with no new design, or ship with the fault logged as it does now? Failing makes the gate real. Shipping keeps the streak and the archive record.
2. For #452, a ninth composition axis with a fixed value list, or a free-prose block the critic judges? My recommendation is the axis.
3. Who fixes `/work` and `/experiments` at 360. They are outside the agents' ownership by design, so it is a person, and it can be done today.

## Appendix: where each fact lives

- Critic phone image: `scripts/utils/snapshot.js` (`CRITIC_MOBILE_VIEWPORT`, `captureViewportJpeg`), `scripts/agents/mockup-critic.js`, `scripts/agents/screenshot-critic.js`.
- Gate rules and clipped detector: `scripts/utils/surface-gate.js` (`evaluateMeasurement`, `findClippedElements`, `ownerForSurface`).
- Scorer and its thresholds: `scripts/utils/responsive-scorer.js`, called from `scripts/utils/archiver.js`.
- Feedback loop: `scripts/design-agents.js` around the `RESPONSIVE_FEEDBACK_LOOP` guard, `scripts/utils/prompt-feedback-selector.js`, `scripts/utils/lessons.js`.
- Composition grammar and mandate: `scripts/utils/composition-grammar.js`, `scripts/utils/composition-mandate.js`.
- Chassis steps: `scripts/utils/chassis.js`, `elements/chassis-preset.ts` on main before #462.
- Ownership: `scripts/utils/site-context.js` (`MUTABLE_FILES`, `ENGINEER_FILES`).
- Archive: `archive/2026-09-0{2,4,5}/build-*/responsive-metrics.json`, `verdicts.json`, `viewports/mobile.png`; 2026-09-06 on `origin/main` only.
- Ratings: issues #409 (09-02) and #451 (09-04).
