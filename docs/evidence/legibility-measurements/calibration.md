# Legibility measurements, calibrated on ten nights (#569)

The line-length check and the phone density measurement ran over the sealed snapshots of 2026-09-11 to 2026-09-20. Nine pages a night (`/`, `/about` and the seven case studies) at 360, 820 and 1440. The pages were served from `public/archive/<date>/` with `[data-archive-frame]` stripped. The gate numbers come from `runSurfaceGate`, the code the nightly runs, with each route mapped to the live route the snapshot stands for so ownership routes as it does on a real night. The per-block and per-fold numbers come from the same probes run alone, at all three rungs in the light scheme, over the same pages. `/work` and `/experiments` are not in the snapshots. Fonts came from Google Fonts, so Archivo was the face that shipped, and every night loaded it.

## The issue's numbers do not reproduce for /about

The issue reports 82 to 99 characters a line on `/about` at 820 and 1440. In Chromium with Archivo loaded, 2026-09-20's `/about` role descriptions set at 68 to 74 characters at 820 and 70 to 80 at 1440. A per-character count (a rect for every character, not every word) agrees to within the trailing space: 79, 72 and 54 on the first paragraph at 1440. The case studies do reproduce. On the same night `/work/15th-club`, `/work/dougmar-ch` and `/work/fishsticks` set at 81 to 87 characters in a 568px box under `max-width: 62ch`, which is what the issue says of "the case study" (81). So the limit at 80 catches the case studies and leaves 09-20's `/about` at its edge (longest line 80, median 74.5).

## Threshold

Longest line of a block, tablet and desktop rungs, one-line blocks included, distinct element chains per night. The phone never passes 53 characters, so it changes nothing.

| limit | nights with a chain over it | chains on 09-20 |
|---|---|---|
| 75 | 9 of 10 | 4 |
| 80 | 9 of 10 | 3 |
| 85 | 9 of 10 | 2 |
| 90 | 7 of 10 | 1 |
| 100 | 4 of 10 | 0 |

Only 09-16 is clean at any limit. Moving from 75 to 80 changes the count on one night (09-20) and no night's verdict. 80 is WCAG 1.4.8's ceiling and the number the issue proposed.

Two choices in the rule come from the data.

- The longest line, not the median. The engineer sets a width and the longest line is what that width allows. A lumpy 88 in a column of 70s is a real 88.
- A block that sets on one line is judged on that line. 09-17's `/work/dougmar-ch` sets a 14px paragraph at 181 characters in a 1238px box, and 09-20's chips set at 97 characters on one line. Excluding one-line blocks removes a chain on 09-14, 09-18 and 09-19, and it would let a paragraph escape by being short enough to fit an over-wide box. A flex `li` that lays a number, a label and a description in three columns is not a block of running copy, so it is skipped and the `p` inside each column is measured.

The tablet is in. Chains over 80 at 820 and not at 1440 exist on four of the ten nights (09-14, 09-15, 09-18, 09-19), and on 09-15 and 09-19 the tablet was the only place they showed. A single column is widest against its type at 820.

## Line length by night

Blocks are `p`, `li` and `blockquote` of eight words or more with a line over 80, counted per rung before folding. "Chains" is what the gate reports after folding across routes, rungs and schemes. Example text is cut at 40 characters, as the gate cuts it.

