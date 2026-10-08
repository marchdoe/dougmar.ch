---
type: spec
tags: [spec, area/pipeline]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: parked
---

# Spec 03 — Chaos mode (palette + typography)

**Status:** ready to execute
**Depends on:** none (independent of Specs 01 and 02)
**Mode scope:** API + MOCK_MODE — chassis catalog and prompt changes apply uniformly

## Goal

Push the daily design toward bolder, more characterful palettes and typography when the risk dial is high. Today's pipeline already biases toward vibrancy, but the directives are generic ("BOLD, EXPERIMENTAL") with no concrete commitment to an aesthetic vibe. Chaos mode supplies that commitment via 5 named aesthetic vibes — at high risk, the agents pick one vibe and follow its rules.

## Existing systems we're extending (DO NOT overwrite)

This spec is layered on top of three systems that already work:

| System | Where | Today's behavior |
|--------|-------|-----------------|
| Creative weights | `scripts/interpret-signals.js:383-388`, `scripts/design-agents.js:425-491` | All four weights (signals, inspiration, ratings, risk) are env-var driven, default 5/10, already injected into every agent's prompt via `weightsPrompt` |
| Risk directive | `scripts/design-agents.js:491` | When `WEIGHT_RISK >= 7`, every agent receives `"The owner wants BOLD, EXPERIMENTAL design today. Push boundaries."`. When `<= 3`, receives `"SAFE, POLISHED design today. Proven patterns."`. Otherwise nothing. |
| Typography chassis | `elements/chassis/index.js` + `scripts/utils/chassis.js` | Director picks one entry from `CHASSIS_CATALOG` based on mood + archetype tags. Orchestrator deterministically merges fonts + fontSizes. v1 scope: fonts + scale ratio only — spacing/colors stay with token-designer. Catalog today has 2 entries. |
| Color philosophy | `scripts/prompts/token-designer.md:7` | "Favor vibrancy by default. Most days should feel alive — saturated accents, warm or cool but never grey." Default already biases bold. |

**No new env vars. No new orchestration paths. No new agents.** Chaos is a content/catalog change.

## Decisions

| Question | Decision |
|----------|----------|
| Trigger | Reuse `WEIGHT_RISK` (already wired everywhere) |
| Levels | `<= 4` safe · `5–6` default vibrancy (current behavior) · `>= 7` chaos vibe-anchored · `>= 9` chaos max-axes |
| Domains affected | **Color** (palette count, harmony, saturation) — token-designer prompt extension. **Typography** (font pairing, scale ratio) — new chassis entries. |
| Vibe count | 5 — applied to both domains so a "brutalist" day produces brutalist tokens *and* a brutalist chassis |
| Vibe selection | The agent picks ONE vibe per run, based on today's brief mood. Commits fully — no blending. At risk ≥ 9, the chosen vibe's most extreme axes are pushed. |

## The 5 vibes

Each vibe is a named aesthetic that can be referenced from both the chassis catalog and the token-designer prompt. Vibe names below; concrete rules in implementation sections.

| Vibe | Mood signature |
|------|----------------|
| **Brutalist Web** | Anti-design, raw, system fonts, single-accent collision |
| **Editorial / Magazine** | Refined, type-driven hierarchy, generous whitespace, muted palette + warm accent |
| **Album-Cover / Poster** | Photographic-feeling, intentional tonal collisions, display face dominance |
| **Hyper-Modern Brand** | Stark, single-hero color, custom-feeling display + clean grotesk |
| **Programmer-Aesthetic** | Mono-dominant, primary colors against neutral, dense info |

## Implementation outline

### Part A — Typography chaos (chassis catalog)

`elements/chassis/` currently ships 2 entries. Add 5 new chassis — one per vibe. Each chassis is a real Google Fonts pairing with weights, scale ratio, and mood/archetype tags (existing convention, see `elements/chassis/types.js`).

Suggested chassis (final font picks made during execution):

| Vibe | Chassis name | Heading | Body | Scale | Tagged moods |
|------|------|---------|------|-------|--------------|
| Brutalist Web | `space-mono-system` | Space Mono | system-ui | 2.0 | raw, defiant, anti-design |
| Editorial | `dm-serif-display-inter` (companion to existing `playfair-outfit`) | DM Serif Display | Inter | 1.618 | refined, contemplative, dense |
| Album-Cover | `bodoni-moda-inter` | Bodoni Moda | Inter | 1.5 | dramatic, photographic, contrast |
| Hyper-Modern Brand | `inter-tight-extreme` | Inter Tight Black | Inter Regular | 2.0 | stark, branded, confident |
| Programmer-Aesthetic | `jetbrains-mono-only` | JetBrains Mono | JetBrains Mono | 1.25 | technical, dense, deliberate |

For each:
1. Verify all weights exist on `fonts.google.com/specimen/<family>` (per existing chassis convention)
2. Author the chassis file (`elements/chassis/<name>.js`)
3. Tag with moods + archetypes
4. Append to `CHASSIS_CATALOG` in `elements/chassis/index.js`
5. Run `scripts/preview-chassis.js` to render proofs

