# Domain docs

The domain docs live in the `sketchbook/` vault. The rules are in `sketchbook/CLAUDE.md`.

- Glossary: `sketchbook/wiki/CONTEXT.md`. Use its words in code, issues and PRs.
- ADRs: `sketchbook/wiki/<area>/knowledge/ADR NNNN - Title.md`, numbered from `ADR 0001`. Cross-cutting ones go in `core/`.
- Specs and plans: `sketchbook/wiki/<area>/spec/` and `plan/`, numbered from 13.
- Root note: `sketchbook/wiki/The Four Pillars.md`. Each spec and ADR names the pillar it serves.

If a proposal contradicts an ADR, flag it before going ahead. If one of these files doesn't exist yet, carry on without it. Link each new page from its area MOC and append a line to `sketchbook/log.md`.
