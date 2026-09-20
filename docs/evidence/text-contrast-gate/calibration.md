# Text-contrast gate, calibration on sealed nights (#566)

The gate measured over the last ten sealed snapshots under public/archive, served by `vite preview` from a fresh `pnpm build`. The archive rail (`[data-archive-frame]`) is removed from the DOM first. Each night is 9 routes (home, about, seven case studies) at the phone rung and the desktop rung in both colour schemes, 36 measurements. External requests are blocked, which changes fonts and nothing else. Findings are deduplicated by element chain and colour pair across the whole night.

| night | texts measured | errors | of which engineer-owned | warnings | unresolved | worst ratio | sent to revision |
|---|---|---|---|---|---|---|---|
| 2026-09-11 | 2360 | 0 | 0 | 2 | 0 | 3.85:1 | no |
| 2026-09-12 | 1784 | 0 | 0 | 1 | 0 | 4.20:1 | no |
| 2026-09-13 | 1858 | 0 | 0 | 10 | 0 | 4.26:1 | no |
| 2026-09-14 | 2394 | 1 | 1 | 7 | 5 | 2.05:1 | yes |
| 2026-09-15 | 1768 | 2 | 2 | 8 | 3 | 1.68:1 | yes |
| 2026-09-16 | 1478 | 0 | 0 | 0 | 6 | none | no |
| 2026-09-17 | 1012 | 9 | 8 | 8 | 6 | 2.19:1 | yes |
| 2026-09-18 | 1632 | 0 | 0 | 1 | 14 | 3.63:1 | no |
| 2026-09-19 | 1784 | 0 | 0 | 13 | 2 | 3.75:1 | no |
| 2026-09-20 | 1594 | 0 | 0 | 0 | 3 | none | no |

Errors, warnings and unresolved count distinct element and colour-pair findings before the per-owner cap. "Texts" counts every visible small text element over the 36 measurements, repeats included; large text is excluded.

**3 of 10 nights would have gone to revision** on an engineer-owned error: 2026-09-14, 2026-09-15, 2026-09-17.

## 2026-09-17

Lowest ratios (owner, route, rung, scheme):

- error, react-engineer, /about, desktop, light: <div.bg_bg.c_text.min-h_100vh > section.bg_bg.px_7vw.py_40px.md:py_56px > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Timeline" at 12.6px: #bfa463 on #8c6510 is 2.18:1, under 3:1.
- error, react-engineer, /about, desktop, light: <div.bg_bg.c_text.min-h_100vh > section.bg_bg.px_7vw.py_32px.md:py_40px > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Education" at 12.6px: #bfa463 on #8c6510 is 2.18:1, under 3:1.
- error, react-engineer, /work/15th-club, desktop, dark: <section.bg_bg.px_7vw.py_32px.md:py_48px > div > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Problem" (x3) at 12.6px: #bfa463 on #8c6510 is 2.18:1, under 3:1.
- error, react-engineer, /work/dougmar-ch, mobile, dark: <section.bg_bg.px_7vw.py_32px_56px.md:py_48px_72px > div > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Context" (x4) at 12.6px: #bfa463 on #8c6510 is 2.18:1, under 3:1.
- error, react-engineer, /work/dougmar-ch, mobile, dark: <div.d_flex.gap_4.bd-t_1px_solid.bd-c_border > div > p.c_textFaint.font-style_italic.fs_sm.mt_1> "The day's raw material" (x9) at 14.2px: #bfa463 on #8c6510 is 2.18:1, under 3:1.
- error, human, /, desktop, light: <a.d_block.bg_bg.c_text.op_0.55> "Archive · 137 designs" at 12.6px: #c9b588 on #8c6510 is 2.61:1, under 3:1. The archive link is written by the orchestrator, so this is reported for the owner and is not a revision.
- error, react-engineer, /about, desktop, light: <section.bg_bg.px_7vw.py_40px.md:py_56px > div.d_flex.gap_5.bd-t_1px_solid.bd-c_border > div.ff_display.c_accent.fs_sm.min-w_120px> "2025 –present" at 14.2px: #f0ac1c on #8c6510 is 2.66:1, under 3:1.
- error, react-engineer, /work/dougmar-ch, mobile, dark: <div.d_flex.flex-d_column.mt_3 > div.d_flex.gap_4.bd-t_1px_solid.bd-c_border > span.ff_display.c_accent.fs_sm.min-w_28px> "1" (x9) at 14.2px: #f0ac1c on #8c6510 is 2.66:1, under 3:1.

Unresolved, no ratio produced (6 distinct, first 5 shown):