| night | routes over the limit | 360 | 820 | 1440 | chains | example |
|---|---|---|---|---|---|---|
| 2026-09-11 | /about | 0 | 8 | 9 | 2 | /about, `p.textStyle_base.c_textMuted.mt_1` "Independent design and engineering pract" (x8), 150 characters on its longest line (2 lines), 16px in a 1104px box |
| 2026-09-12 | /about | 0 | 0 | 7 | 1 | /about, `p.textStyle_base.c_textMuted.max-w_65ch` "Led the initiative to build a design sys" (x7), 88 characters, 654px box |
| 2026-09-13 | /about | 0 | 0 | 8 | 1 | /about, `p.mt_2.fs_base.lh_normal.c_textMuted` "Led the rebrand of the consumer-facing s" (x8), 99 characters, 705px box |
| 2026-09-14 | / /about | 0 | 2 | 1 | 2 | /, `p.mt_5.c_textMuted.fs_sm` "The vehicle for the client set above, te", 111 characters on one line, 14.22px in a 810px box |
| 2026-09-15 | /about | 0 | 7 | 0 | 1 | /about, `li > p.fs_base.c_fieldInkMuted.m_0.mt_2` "Led the initiative to build a design sys" (x7), 88 characters, 660px box |
| 2026-09-16 | none | 0 | 0 | 0 | 0 | none |
| 2026-09-17 | /about /work/15th-club /work/dougmar-ch /work/fishsticks | 0 | 15 | 24 | 6 | /work/dougmar-ch, `p.c_textMuted.fs_sm.mt_1` "A preserved design wearing tonight's sty" (x4), 181 characters on one line, 14.22px in a 1238px box |
| 2026-09-18 | / /work/15th-club /work/dougmar-ch /work/fishsticks | 0 | 23 | 17 | 7 | /work/dougmar-ch, `p.fs_base.c_textMuted` "A preserved design wearing tonight's sty" (x4), 168 characters, 1201px box |
| 2026-09-19 | /work/15th-club /work/dougmar-ch /work/fishsticks /work/spaceman | 0 | 18 | 0 | 4 | /work/dougmar-ch, `ul > li` "The Phoenix Primitives · Specification," (x2), 100 characters, 692px box |
| 2026-09-20 | /work/15th-club /work/dougmar-ch /work/fishsticks | 0 | 11 | 11 | 3 | /work/dougmar-ch, `li.fs_xs.bd_1px_solid` "Every past design has to survive exactly" (x4), 97 characters on one line, 12.64px in a 750px box |

The three chains on 09-20 are the two `62ch` case study paragraphs on `/work/dougmar-ch` (one in each section band, 81 to 87 characters; the same two chains also fire on `/work/15th-club` and `/work/fishsticks`) and the constraint chips (82 to 97 characters on one line). The ordered pipeline list on that page is not counted, because its `li` is a flex row of number, label and description and none of those is a block of running copy. `findings-by-night.json` has every folded finding and its full text.

## Severity, and what a revision costs

The finding is an error. The engineer can fix it (it sets `max-width`), the fix is the same every time, and a wall of 100-character lines is a fault the critic has never been able to see in a downscaled image.

The question was whether it sends nights to a revision they would not otherwise have. It does not, on either reading.

| night | round 1 in record.json | engineer errors today, shipped design, without line length | line-length errors | revision forced by line length alone |
|---|---|---|---|---|
| 2026-09-11 | REVISE | 116 | 2 | no |
| 2026-09-12 | REVISE | 95 | 1 | no |
| 2026-09-13 | REVISE | 65 | 1 | no |
| 2026-09-14 | REVISE | 45 | 2 | no |
| 2026-09-15 | REVISE | 73 | 1 | no |
| 2026-09-16 | REVISE | 89 | 0 | no |
| 2026-09-17 | REVISE | 15 | 6 | no |
| 2026-09-18 | REVISE | 50 | 7 | no |
| 2026-09-19 | REVISE | 57 | 4 | no |
| 2026-09-20 | REVISE | 8 | 3 | no |

Every night's round 1 in `record.json` was `REVISE` from the gates of its day, so the finding rides in a revision that runs anyway. Nights that gain a revision they did not have, on that reading, are 0 of 10. The second column reads the shipped design (the one after the revision) against today's gate, without `nav-reach`, which a sealed page cannot answer because the seal rewrites `href="/about"`. No night's shipped design would pass every other check, so on that reading too, 0 of 10 revise for line length alone. These counts include findings from gates that are newer than the nights, which is why the middle column is large on the oldest nights.

What it adds is engineer output inside a revision that is running. An engineer call in the last records averaged $0.60 and ran $0.10 to $1.74 (`docs/evidence/late-checks-in-the-gate/calibration.md`). A night that reached round 2 with the same error still ships. Six of the ten nights ended round 2 with `REVISE` on other findings, so an unfixed line length does not add a round.

