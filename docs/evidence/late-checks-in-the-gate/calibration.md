# Late checks in the gate, calibrated on ten nights (#574)

The three ported checks ran against the sealed snapshots of 2026-09-11 to 2026-09-20. Nine pages a night (`/`, `/about` and the seven case studies) at 360, 820 and 1440, in both colour schemes, which is 540 measurements per pass. The pages were served from `public/archive/<date>/` through `vite preview` after `pnpm build`, with `[data-archive-frame]` removed as each page parsed. Findings come from `measureRoute` and `evaluateMeasurement` in `scripts/utils/surface-gate.js`, the code the nightly runs, with each route mapped to the live route the snapshot stands for so ownership routes as it does on a real night. Each night was then folded with the same chain `runSurfaceGate` uses (`collapseTextContrast`, `collapseSmallText`, `collapseRenderHealth`). `/work` and `/experiments` are not in the snapshots. The tablet rung takes none of the new probes.

A count is a distinct element chain, folded across routes, rungs and schemes. That is the unit the gate reports.

## Which checks fire

Stranded text needs a page loaded with reduced motion on, and the sealed CSS of 09-11 to 09-19 predates the rule that makes that check meaningful. The chassis preset dropped `animation-name` under reduced motion in 3d9f3cab, after the 09-19 design. Before it, a scroll-driven `rise` kept running with the preference on, so every section below the fold sat at opacity 0. The 09-20 snapshot is the first with the rule. The last column adds today's rule to the older pages and is the one that says what tonight's pipeline would report.

| night | word-break | invisible-text | stranded-text, sealed CSS | stranded-text, today's preset |
| --- | --- | --- | --- | --- |
| 2026-09-11 | 6 (/) | 0 | 0 | 0 |
| 2026-09-12 | 0 | 0 | 0 | 0 |
| 2026-09-13 | 0 | 0 | 0 | 0 |
| 2026-09-14 | 2 (/ /about) | 0 | 2 (/) | 0 |
| 2026-09-15 | 0 | 0 | 2 (/) | 0 |
| 2026-09-16 | 1 (/) | 0 | 6 (/about /) | 0 |
| 2026-09-17 | 0 | 0 | 6 (/work/dougmar-ch / /about) | 1 (/) |
| 2026-09-18 | 1 (/work/twittertale) | 0 | 2 (/about /) | 0 |
| 2026-09-19 | 2 (/ /work/politweets) | 2 (/about /) | 3 (/work/dougmar-ch / /about) | 0 |
| 2026-09-20 | 3 (/) | 0 | 0 | 0 |

Word breaks show on 6 of 10 nights and on 4 of the last 5 (09-16, 09-18, 09-19, 09-20). The issue counted 3 of 5. It measured 09-16 and 09-18 and took 09-20 from `KNOWN_SHREDS`, and 09-19 was not in its sample. Text painted in nothing shows on 09-19 only, which is #525. With today's preset stranded text shows on 09-17 only.

## One element each

Text is as the gate wrote it, cut at 260 characters.

- 09-11 word-break, `/` at 1440, engineer, error. `<section.order_2.lg:order_1.px_5.md:px_6 > div.grid-c_auto.lg:grid-c_1_/_7.ov-wrap_anywhere > span.fw_bold.textStyle_2xl.lh_tight.ls_tight> "produce" at 81px needs 336px, its box is 99px, broken over 4 lines (x2); 1 more in the same element: "free".`
- 09-14 word-break, `/` at 360, engineer, error. `<div.d_grid.grid-tc_1fr_1fr.lg:grid-tc_1fr_1fr_1fr.bd_1px_solid > div.d_flex.ai_center.jc_center.min-w_0 > span.ff_display.fw_bold.fs_lg.c_text> "WorkAround" at 32px needs 203px, its box is 125px, broken over 2 lines; 1 more in the same element: "Zeldman".`
- 09-16 word-break, `/` at 1440, engineer, error. `<header.pos_relative.ov_hidden.bg_bg.min-h_auto > div.pos_relative.z_1.ml_0.md:ml_auto > h1.ff_display.textStyle_xl.md:textStyle_3xl.c_text> "questions" at 177px needs 904px, its box is 640px, broken over 2 lines.`
- 09-18 word-break, `/work/twittertale` at 1440, engineer, error. `<div.pos_relative.z_1.d_flex.flex-d_column > div.min-w_0 > h1.ff_display.fw_bold.fs_2xl.md:fs_3xl> "Twittertale" at 182px needs 960px, its box is 550px, broken over 2 lines.`
- 09-19 word-break, `/` at 360, engineer, error. `<li.bd-t_1px_solid.bd-c_borderStrong > a.d_flex.ai_baseline.jc_space-between.flex-wrap_wrap > span.ff_display.fw_bold.textStyle_xl.c_text> "FishSticks" at 41px needs 281px, its box is 232px, broken over 2 lines; 1 more in the same element: "dougmar".`
- 09-20 word-break, `/` at 1440, engineer, error. `<div.bd-t_1px_solid.bd-c_borderStrong > a.pos_relative.d_grid.grid-tc_2.6rem_1fr.grid-template-areas_"num_title"_"num_meta" > span.grid-area_title.ff_display.fw_> "Spaceman" at 273px needs 1295px, its box is 240px, broken over 8 lines; 5 more in the same element`
- 09-19 invisible-text, `/about` at 360, engineer, error. `<h1.px_2.lg:px_3.anim-dly_0ms > div.d_flex.jc_flex-start.w_100%.ov_hidden > span.ff_display.fw_bold.tt_uppercase.lh_tight> "INTERSECTION" at 32px is set in rgba(0, 0, 0, 0), with no text stroke and no background clipped to the text, so it paints nothing.`
- 09-14 stranded-text, sealed CSS, `/` at 1440, engineer, error. `<div.d_grid.grid-tc_1fr.lg:grid-tc_1fr_320px.grid-template-areas_"sidebar"_"main" > div.grid-area_main.min-w_0 > div> "The Client SetTen years, shipp" (x2) is 1120x755px at opacity 0, animation-name rise with prefers-reduced-motion: reduce on.`
- 09-17 stranded-text, today's preset, `/` at 1440, engineer, error. `<header.d_flex.flex-d_column.md:flex-d_row.ai_flex-start > nav.ml_0.md:ml_auto.pos_relative > div.navDropdown.pos_absolute.top_100%.right_0> "workaboutcontact" is 84x182px at opacity 0, animation-name none with prefers-reduced-motion: reduce on.`

