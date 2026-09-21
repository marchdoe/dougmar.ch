# Tablet rung calibration, 2026-09-11 to 2026-09-20

The surface gate with its new 820x1180 rung, run over the sealed snapshots under `public/archive/<date>/` (`/`, `/about` and every `/work/<slug>`), with the archive frame stripped and both colour schemes measured. "Tablet error" is an overflow or clipped-text error at 820. "Tablet-only" is one with no error of the same element or document scroll at 360 or 1440.

## What the gate reports (capped at three clipped elements per measurement)

| Night | Tablet errors | Tablet-only | Tablet warnings | 360/1440 overflow+clip errors | Revises without the tablet | Example tablet error |
|---|---|---|---|---|---|---|
| 2026-09-11 | 0 | 0 | 0 | 0 | no | none |
| 2026-09-12 | 0 | 0 | 0 | 0 | no | none |
| 2026-09-13 | 0 | 0 | 0 | 0 | no | none |
| 2026-09-14 | 0 | 0 | 0 | 2 | yes | none |
| 2026-09-15 | 0 | 0 | 0 | 2 | yes | none |
| 2026-09-16 | 2 | 0 | 2 | 6 | yes | / document scroll |
| 2026-09-17 | 0 | 0 | 0 | 0 | no | none |
| 2026-09-18 | 3 | 1 | 0 | 15 | yes | /work/dougmar-ch <SPAN> "07" |
| 2026-09-19 | 1 | 0 | 0 | 20 | yes | / <P> "Doug March. Type specimen." |
| 2026-09-20 | 0 | 0 | 0 | 0 | no | none |

## Uncapped (every clipped element, light scheme)

The gate lists three clipped elements per measurement, so an element that ranks fourth at 360 can look tablet-only in the table above. This walk collects all of them at each width. On 2026-09-18 it moves the one tablet-only error above (a numbered-list `<span>` "07" wider than its box) to shared: `01` and `02` in the same list are cut at 360.

| Night | Errors at 360 | Errors at 820 | Errors at 1440 | Tablet-only |
|---|---|---|---|---|
| 2026-09-11 | 0 | 0 | 0 | 0 |
| 2026-09-12 | 0 | 0 | 0 | 0 |
| 2026-09-13 | 0 | 0 | 0 | 0 |
| 2026-09-14 | 1 | 0 | 1 | 0 |
| 2026-09-15 | 2 | 0 | 0 | 0 |
| 2026-09-16 | 9 | 2 | 2 | 0 |
| 2026-09-17 | 0 | 0 | 0 | 0 |
| 2026-09-18 | 22 | 7 | 1 | 0 |
| 2026-09-19 | 21 | 1 | 1 | 0 |
| 2026-09-20 | 0 | 0 | 0 | 0 |

## Result

- Nights measured: 10.
- Nights with any tablet error: 3 (2026-09-16, 2026-09-18, 2026-09-19).
- Nights with a tablet-only error, uncapped: 0.
- Nights that would gain a revision from the tablet rung: 0. Each of the three nights with a tablet error already had the same errors at 360 or 1440 and revised without it.
- 2026-09-20, the night that prompted this, has no tablet error: its squeezed register (46.75px titles in 150px rows, a link on the divider) does not overflow and clips nothing. The rung would not have caught it. The tablet still sent to the critic is what looks at it; see `tablet-still-2026-09-20.jpg`.

The full gate also reports copy, heading, nav-reach, brand and contrast errors on these snapshots. None of those is measured at 820, and the seal rewrites `href="/about"` to `about.html`, so nav-reach is not meaningful on a sealed copy. Only overflow and clipped errors are compared here.

## The build on main today

The same gate against `pnpm build` of origin/main (2c1517a4), served with `vite preview`, all three rungs and both schemes: 66 measurements, no overflow or clipped error at 360 or 1440, and three at 820, all on `/`:

| Rung | Route | Element | What the gate says |
|---|---|---|---|
| 820 | `/` | `<span>` "Twittertale" | needs 304px in a 274px box, 30px cut off |
| 820 | `/` | `<span>` "FishSticks" | needs 277px in a 274px box, 3px cut off |
| 820 | `/` | `<span>` "dougmar.ch" | needs 277px in a 274px box, 3px cut off |

These are register titles set for the desktop column and squeezed into a narrower one, the fault the issue describes. Nothing at 360 or 1440 reports them. If a night shipped this design, the rung would force one revision. `tablet-still-current-build.jpg` is the still the critic is sent for it (the first 1180px; the cut titles are further down the page).