- react-engineer, /: <div.pos_relative.z_1 > div.mt_6.bd-t_1px_solid.bd-c_border.pt_3 > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Specimen" at 12.6px sits over svg.pos_absolute.inset_0px.w_100%.h_100% (positioned svg); contrast is not measured because the ground is not a flat colour.
- react-engineer, /: <div.pos_relative.z_1 > div.mt_6.bd-t_1px_solid.bd-c_border.pt_3 > span.ff_display.fw_normal.fs_sm.c_textMuted> "Zilla Slab, small-caps, light, reversed " at 14.2px sits over svg.pos_absolute.inset_0px.w_100%.h_100% (positioned svg); contrast is not measured because the ground is not a flat colour.
- react-engineer, /about: <section.pos_relative.ov_hidden.bg_bg.px_7vw > div.pos_relative.z_1 > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Doug March, Product Designer & Developer" at 12.6px sits over svg.pos_absolute.inset_0px.w_100%.h_100% (positioned svg); contrast is not measured because the ground is not a flat colour.
- react-engineer, /about: <section.pos_relative.ov_hidden.bg_bg.px_7vw > div.pos_relative.z_1 > h1.ff_body.fw_normal.c_text.ta_left> "I work at the intersection of design and" at 21.3px sits over svg.pos_absolute.inset_0px.w_100%.h_100% (positioned svg); contrast is not measured because the ground is not a flat colour.
- react-engineer, /work/15th-club: <div.d_flex.flex-wrap_wrap.gap_4.mt_5 > div.d_flex.flex-d_column.gap_1 > span.fs_xs.fw_600.ls_wider.tt_uppercase> "Type" (x3) at 12.6px sits over svg.pos_absolute.inset_0px.w_100%.h_100% (positioned svg); contrast is not measured because the ground is not a flat colour.

## 2026-09-18

Lowest ratios (owner, route, rung, scheme):

- warning, human, /, mobile, light: <a.d_block.bg_bg.c_text.op_0.55> "Archive · 138 designs" at 12.6px: #827985 on #f4eee3 is 3.63:1, under 4.5:1. The archive link is written by the orchestrator, so this is reported for the owner and is not a revision.

Unresolved, no ratio produced (14 distinct, first 5 shown):

- human, /: <span.d_inline-flex.flex-d_column.ai_center.gap_0.34em > span.d_flex.flex-d_column.ai_center > span.ff_body.lh_1.2.ls_0.09em.tt_uppercase> "Product Designer & Developer" at 14px sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour. BrandLockup is written by the orchestrator, so this is reported for the owner and is not a revision.
- react-engineer, /: <header.pos_relative.lg:pos_sticky.ov_hidden.bg_field > nav.pos_relative.z_1.d_flex.flex-d_row > a.fs_sm.fw_bold.c_fieldInk.p_2> "Work" (x3) at 14.2px bold sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.
- react-engineer, /: <div.pos_relative.z_1.d_flex.flex-d_column > div.min-w_0 > p.ff_body.fw_bold.tt_uppercase.ls_wider> "Featured Work · The Argument" at 12.6px bold sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.
- react-engineer, /: <div.d_flex.flex-wrap_wrap.gap_4.fs_sm > span > b> "AI" (x3) at 14.2px bold sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.
- react-engineer, /: <div.min-w_0 > div.d_flex.flex-wrap_wrap.gap_4.fs_sm > span> "Role ·" at 14.2px sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.

## 2026-09-19

Lowest ratios (owner, route, rung, scheme):

