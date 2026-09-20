# Archive link ink across the last twenty archived presets (#566)

The renderer picks the quietest of textFaint, textMuted and text that reaches 4.5:1 against the link's ground, the lowest ratio across every condition the tokens define. The root link sits on bg, the home callout's link on bgAlt. The two July presets predate bgAlt, so the callout column falls back to bg for them. Ratios are computed from the archived elements/preset.ts of each night.

| night | root (bg) | ratio | callout (bgAlt) | ratio | textFaint on bg | textMuted on bg | text on bg |
|---|---|---|---|---|---|---|---|
| 2026-07-29 | textMuted | 6.52 | textMuted (bg, no bgAlt) | 6.52 | n/a | 6.52 | 16.59 |
| 2026-08-30 | textMuted | 4.95 | textMuted (bg, no bgAlt) | 4.95 | n/a | 4.95 | 17.33 |
| 2026-09-02 | textFaint | 5.76 | textFaint | 4.59 | 5.76 | 8.44 | 12.64 |
| 2026-09-04 | textMuted | 8.95 | textMuted | 8.10 | 3.72 | 8.95 | 16.81 |
| 2026-09-05 | textMuted | 6.42 | textMuted | 5.27 | 4.41 | 6.42 | 10.21 |
| 2026-09-06 | textFaint | 5.88 | textFaint | 5.13 | 5.88 | 7.66 | 15.43 |
| 2026-09-07 | textFaint | 4.55 | textMuted | 6.69 | 4.55 | 7.14 | 17.37 |
| 2026-09-08 | textFaint | 7.26 | textFaint | 6.69 | 7.26 | 10.07 | 15.77 |
| 2026-09-09 | textFaint | 6.09 | textFaint | 5.11 | 6.09 | 8.64 | 16.70 |
| 2026-09-10 | textFaint | 4.52 | textMuted | 4.65 | 4.52 | 6.05 | 8.29 |
| 2026-09-11 | textFaint | 6.29 | textFaint | 5.84 | 6.29 | 8.95 | 16.83 |
| 2026-09-12 | textFaint | 5.42 | textFaint | 6.97 | 5.42 | 7.39 | 10.06 |
| 2026-09-13 | textMuted | 7.63 | textMuted | 6.96 | 4.26 | 7.63 | 17.72 |
| 2026-09-14 | textFaint | 4.73 | textMuted | 6.61 | 4.73 | 7.41 | 16.57 |
| 2026-09-15 | textMuted | 6.63 | textMuted | 6.04 | 4.42 | 6.63 | 16.33 |
| 2026-09-16 | textFaint | 5.84 | textFaint | 6.35 | 5.84 | 11.80 | 16.15 |
| 2026-09-17 | text | 4.89 | textFaint | 4.56 | 2.19 | 3.59 | 4.89 |
| 2026-09-18 | textFaint | 4.74 | textMuted | 6.03 | 4.74 | 6.37 | 14.31 |
| 2026-09-19 | textFaint | 5.19 | textFaint | 4.75 | 5.19 | 7.63 | 16.47 |
| 2026-09-20 | textFaint | 5.05 | textFaint | 4.72 | 5.05 | 8.64 | 16.03 |

under 4.5: []
root tally { textMuted: 6, textFaint: 13, text: 1 }
callout tally { textMuted: 10, textFaint: 10 }