Because 9 of 10 nights carry the finding, the guidance in `react-engineer.md` does the cheaper work: it tells the engineer the measure before the first build. The engineer chose the `ch` value itself on 09-12 (`max-w_65ch`), 09-19 (`max-w_65ch`) and 09-20 (`max-w_62ch`), and each set past 80 in a narrow face.

## Phone density

A fold is one phone screen (`NARROW_VIEWPORT.height`, 640px), counted from the top. Density is the area of the union of the boxes of every visible line of text, over the area of the fold. `p` marks a last band shorter than a fold, which is left out of the lowest.

| night | / per fold (%) | /about per fold (%) | lowest whole fold, any route |
|---|---|---|---|
| 2026-09-11 | 10 0 30 24 0 28 40 23 29 22 34 22 31 9p | 26 59 23 40 47 46 47 41 14 20 12 0 12 2 0 19 24p | 0% (/, fold 2 of 14) |
| 2026-09-12 | 3 0 0 0 22 33 40 14 9 10p | 43 24 28 30 28 14 10 11 9p | 0% (/, fold 2 of 10) |
| 2026-09-13 | 14 27 26 22p | 48 59 44 37 38 38 36 33 29 22 31 20p | 9% (/work/15th-club, fold 2 of 3) |
| 2026-09-14 | 40 63 36 12 22 25 12p | 43 66 18 26 29 26 28 26 27 26 4p | 11% (/work/15th-club, fold 2 of 4) |
| 2026-09-15 | 34 26 21 16 19p | 37 51 17 36 34 26 18 18 18p | 9% (/work/15th-club, fold 2 of 4) |
| 2026-09-16 | 49 49 23 21 15 10 18p | 42 63 49 32 50 40 39 42 42 41 44 47 27 22 14 16p | 9% (/work/15th-club, fold 2 of 4) |
| 2026-09-17 | 39 16 15 4p | 36 16 31 28 35 24 13 11p | 8% (/work/teeturn, fold 1 of 2) |
| 2026-09-18 | 33 30 33 18 20 24 5p | 32 54 38 26 39 39 37 38 33 14 13 24 12p | 13% (/about, fold 11 of 13) |
| 2026-09-19 | 20 24 20 25 12 14 16p | 24 44 30 17 23 23 20 22 13 11 23 7p | 6% (/work/twittertale, fold 5 of 7) |
| 2026-09-20 | 47 26 22 24 12 16 15p | 29 23 41 33 42 39 37 27 12 24 4p | 5% (/work/15th-club, fold 3 of 4) |

- Home and about, 170 whole folds. p10 12%, median 26%, p90 46%. 5% of folds are under 5%, 6% under 10%, 18% under 15%.
- Case studies, 246 whole folds. p10 8%, median 18%, p90 35%. None under 5%, 24% under 10%, 40% under 15%.

The zeros on 09-11 and 09-12 are folds with no text at all, an image or a field of colour, which is what "sparse is not a fault by itself" in the critic prompt is for. The register the issue describes, 09-20's home, reads 47 26 22 24 12 16 15 (folds 5 to 7 are the seven rows). Each row is about a third of a fold, and 12 to 16% is where that lands. "Sparse" in the critic block is under 15%, which is the band the last three folds of that page sit in, and about where the bottom fifth of home and about folds fall. It is a label on a number for the critic, not a threshold anything fails on. `facts-2026-09-20.txt` is the section the critic is handed for that night.

The measurement is at the phone rung in the light scheme, per engineer-owned route. It is not in `surface-gate.json`, the trace or `record.json`, which are where the nightly's other gate output goes. Adding it there would touch the trace step that #578's work is editing, so this PR passes it to the critic and stops.

## The desktop filmstrip

Two across, 900px folds of a full-page capture at 1440, up to six folds, cut to 1568 wide and sent as one JPEG.

