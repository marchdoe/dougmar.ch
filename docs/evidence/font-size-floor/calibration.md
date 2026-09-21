# Font-size floor calibration (#567)

Measured over the sealed snapshots of the last ten nights, 2026-09-11 to 2026-09-20: nine pages a night (`/`, `/about` and the seven case studies), at 360 and 1440, in both colour schemes, which is 360 measurements. The pages were served from `public/archive/<date>/` through `vite preview` after `pnpm build`, with the `[data-archive-frame]` rail removed from the DOM before measuring. The findings come from `measureRoute` and `evaluateMeasurement` in `scripts/utils/surface-gate.js`, the same code the nightly runs, with each route mapped to the live route the snapshot stands for so ownership is routed as it is on a real night. `/work` and `/experiments` are not in the snapshots.

A count is a distinct element chain at one size, folded across routes and schemes, the unit the gate reports.

## The ramp sets the floors

Every chassis in the catalog emits the same three small steps, computed from `base` at a fixed 1.125 ratio:

| step | size | on |
| --- | --- | --- |
| `2xs` | 11.23px (0.702rem) | 15 of 15 chassis |
| `xs` | 12.64px (0.79rem) | 15 of 15 chassis |
| `sm` | 14.22px (0.889rem) | 15 of 15 chassis |

Every running-copy record under 16px and every text record under 12px on the ten nights was one of these three. There were no others:

| size (px) | tags | records (one per page, rung and scheme) |
| --- | --- | --- |
| 11.23 | other tags | 850 |
| 12.64 | p, li, blockquote | 52 |
| 14.22 | p, li, blockquote | 130 |

So each candidate floor is a decision about a step. A text floor over 11.23 rejects `2xs`. A running-copy floor over 12.64 rejects `xs` set as a sentence, and over 14.22 rejects `sm`.

## The floors in the issue reject the ramp

Each column is a set of floors: phone running copy, desktop running copy, any text. Cells are engineer-owned faults after folding.

| night | 16 / 14 / 12 (the issue) | 16 / 14 / 11 | 14 / 14 / 12 | 14 / 14 / 11 (shipped) |
| --- | --- | --- | --- | --- |
| 2026-09-11 | 22 | 0 | 22 | 0 |
| 2026-09-12 | 5 | 3 | 3 | 1 |
| 2026-09-13 | 2 | 0 | 2 | 0 |
| 2026-09-14 | 9 | 7 | 5 | 3 |
| 2026-09-15 | 8 | 1 | 7 | 0 |
| 2026-09-16 | 4 | 2 | 2 | 0 |
| 2026-09-17 | 3 | 3 | 0 | 0 |
| 2026-09-18 | 16 | 11 | 9 | 4 |
| 2026-09-19 | 10 | 3 | 7 | 0 |
| 2026-09-20 | 19 | 3 | 17 | 1 |
| nights sent to a revision by these findings | 10 of 10 | 8 of 10 | 9 of 10 | 4 of 10 |

At the issue's floors every night carries faults, from 2 to 22 a night. Nine of the ten nights set labels in `2xs`, and eight of the ten set a paragraph in `sm` at the phone. The engineer sets type in the ramp, so a gate at those floors fails the design system's own tokens.

Two nights of `sm` paragraphs a 16px phone floor would reject:

### 2026-09-18, at 360
- section.bg_bg.c_text.min-w_0.p_5 > div > p.fs_sm.c_textMuted.mt_1 "Round 3 in progress, two leaders tied at" 14.22px
- div.d_grid.grid-tc_1fr.lg:grid-tc_1fr_1fr > section.bg_bg.c_text.min-w_0.p_5 > p.fs_sm.c_textMuted.lh_loose.bd-l_3px_solid "Why it matters: both leaders reach the c" 14.22px
- section.bg_surface.c_text.p_6.md:p_8 > div.d_flex.ai_baseline.jc_space-between.flex-wrap_wrap > p.fs_sm.c_textMuted.max-w_40ch "Founder, SaaS and AI builds, plus the sm" 14.22px

### 2026-09-20, at 360
- footer.pos_relative.bg_bgAlt.bd-t_3px_solid.bd-c_borderStrong > div.d_grid.grid-tc_1fr.lg:grid-tc_1.2fr_1fr_1fr.md:cg_14 > p.grid-c_1_/_-1.pt_6.pb_6.ff_display "the highest level of wisdom is when you " 14.22px
- div.pos_relative.w_100%.ov-x_hidden.bg_bg > footer.pos_relative.bg_bgAlt.bd-t_3px_solid.bd-c_borderStrong > p.ff_display.fs_sm.c_text.max-w_62ch "Building Spaceman and using AI as a forc" 14.22px