The Director's chassis-selection logic already filters by mood/archetype — at high risk, the bolder chassis become eligible naturally because the brief uses bolder mood language.

### Part B — Color chaos (token-designer prompt extension)

Extend `scripts/prompts/token-designer.md` with a new section: `## Chaos Mode (when the risk weight indicates BOLD)`.

This section sits *after* the existing "Color Philosophy" and "Color Mandate" sections so they remain the baseline. Triggered by the existing `BOLD, EXPERIMENTAL` directive that token-designer already receives via `weightsPrompt`.

Section contents:

```
When today's risk directive says "BOLD, EXPERIMENTAL" — commit to ONE of these
five vibes for your palette. Pick what FITS the brief, not what's most extreme.

1. Brutalist Web — 2-3 colors max. One fully-saturated accent (hot pink,
   electric blue, magenta, signal red) against pure neutrals (#000, #fff, #f0f0f0).
   No mid-tones.

2. Editorial / Magazine — 4-6 colors. Refined: burgundy, cream, ink, mustard,
   forest. Saturation: muted with one warm accent at full saturation.

3. Album-Cover / Poster — 3-5 colors. Photographic-feeling: dusty rose, faded
   orange, deep navy, washed cream. Medium-high saturation. ONE bold tonal
   collision (e.g., hot pink anchor against muted earth).

4. Hyper-Modern Brand — 3 colors total. One hero (saturated, signature) +
   black + white. OR hero + one muted neutral + white. Stark.

5. Programmer-Aesthetic — Primary colors (red/yellow/blue) at full saturation
   against neutral background. No tints. Bold borders. Color-as-data.

Pick ONE. Commit. Do not blend.

If the risk weight is >= 9 ("MAX CHAOS"), push the chosen vibe's defining
axis harder:
- Brutalist: drop to 2 colors only, push accent to neon
- Editorial: tighten to 4 colors, increase scale contrast (matches chassis)
- Album-Cover: amplify the tonal collision
- Hyper-Modern Brand: 2 colors only (hero + black, no neutrals)
- Programmer-Aesthetic: stay 3 colors, push to fluorescent primary

Coordinate with the chassis. If today's chassis is `space-mono-system`, lean
Brutalist. If `bodoni-moda-inter`, lean Album-Cover. If `jetbrains-mono-only`,
lean Programmer. The chassis tells you the typography vibe — your job is the
coherent color answer to that vibe.
```

### Part C — Verify chassis identifier reaches token-designer

The chassis vibe coordination in Part B requires token-designer to know which chassis was selected. Today's flow: Director picks chassis → orchestrator merges into preset → token-designer runs.

**During execution, verify** that token-designer's user prompt receives the chassis name (or at minimum, its mood/archetype tags). If not, thread the chassis identifier through `buildAgentPrompt` for `token-designer`. Small change — call out in the implementation PR.

### Part D — Workflow override (optional)

Add `WEIGHT_RISK` as a `workflow_dispatch` input in `.github/workflows/daily-redesign.yml` so manual runs can dial chaos up without editing code. Cron default stays whatever you decide (5 = current; 7 = bias toward chaos every day).

## Acceptance criteria

- [ ] All 5 new chassis entries exist, render correctly via `scripts/preview-chassis.js`, and pass the existing chassis tests
- [ ] `CHASSIS_CATALOG` length = 7 (2 existing + 5 new)
- [ ] Token-designer prompt has the chaos section, layered after existing Color Philosophy (not replacing it)
- [ ] At `WEIGHT_RISK=5`, output is statistically similar to today's baseline (no regression)
- [ ] At `WEIGHT_RISK=8` over 5 manual runs, all 5 vibes appear at least once in the chassis selection log
- [ ] At `WEIGHT_RISK=10`, output is visibly more extreme on the chosen vibe's axis (eye test)
- [ ] Body-text contrast meets WCAG AA (4.5:1) at every chaos level — readability is non-negotiable
- [ ] No breakage in existing `playfair-outfit` and `space-grotesk-work-sans` selection paths
- [ ] Token-designer receives chassis identifier in its user prompt

## Risks

- **Vibe-chassis mismatch.** If Director picks `bodoni-moda-inter` (Album-Cover chassis) but token-designer picks Programmer color vibe, output is incoherent. Mitigation: token-designer prompt explicitly tells it to coordinate with the chassis (Part B). Spec-critic catches the mismatch in revision loop.
- **Readability casualties.** Pushed saturation + display fonts can break body legibility. Mitigation: WCAG AA acceptance criterion + `library-color.md` already enforces a contrast floor.
- **Chassis catalog bloat.** Going from 2 → 7 entries triples Director's selection space. Director currently filters by mood tags — verify filter still produces sensible defaults at low risk (Part D acceptance check).
- **Google Fonts availability.** Each new chassis depends on a Google-hosted family. Verify each at execution time per the chassis catalog convention.

## Out of scope (future)

- A `WEIGHT_CHAOS` independent dial (could decouple from risk later if desired)
- Custom / non-Google fonts in chassis (would need self-hosting infrastructure)
- Auto-vibe-tagging based on signals (currently the agent picks; could become rule-based)