| night | first case study (`/work/spaceman`), page px | folds | sent | image tokens |
|---|---|---|---|---|
| 2026-09-11 | 2284 | 3 | 1568x983 | 1533 |
| 2026-09-12 | 1614 | 2 | 1568x487 | 1018 |
| 2026-09-13 | 1501 | 2 | 1568x487 | 1018 |
| 2026-09-14 | 1447 | 2 | 1568x487 | 1018 |
| 2026-09-15 | 1855 | 3 | 1568x983 | 1533 |
| 2026-09-16 | 1760 | 2 | 1568x487 | 1018 |
| 2026-09-17 | 1613 | 2 | 1568x487 | 1018 |
| 2026-09-18 | 1475 | 2 | 1568x487 | 1018 |
| 2026-09-19 | 3195 | 4 | 1568x983 | 1533 |
| 2026-09-20 | 2455 | 3 | 1568x983 | 1533 |

Tokens are width times height over 750 after fitting to the API's 1.15 megapixel limit, so an estimate. The range is 1,018 to 1,533 and the mean 1,224. For comparison, the 1440x900 still it replaces is about 1,533, a case-study phone filmstrip about 950, and a header crop about 670. A page taller than three folds is capped by the API's own fit at about 1,533 whatever its length, which puts the effective scale near 0.4 for a six-fold page (`desktop-filmstrip-2026-09-20-dougmar-ch.jpg`). That is enough to see a 568px column against empty space, and not enough to read type, which the critic prompt says.

### What the ceiling does with it

Every one of the ten nights had a dark capture (`screenshot-dark.png` is in each build directory) and six had a motion strip (09-14, 15, 16, 18, 19, 20). So the head of the image list was seven images on four nights and eight on six.

| night type | before, ceiling 8 | now, ceiling 9 |
|---|---|---|
| dark capture, no motion strip (4 of 10) | head 7, /about phone filmstrip. The case-study phone filmstrip, the case-study 1440 still and the reference dropped | head 7, desktop filmstrip, /about phone filmstrip. The case-study phone filmstrip and the reference dropped |
| dark and motion (6 of 10) | head 8. Both phone filmstrips, the 1440 still and the reference dropped | head 8, desktop filmstrip. Both phone filmstrips and the reference dropped |

Nothing that shipped on any of the ten nights is dropped to make room. The 1440 still of the case study, which the issue says the critic gets, was not sent on any of them: route captures are appended last, and only while a slot other than the reference's is free. The ceiling stays at eight only by dropping /about's phone filmstrip on the four dark-only nights and never sending the desktop filmstrip on the six motion nights. Nine costs one image, about 1,200 tokens, per critic call, and a night that revises makes two calls. The tests hold the ceiling for every combination of twelve image flags (4,096 shapes) and hold the drop order.

## The desktop filmstrip is taken with reduced motion on

A full-page capture never scrolls. 2026-09-19's case study fades its sections in on a view timeline, so every fold below the first came out white (`phone-filmstrip-2026-09-19-dougmar-ch-blank-below-fold.jpg` is the existing phone filmstrip of that page, which has the same fault). With `reducedMotion: 'reduce'` the same capture shows the page at rest, and the `stranded-text` check already requires that resting page to be complete. The phone filmstrip and the tablet still are unchanged here. The blank phone filmstrip on a night like 09-19 is a separate fault for the owner.

## Things this PR notes and does not do

- `tests/e2e/site-health.spec.ts` checks word shredding at 360 and 1440 only. At 320 the hero breaks as "independent / . still the", a full stop starting a line. The phone-width contract move to 320 is a separate PR, so no 320 check is added here.
- `responsive-scorer.js` still carries its own `lineLengthMaxChars: 75`, an average over an estimated line count, read by nothing that gates. It is a different measure from this one, so it is left alone. The screenshot critic prompt now quotes the gate's number where it said 75.
- The issue's phone width is written as 390 in places. The rung is `NARROW_VIEWPORT`, 360, and every number above is taken there.
- Persisting the density numbers in the archive record needs an edit to the trace step in `design-agents.js`.
