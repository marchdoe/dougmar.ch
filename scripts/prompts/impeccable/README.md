# Vendored: impeccable

This directory contains a vendored copy of selected files from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — a Claude Code skill that provides design vocabulary and anti-patterns to combat generic AI design output.

## What's vendored

- `LICENSE` and `NOTICE.md` — Apache 2.0 license and upstream attribution (preserved verbatim per Apache 2.0 §4)
- `reference/` — the 8 reference files our pipeline agent prompts load

## How we use it

Our autonomous design pipeline (`scripts/design-agents.js`) loads these reference files into agent system prompts. Specifically:

| Reference file | Used by |
|---|---|
| `color-and-contrast.md` | art-director, mockup-designer |
| `typography.md` | art-director, mockup-designer |
| `spatial-design.md` | mockup-designer |
| `polish.md` | mockup-designer (user prompt — system prompt is at its size budget) |
| `bolder.md` | mockup-designer (only on committed/drenched color days) |
| `motion-design.md` | react-engineer (only on nights that declare motion) |
| `brand.md` | all design agents (we are brand register) |
| `critique.md` | screenshot-critic, mockup-critic |

## What we don't use

- The 23 user-invocable commands (`/impeccable craft`, `/impeccable shape`, etc.) — our pipeline is autonomous and runs the same agent flow daily without user interaction.
- The PRODUCT.md / DESIGN.md scaffolding — our pipeline uses `signals/profile.yml` and the daily creative brief instead.
- The `live` browser-iteration mode — we have `/dev/responsive` for that.

## Refresh policy

Vendored from upstream commit `5f5e2b01` (impeccable v3.0.4, 2026-04-28).

To refresh, re-download the files in `reference/` from
`https://github.com/pbakaus/impeccable/tree/main/source/skills/impeccable/`. Update this README's
commit reference when you do.

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE) and [`NOTICE.md`](./NOTICE.md).

Modifications by this project:

- Removed `SKILL.md` and the reference files no prompt loaded (cognitive-load, delight, distill, heuristics-scoring, interaction-design, overdrive, quieter, responsive-design, ux-writing).
- `critique.md`: removed the instructions for interactive use (sub-agents, browser tabs, the `npx impeccable` detector, questions for the user, recommended commands) and the links to files that are not here.
- `polish.md` and `typography.md`: the text-size floors are `{{SMALL_COPY_FLOOR_PX}}` and `{{SMALL_TEXT_FLOOR_PX}}` tokens, filled by the prompt loader.
