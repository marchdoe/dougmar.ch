# Phone filmstrip at rest, on the ten sealed nights (#569 follow-up)

A full-page capture never scrolls, so a section on an `animation-timeline: view()` reveal stays at its 0% keyframe, `opacity: 0`, below the first fold. The phone filmstrip took no account of that. #618 fixed it for the new desktop filmstrip by putting the page at rest with `reducedMotion: 'reduce'`. This does the same for the phone filmstrip, which the critic is sent for `/`, `/about` and the first case study, and for the mockup.

## What was measured

Every page of the ten sealed nights 2026-09-11 to 2026-09-20 (nine a night, 90 pages), served from `public/archive/<date>/` with the archive frame removed, captured as the phone filmstrip captures (360 wide, full page) four ways:

- as shipped, motion allowed (what the filmstrip did until now)
- reduced motion on
- reduced motion on, with the chassis rule `animation-name: none` added under the preference, which is what every design carries from 2026-09-20 on (`3d9f3cab`, in `elements/chassis-preset.ts`)
- the gate's own reading of a revealed page: the viewport resized to the page's height, as `withRevealedPage` does. Used as the oracle for what the page looks like with everything in view.

A fold is 640px. A fold is blank when under 0.5% of its pixels differ from its most common colour, at least 100px tall.

| night | folds | blank, as shipped | blank, reduced motion | blank, reduced motion + preset rule | pages fixed by the rule |
|---|---|---|---|---|---|
| 2026-09-11 | 60 | 0 | 0 | 0 | 0 |
| 2026-09-12 | 43 | 0 | 0 | 0 | 0 |
| 2026-09-13 | 36 | 0 | 0 | 0 | 0 |
| 2026-09-14 | 38 | 10 | 10 | 0 | 2 |
| 2026-09-15 | 42 | 2 | 2 | 0 | 1 |
| 2026-09-16 | 51 | 30 | 30 | 0 | 9 |
| 2026-09-17 | 41 | 10 | 10 | 0 | 2 |
| 2026-09-18 | 52 | 8 | 8 | 0 | 6 |
| 2026-09-19 | 75 | 46 | 46 | 0 | 9 |
| 2026-09-20 | 47 | 0 | 0 | 0 | 0 |

Six of the ten nights showed the fault, 106 blank folds on 29 of those nights' 54 pages. With the preset rule the count is 0 everywhere, and the oracle reads 0 on those six nights too, so every one of those folds was a reveal and none was a page that is empty by design. (The oracle reads 3 to 4 blank folds on 09-11 and 09-12, from `vh` units growing with the resized viewport; those pages capture fine at rest.)

## Reduced motion alone does nothing for the nights that shipped

Column three equals column two on every night. The six affected designs carry a reduced-motion rule that collapses duration, delay and iteration count and does not set `animation-name`. A `view()` timeline takes its progress from scroll position, so none of the three reaches it. `3d9f3cab`, on the morning of 09-19 and after that night's design, added `animation-name: none`. The 09-20 design is the first with it, and it has no reveal fold that comes out blank either way.

So the fix does nothing for those sealed pages. It is the right fix for a nightly built from the current preset, which always carries the rule, and the `stranded-text` gate errors on any section left at `opacity: 0` with the preference on. The before and after below add the rule to the old page, which is a build of that design on today's chassis.

## Before and after, on real pages

`capturePhoneFilmstrip` from origin/main against this branch, over the sealed page with the preset rule added. Non-modal share per fold, first six folds:

| page | as shipped, before | as shipped, after (no rule on the page) | preset rule, before | preset rule, after |
|---|---|---|---|---|
| 09-19 `/work/dougmar-ch`, 14 folds | 57 55 0 0 0 0 | 57 55 0 0 0 0 | 57 55 0 0 0 0 | 57 55 45 46 42 43 |
| 09-16 `/about`, 16 folds | 68 70 69 2 2 1 | 68 70 69 2 2 1 | 68 70 69 2 2 1 | 68 70 69 30 47 36 |

The two "before" columns are one image: the old code on the old page, and the old code on the old page with the rule, are the same capture, since without the change the preference is never on. The composed image is 1568x433 for the case study and 1568x401 for the about page, before and after, so the tile count and the size the critic is billed for do not change (about 905 and 838 tokens by width times height over 750). Across all 90 pages the fold count is the same with reduced motion on as off; four pages differ in height by 44px (2312 to 2356 and three like it), none changes a page's fold count.

![09-19 case study before](https://raw.githubusercontent.com/marchdoe/dougmar.ch/cb4ef24648e90817843aba7ed120800bcf22417f/docs/evidence/filmstrip-reduced-motion/2026-09-19-dougmar-ch-before.jpg)

![09-19 case study after, with the preset rule](https://raw.githubusercontent.com/marchdoe/dougmar.ch/cb4ef24648e90817843aba7ed120800bcf22417f/docs/evidence/filmstrip-reduced-motion/2026-09-19-dougmar-ch-after-with-preset-rule.jpg)

![09-16 about before](https://raw.githubusercontent.com/marchdoe/dougmar.ch/cb4ef24648e90817843aba7ed120800bcf22417f/docs/evidence/filmstrip-reduced-motion/2026-09-16-about-before.jpg)

![09-16 about after, with the preset rule](https://raw.githubusercontent.com/marchdoe/dougmar.ch/cb4ef24648e90817843aba7ed120800bcf22417f/docs/evidence/filmstrip-reduced-motion/2026-09-16-about-after-with-preset-rule.jpg)

## What else was checked

Only a full-page capture has the fault. Every other capture takes the viewport at scroll position zero, where a reveal that starts in view has started.

| capture | checked | result | changed |
|---|---|---|---|
| phone filmstrip, `capturePhoneFilmstrip` (home, `/about`, the case study, the mockup) | 90 pages | fault on 6 nights, as above | yes |
| desktop filmstrip | #618 | fixed there | no |
| tablet still, `captureTabletStill` | 54 pages, nights 09-14 to 09-19, shipped against preset rule | 0 blank; one page differs by 3 points | no |
| 1440 still in `captureScreenshot` | 54 pages, same nights, shipped against preset rule | 0 blank; one page differs by 9 points, a section partway through its reveal at the fold's edge | no |
| dark still and header crops in `captureScreenshot` | not measured separately; the same viewport at scroll position zero as the 1440 still | | no |
| motion strip | not touched; it exists to see the entrance play, so it needs motion on | | no |
| `captureRouteScreenshot`, `captureFingerprint`, `viewport-screenshotter`, the archiver's snapshot crawl | read: viewport captures, or a static HTML crawl | no full-page capture | no |
| `scripts/capture-reference.js` | read: `fullPage: false` | | no |

The tablet still and the 1440 stills are left as they are. No blank fold in 108 captures, and a reduced-motion still would show a page that differs from what a visitor's first screen shows by an element caught mid-reveal.