- warning, react-engineer, /, desktop, dark: <section.bg_bgAlt.bdr_md.p_5.lg:p_8 > article.bg_field.c_fieldInk.bdr_md.p_5 > a.c_accentAlt.fw_bold.textStyle_sm.ls_wide> "Open the case →" at 14.2px bold: #2fb381 on #0b4c37 is 3.74:1, under 4.5:1.
- warning, react-engineer, /, desktop, dark: <div.min-w_0 > div.d_flex.jc_space-between.ai_baseline.gap_3 > span.textStyle_2xs.ls_wide.tt_uppercase.c_field> "In progress" at 11.2px bold: #0b4c37 on #2fb381 is 3.74:1, under 4.5:1.
- warning, react-engineer, /, desktop, dark: <ul.li-s_none.m_0.p_0.min-w_0 > li.d_grid.gap_3.ai_baseline.py_2 > span.textStyle_base.fw_bold.c_accentAlt.ta_right> "−15" (x5) at 16px bold: #2fb381 on #0b4c37 is 3.74:1, under 4.5:1.
- warning, react-engineer, /, desktop, dark: <aside.bg_field.c_fieldInk.bdr_md.p_5 > p.textStyle_base.lh_loose.c_fieldInkMuted.bd-t_1px_solid > a.c_accentAlt.fw_bold.d_inline-block.py_1> "the work" (x3) at 16px bold: #2fb381 on #0b4c37 is 3.74:1, under 4.5:1.
- warning, react-engineer, /, mobile, dark: <footer.bg_field.c_fieldInk.px_4.lg:px_9 > div.mt_6.d_flex.ai_center.gap_3 > a.textStyle_sm.c_accentAlt.fw_bold.td_underline> "hello@dougmar.ch" at 14.2px bold: #2fb381 on #0b4c37 is 3.74:1, under 4.5:1.
- warning, react-engineer, /work/15th-club, desktop, light: <div.d_flex.flex-d_column.gap_3.min-w_0 > div.pt_3.bd-t_1px_solid.bd-c_fieldBorder > a.c_accentAlt.fw_bold.textStyle_sm.ls_wide> "Visit the live site →" at 14.2px bold: #2fb381 on #0b4c37 is 3.74:1, under 4.5:1.
- warning, react-engineer, /work/15th-club, desktop, light: <aside.bg_field.c_fieldInk.bdr_md.p_5 > div.d_flex.jc_space-between.gap_4.pt_5 > a.c_accentAlt.fw_bold.textStyle_sm> "← FishSticks" (x2) at 14.2px bold: #2fb381 on #0b4c37 is 3.74:1, under 4.5:1.
- warning, human, /, desktop, dark: <a.d_block.bg_bg.c_text.op_0.55> "Archive · 139 designs" at 12.6px: #777d7a on #f4f7f5 is 3.87:1, under 4.5:1. The archive link is written by the orchestrator, so this is reported for the owner and is not a revision.

Unresolved, no ratio produced (2 distinct, first 2 shown):

- react-engineer, /: <div.pos_relative.z_1 > div.d_flex.ai_flex-start.jc_space-between.px_4 > p.textStyle_2xs.ls_wide.tt_uppercase.c_textFaint> "Doug March. Type specimen." at 11.2px sits over div.pos_absolute.inset_0px.op_0.55.bg-r_repeat (positioned background-image); contrast is not measured because the ground is not a flat colour.
- react-engineer, /about: <div.pos_relative.z_1 > div.d_flex.ai_flex-start.jc_space-between.px_4 > a.textStyle_2xs.ls_wide.tt_uppercase.c_textFaint> "Doug March" at 11.2px sits over div.pos_absolute.inset_0px.op_0.55.bg-r_repeat (positioned background-image); contrast is not measured because the ground is not a flat colour.

## 2026-09-20

No contrast errors or warnings.

Unresolved, no ratio produced (3 distinct, first 3 shown):

- react-engineer, /: <div.pos_relative.z_1 > nav.d_flex.flex-wrap_wrap.gap_4.md:gap_6 > a.ff_display.fs_sm.tt_lowercase.c_fieldInk> "work" (x3) at 14.2px sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.
- react-engineer, /: <nav.d_flex.flex-wrap_wrap.gap_4.md:gap_6 > a.ff_display.fs_sm.tt_lowercase.c_fieldInk > span.c_accent.fw_bold> "01" (x3) at 14.2px bold sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.
- react-engineer, /about: <header.pos_relative.ov_hidden.bg_field.c_fieldInk > div.pos_relative.z_1 > h1.ff_body.fw_normal.tt_none.ls_normal> "I work at the intersection of design and" at 16px sits over div.pos_absolute.inset_0px (positioned background-image); contrast is not measured because the ground is not a flat colour.

## Against what the issue reported

- 09-17: the ochre nights measure as the issue says. The label colour reads 2.18 to 2.19:1 wherever it is set on the ochre ground, and the accent 2.66:1. "Specimen" itself is reported as unresolved, because a positioned svg sits behind it. The archive link reads 2.61:1 (issue: 2.62).
- 09-18: the 12.64px kicker "Featured Work · The Argument" is unresolved, not measured. The ruled lines are a `position: absolute` div beside the copy, not an ancestor of it, so an ancestor-only walk would have missed them. The lowest measured ratio is the archive link at 3.63:1.
- 09-19: the accent on the pine field reads 3.74:1 (issue: 3.75). Most of this page sits at `opacity: 0` until it scrolls into view, so it is measured with the viewport sized to the document.
- 09-20: no error and no warning. Three unresolved findings, all text over a positioned ruled-line layer.
- 09-14 and 09-15 were not in the issue. Both have engineer-owned errors: an accent near 2:1 on the cream ground, and "Won by 1" at 1.68:1 on navy.

Before scroll-revealed text was handled, 09-19 measured 116 texts in 36 measurements and missed its whole lower half.