## The shipped floors

Running copy under 14px, any text under 11px, both rungs, both errors.

| night | phone small-copy | desktop small-copy | small-text | orchestrator-owned | engineer faults listed | revision on these alone |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-11 | 0 | 0 | 0 | 0 | 0 | no |
| 2026-09-12 | 1 | 1 | 0 | 0 | 1 | yes |
| 2026-09-13 | 0 | 0 | 0 | 0 | 0 | no |
| 2026-09-14 | 2 | 3 | 0 | 0 | 3 | yes |
| 2026-09-15 | 0 | 0 | 0 | 0 | 0 | no |
| 2026-09-16 | 0 | 0 | 0 | 0 | 0 | no |
| 2026-09-17 | 0 | 0 | 0 | 0 | 0 | no |
| 2026-09-18 | 4 | 4 | 0 | 0 | 4 | yes |
| 2026-09-19 | 0 | 0 | 0 | 0 | 0 | no |
| 2026-09-20 | 1 | 1 | 0 | 0 | 1 | yes |

4 of 10 nights are sent to a revision. The findings are `xs` (12.64px) in a `p` or `li`. Most are uppercase kickers written as `<p>`, which the tag rule counts as running copy: 2026-09-12 has one, 2026-09-14 three, 2026-09-18 four. The one real sentence is a list item on 2026-09-20. The engineer prompt now says to set labels in a `span` or `div`.

### 2026-09-12
- small-copy 12.64px: <div.d_grid.gap_8px.bg_bg.bd-t_1px_solid > section.d_flex.flex-d_column > p.textStyle_xs.tt_uppercase.ls_wide.c_accent> "Founder · 2018" is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.

### 2026-09-14
- small-copy 12.64px: <div > section.bg_bgAlt.p_9_5_10.lg:p_64px_40px_56px.bd-t_1px_solid > p.fw_bold.fs_xs.ls_wider.tt_uppercase> "The Client Set" is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.
- small-copy 12.64px: <div > section.bg_surface.bd-t_1px_solid.bd-c_borderStrong.p_8_5 > p.fw_bold.fs_xs.ls_wider.tt_uppercase> "Off the clock" is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.
- small-copy 12.64px: <div.d_none.lg:d_block.lg:mt_6 > div.mb_6 > p.fw_bold.fs_xs.ls_wider.tt_uppercase> "Detroit · This weekend" (x2) is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.

### 2026-09-18
- small-copy 12.64px: <div.flex_1.min-w_0 > section.bg_bg.c_text.p_5.md:p_7 > p.ff_body.fw_bold.tt_uppercase.ls_wide> "Constraints" (x2) is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.
- small-copy 12.64px: <div.flex_1.min-w_0 > section.bg_surface.c_text.p_5.md:p_7 > p.ff_body.fw_bold.tt_uppercase.ls_wide> "References" is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.
- small-copy 12.64px: <div.pos_relative.z_1.d_flex.flex-d_column > div.min-w_0 > p.ff_body.fw_bold.tt_uppercase.ls_wider> "Featured Work · The Argument" is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.

### 2026-09-20
- small-copy 12.64px: <div.pt_6.md:pt_8.pb_6.md:pb_8 > ul.d_flex.flex-wrap_wrap.gap_3.mt_4 > li.ff_display.fs_xs.c_text.bd_1px_solid> "It regenerates its layout unattended. No" (x4) is running copy at 12.64px, under the 14px floor. Set it on the `sm` step or larger.

No finding landed on an orchestrator-owned part on any of these nights, so the human-owner column is empty. The routing is covered by `tests/utils/small-text.test.js` and `tests/utils/small-text-dom.test.js`.

## What a revision costs

The archive records carry the cost of each night. All ten nights already ran a surface-gate revision in round 1, by the gate as it stood that night (`REVISE#1` in every `record.json`), so findings from this gate ride in a revision that runs anyway. An engineer call cost between $0.36 and $0.92, $0.60 on average (30 calls, $17.86). A new error adds a call only on a night that would otherwise pass round 1, and none of the ten did. A wider brief costs a longer engineer call and a better chance that the round 2 gate still finds errors: six of the ten nights ended round 2 with `REVISE#2`.

## Reproducing

`pnpm build`, then serve `dist` with `vite preview`, open each `/archive/<date>/`, `about.html` and `work/<slug>.html` at 360x640 and 1440x900 in both schemes, delete `[data-archive-frame]` on parse, run `measureRoute` and `evaluateMeasurement` with `m.route` set to the live route, and fold with `collapseSmallText`.
