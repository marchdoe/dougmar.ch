# Mobile-first fixes: phased plan

**Date:** 2026-09-06
**Source:** `docs/research/2026-09-06-mobile-first-analysis.md`
**Rule:** one PR per issue, each branched from `origin/main`, no stacks. Merge only through the gate script once all five CI jobs pass.

## Batch 1: independent files, start now

| issue | branch | files | model |
|---|---|---|---|
| #464 `/work` and `/experiments` at 360 | `fix/464-authored-routes-360` | `app/routes/work.index.tsx`, `app/routes/experiments.tsx` | Sonnet |
| #465 clipped detector sees text wider than its box | `fix/465-text-overflow-clipped` | `scripts/utils/surface-gate.js`, tests | default |
| #468 NEEDS-HUMAN written always, read by the workflow | `fix/468-needs-human-routing` | `scripts/design-agents.js`, `.github/workflows/daily-redesign.yml`, tests | Sonnet |
| #469 `xl` fluid, scorer measures running copy only | `fix/469-xl-fluid-body-check` | `scripts/utils/chassis.js` (or `scale.js`), `scripts/utils/responsive-scorer.js`, prompts that state step facts, tests | default |

## Batch 2: the critic loop, after batch 1 merges

| issue | branch | files | model |
|---|---|---|---|
| #466 critics get the whole phone, rating issue gets the 360 capture | `feat/466-phone-filmstrip` | `scripts/utils/snapshot.js`, `scripts/agents/*-critic.js`, critic prompts, `daily-redesign.yml` | default |
| #467 re-judge the build that ships | `feat/467-rejudge-final-build` | `scripts/design-agents.js`, tests | default |
| #470 Art Director gets a mobile lesson | `feat/470-ad-mobile-lesson` | `scripts/utils/lessons.js`, `scripts/design-agents.js`, `scripts/prompts/art-director.md` | default |

## Batch 3: the design change, after a decision

| issue | branch | shape |
|---|---|---|
| #452 the composition's mobile form | `feat/452-mobile-clause` | recommended: a ninth axis `collapse` with a fixed value list plus a required `===MOBILE===` block; canary before merge |

## Decisions that gate work

1. Final-round 360 errors: fail the night, or ship with the fault logged. Affects #467.
2. #452: axis with fixed values, or free prose. Affects batch 3.

## Verification, every PR

- `pnpm biome check`, `pnpm tsc --noEmit`, `GITHUB_ACTIONS=true CI=true pnpm vitest run`, `pnpm fallow audit --base origin/main` (new-only gate).
- Anything visual: measure at 360 through a preview server and embed before/after captures in the PR under `docs/evidence/<issue>/`.
- Pipeline changes: `MOCK_MODE=true node scripts/design-agents.js` with `signals/today.yml` in place, or the swarm harness, before opening the PR.