`findings-by-night.json` has every folded finding for every night.

## False positives

None among the word breaks. The odd one is 09-19 `/work/politweets`, `"com" at 36px needs 70px, its box is 296px`, a word far narrower than its box. It is a real cut. The page sets a URL at 36px under `overflow-wrap: anywhere`, and the browser ends a line on `election.twitter.co` and starts the next with `m.` (`politweets-2026-09-19-360.png`).

One false positive, and it is the e2e test's own. The 09-17 home page has a nav dropdown that starts closed at `opacity: 0`, and the reveal test lists any element at opacity 0 that holds text. That test has always had this shape, and the gate matches it as the issue asked. A closed menu hidden with `visibility: hidden` or `display: none` passes, so the fix line for this kind now says so. Loosening the check is the owner's call, and this PR does not.

The 09-11 to 09-19 stranded findings on the sealed CSS are real by the test's definition and would have failed the e2e that night. They do not predict tonight, because the preset has changed since. That is why the table carries both columns.

## What a revision costs, and who gains one

All ten nights already ran a surface-gate revision in round 1 (`REVISE` for round 1 in every `record.json`), from the gates as they stood that night. So the new findings add no engineer call on any of the ten. They ride in a revision that runs anyway. 0 of 10 nights gain a revision they did not have.

| night | round 1 in record.json | render-health errors, engineer-owned | e2e checks that would fail after the run | night cost |
| --- | --- | --- | --- | --- |
| 2026-09-11 | REVISE | word-break 6 | word-break | $5.05 |
| 2026-09-12 | REVISE | none | none | $3.29 |
| 2026-09-13 | REVISE | none | none | $4.79 |
| 2026-09-14 | REVISE | word-break 2 | word-break | $5.21 |
| 2026-09-15 | REVISE | none | none | $5.24 |
| 2026-09-16 | REVISE | word-break 1 | word-break | $5.43 |
| 2026-09-17 | REVISE | stranded-text 1 | stranded-text | $4.52 |
| 2026-09-18 | REVISE | word-break 1 | word-break | $8.72 |
| 2026-09-19 | REVISE | word-break 2, invisible-text 2 | word-break, invisible-text | $4.68 |
| 2026-09-20 | REVISE | word-break 3 | word-break | $4.82 |

Seven of the ten designs (09-11, 14, 16, 17, 18, 19, 20) would fail the e2e checks after the run. Those seven nights cost $38.43 between them, $4.52 to $8.72 each. Under the workflow as it stands, each of them ships nothing, and the engineer is never told why. With the gate, the same seven carry one to six more errors in a brief that goes out anyway. The 30 engineer calls in these records averaged $0.60 and ran from $0.10 to $1.74, and the brief for a night grows by a few hundred tokens.

What this does not show is whether the round 2 revision clears the new errors. Six of the ten nights ended round 2 with `REVISE` on other findings, so a revision is not a guarantee. It moves a fix from impossible to possible.

The ten-night figures leave out two things. Round 1 in the record comes from the gate as it stood that night, and several kinds have been added since. And the post-run e2e step arrived with the 2026-09-20 night and its word-break test that morning, so the 09-16 and 09-18 designs shipped without meeting either.

## The e2e stays a backstop

`e2e-on-sealed-defects.txt` is the real `tests/e2e/site-health.spec.ts`, pointed at sealed designs that carry each defect and run against the same build. It fails on all three, with the element named. The spec was copied aside first and put back after; nothing in it was left changed.

- `/archive/2026-09-19/` fails "nothing renders invisible" on the transparent hero.
- `/archive/2026-09-18/work/spaceman.html` and `/archive/2026-09-16/` fail "no word breaks" at 1440 and pass at 360, which is where the words break.
- `/archive/2026-09-18/` fails "the reveal is not load-bearing".

## Reproducing

`pnpm build`, serve it with `vite preview`, open each `/archive/<date>/`, `about.html` and `work/<slug>.html` at the three rungs in both schemes, remove `[data-archive-frame]` on parse, run `measureRoute` and `evaluateMeasurement` with `m.route` set to the live route, and fold with `collapseRenderHealth(collapseSmallText(collapseTextContrast(findings)))`. For the last column, add `@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-name:none !important}}` to each page.
