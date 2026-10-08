---
type: spec
tags: [spec, area/pipeline]
created: 2026-04-27
updated: 2026-06-11
aliases: []
sources: []
status: parked
---

> **PARTIALLY ABSORBED** — shell/archetype variance shipped as scripts/utils/shell-mandate.js (2026-06). The /dev/variance dashboard remains unimplemented and parked.

# Spec 06 — Pipeline variance (instrumentation + soft guidance)

**Status:** ready to execute
**Depends on:** none, but Spec 03 (chaos chassis) interacts — chassis variance needs the catalog from Spec 03 to be meaningful

## Goal

Surface variance metrics to both the pipeline (informs next-day decisions via prompt injection) and the user (informs whether to dial weights or push specific vibes). **Never hard-block.** Best design today wins over diversity today.

## Guiding principle

> Fit > novelty. If today's signals genuinely call for archetype X and X was used 3 days ago, picking X again is the right answer. Variance metrics inform the agent's weighing — they don't constrain its choice.

## What already exists (extend, do not overwrite)

The color-mandate system is the template — same pattern applies to other dimensions.

| Existing | What it does |
|----------|-------------|
| `scripts/utils/color-mandate.js` | Reads last N days of `archive/`, extracts primary hue from `color-scheme.json` or regex on `preset.ts`, computes target hue range + forbidden zones |
| `scripts/design-agents.js:690-732` | Calls `computeColorMandate`, formats with `formatMandateForPrompt`, injects as `colorMandateSection` into Director and Token Designer prompts |
| `interpret-signals.js:211-228` | "Run diversity" + "Previous brief — DO NOT REPEAT" injections (single-day lookback) |

Result: palettes already self-diversify. Archetype, chassis, and scale ratios do not.

## Decisions

| Question | Decision |
|----------|----------|
| Hard rules vs soft guidance | **Soft only.** No filtering, no rejection, no required-different. Prompt-level informational context. |
| Symptom-driven or proactive | **Proactive instrumentation.** Build the dashboard now, decide on enforcement later if patterns are bad. |
| Storage | Extend existing pattern — read `archive/$date/build-*/` artifacts directly. No new persistence. |
| Lookback window | **14 days** for archetype and chassis (matches color-mandate's typical window — verify exact value during execution). |
| Dev dashboard | **Yes** — `/dev/variance` mirroring the existing `/dev/responsive` pattern (commit `a2f7e19`). |

## Implementation outline

### Part A — Archetype variance utility

New file: `scripts/utils/archetype-variance.js`

Mirrors `color-mandate.js` shape:
- `extractRecentArchetypes(archiveDir, lookbackDays)` — reads `_detail.json` (or `brief.md` archetype declaration) for each day, returns ordered list
- `computeArchetypeContext(hues, lookbackDays)` — returns `{ recent: [...], frequency: {...}, dominantArchetype: string|null, daysSinceEachArchetype: {...} }`
- `formatArchetypeContextForPrompt(context)` — terse markdown block, max ~6 lines

Injection point: `interpret-signals.js`, before the existing "DO NOT REPEAT" section. New section header: `## Recent Archetype Context (informational)`.

Wording: "Here's what's been used recently. Choose the archetype that BEST fits today's signals — variance is informational. If today's signals call for a recently-used archetype, use it. If two archetypes fit equally well, the less-recent one wins."

### Part B — Chassis variance utility

New file: `scripts/utils/chassis-variance.js`

Same shape as Part A, but reads each archived day's chosen chassis identifier. Source location depends on what the orchestrator persists today — verify during execution. If chassis isn't currently captured per-build, add a small `chassis.json` artifact in the build dir as part of this spec.

Injection point: Director prompt (where chassis selection happens) and Token Designer prompt (so palette can coordinate, per Spec 03 Part C).

### Part C — Color-mandate parity check

Verify `color-mandate.js` is using the same lookback-window value the new utilities will use. If they're inconsistent, align them.

No changes to `color-mandate.js` itself unless inconsistency is found.

### Part D — `/dev/variance` dashboard

New route: `app/routes/dev.variance.tsx`. Pattern after `app/routes/dev.responsive.tsx`.

Read-only views of variance over the last 14/30/60 days:

1. **Archetype timeline** — horizontal strip, one cell per day, colored by archetype. Hover → date + archetype name.
2. **Palette swatches** — strip of primary-hue swatches, one per day. Quick visual sense of palette diversity.
3. **Chassis usage histogram** — bar chart of chassis selections in the window.
4. **Risk weight history** — line chart of `WEIGHT_RISK` values per run, to correlate variance with the dial.
5. **Spec-critic revision rate** — bar chart, days where the critic forced revisions. Spikes here suggest over-constraint.

Server function: `getVarianceData()` — calls the variance utilities + reads risk weights from build traces. Reuses the data-loading patterns already in `dev.responsive.tsx`.

### Part E — Prompt safety language

Every variance injection includes this stock line at the end:

> Variance is informational. Choose what FITS the brief best. If today's brief and signals genuinely call for something recent, use it.

This is the "fit > novelty" guarantee, repeated in every variance section so it can't get lost in prompt revisions.

## Acceptance criteria

- [ ] `scripts/utils/archetype-variance.js` exists with the same export shape as `color-mandate.js`
- [ ] `scripts/utils/chassis-variance.js` exists with the same export shape
- [ ] Both inject into the appropriate prompts via the same orchestrator pattern as `colorMandateSection`
- [ ] `/dev/variance` dashboard renders with 5 visualizations populated from real archive data
- [ ] After 14 days running, the dashboard shows non-trivial diversity in archetype and chassis without spec-critic revision rate spiking
- [ ] No hard rejection paths — model is never blocked from picking a recently-used archetype/chassis if it justifies the choice
- [ ] If an archetype is genuinely the right call N days in a row, the model picks it N days in a row (test by manually overriding signals to force a "specimen day" twice — second day should still pick specimen if it fits)

## Risks

- **Over-correction toward novelty.** If the prompt language tilts too far, the model picks rare archetypes for novelty's sake even when they don't fit. Mitigation: Part E stock language; eye-test acceptance criterion above.
- **Prompt bloat.** Each variance section adds ~6 lines × multiple dimensions. Mitigation: hard cap each formatter at 6 lines; keep injection terse.
- **Chassis tracking gap.** If chassis isn't currently persisted per-build, Part B requires a small instrumentation change. Verify at execution time.
- **Dashboard becomes the goal.** It's easy to over-tune from a dashboard. Treat the dashboard as informational — only act on patterns visible across 30+ days.

## Out of scope (future)

- Hard rules (e.g., "no archetype repeat within N days"). If, after 30 days of soft variance, designs still feel repetitive, revisit.
- Auto-tuning weights based on variance metrics (closed-loop control). Possible later — not now.
- A "variance score" that summarizes diversity in a single number. Possible later — pick the right metric only after seeing real data on the dashboard.
