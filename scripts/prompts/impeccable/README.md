# Vendored: impeccable

This directory contains a vendored copy of selected files from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — a Claude Code skill that provides design vocabulary and anti-patterns to combat generic AI design output.

## What's vendored

- `LICENSE` and `NOTICE.md` — Apache 2.0 license and upstream attribution (preserved verbatim per Apache 2.0 §4)
- `SKILL.md` — the master skill file, kept for context (we don't load it as a Claude Code skill — our pipeline is autonomous, not interactive)
- `reference/` — 17 reference files used directly by our pipeline agent prompts

## How we use it

Our autonomous design pipeline (`scripts/design-agents.js`) loads these reference files into agent system prompts. Specifically:

| Reference file | Used by |
|---|---|
| `color-and-contrast.md` | art-director, mockup-designer |
| `typography.md` | art-director, mockup-designer |
| `spatial-design.md` | mockup-designer |
| `polish.md` | mockup-designer (user prompt — system prompt is at its size budget) |
| `bolder.md` | mockup-designer (only on committed/drenched color days) |
| `responsive-design.md` | not loaded directly — its rules are salvaged into mockup-designer.md's Responsive section |
| `brand.md` | all design agents (we are brand register) |
| `critique.md` | screenshot-critic, mockup-critic |

## What we don't use

- The 23 user-invocable commands (`/impeccable craft`, `/impeccable shape`, etc.) — our pipeline is autonomous and runs the same agent flow daily without user interaction.
- The PRODUCT.md / DESIGN.md scaffolding — our pipeline uses `signals/profile.yml` and the daily creative brief instead.
- The `live` browser-iteration mode — we have `/dev/responsive` for that.

## Refresh policy

Vendored from upstream commit `5f5e2b01` (impeccable v3.0.4, 2026-04-28).

To refresh, see the file list at the top of `scripts/prompts/impeccable/` and re-download from
`https://github.com/pbakaus/impeccable/tree/main/source/skills/impeccable/`. Update this README's
commit reference when you do.

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE) and [`NOTICE.md`](./NOTICE.md).

Modifications by this project: none. Files are vendored verbatim.
