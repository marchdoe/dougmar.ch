> **SUPERSEDED** by the design-quality pipeline spec of 2026-06-11 (implemented 2026-06). That spec lived under `docs/superpowers/`, which #550 removed; it stays in git history.

# Spec 02 — Designer / React Engineer split

**Status:** ready to execute
**Depends on:** none (independent of Spec 01)
**Mode scope:** API path. MOCK_MODE inherits the same orchestration; CLI calls per-agent stay text-only.

## Goal

Replace `unified-designer` (one agent that does both visual design and React/Panda translation) with two agents in series:

1. **Mockup designer** — produces a self-contained HTML/CSS mockup
2. **React engineer** — translates mockup → React/Panda implementation

Two outcomes drive this:

- **Better designs.** Splitting visual taste from React mechanics removes cognitive load from the agent making composition decisions.
- **A real design archive.** A standalone HTML mockup is naturally archivable — every day produces a static file that can be opened directly without the dev server, giving the archive page real "scrub through prior days" depth.

## Prior art — important context

There was a previous multi-agent split (`scripts/prompts/sidebar-designer.md`, `footer-designer.md`, `structure-agent.md`, `component-agent.md`) that was consolidated back into `unified-designer` on branch `feat/designer-unify`. Those files are orphaned in the repo today.

The earlier split was **by component** — every component-agent had to redo design judgment for its slice. This new split is **by role** — one designer makes all visual decisions in one shot; one engineer does pure translation. Categorically different concern. Cleanup of the orphaned by-component prompts is part of this spec.

## Decisions

| Question | Decision | Rationale |
|---------|----------|-----------|
| Mockup designer model | **Opus 4.7** | `unified-designer` already runs on Opus today — taste-critical work. No change. |
| React engineer model | **Sonnet 4.6** | Mechanical HTML/CSS → React/Panda translation. Sonnet handles complex code translation well; Haiku risks losing CSS subtleties. |
| Designer output format | **Standalone HTML/CSS document** | Self-contained, no runtime deps, archive-ready. Inline `<style>` block, no external dependencies, no React. |
| Spec-critic position | **Both** — existing spec-critic (visual spec review) **+** new mockup-critic (HTML/CSS review before engineering) | Catches taste issues before they're locked into React. screenshot-critic still reviews final rendered output. |
| Rollout | **Hard replace** | `unified-designer.md` is retired. No fallback path. Existing retry/fallback machinery in `design-agents.js` is reused on the new agents. |

### What stays unchanged (extend, do not overwrite)

| Asset | Why it stays |
|-------|-------------|
| `design-director.md` | Produces the visual spec — input to mockup-designer |
| `spec-critic.md` | Reviews the visual spec (existing flow) |
| `token-designer.md` | Produces design tokens — both new agents read them. (Chaos mode is Spec 03.) |
| `screenshot-critic.md` | Reviews final rendered React output |
| `library-*.md` (color, layout, typography, components) | Referenced by both mockup-designer and react-engineer |
| `design-system-reference.md` | Referenced by both new agents |

### What's new

- `scripts/prompts/mockup-designer.md`
- `scripts/prompts/react-engineer.md`
- `scripts/prompts/mockup-critic.md`

### What's removed

- `scripts/prompts/unified-designer.md`
- `scripts/prompts/sidebar-designer.md` (orphan from prior split)
- `scripts/prompts/footer-designer.md` (orphan from prior split)
- `scripts/prompts/structure-agent.md` (orphan from prior split)
- `scripts/prompts/component-agent.md` (orphan from prior split)

## Implementation outline

### 1. Mockup designer (`mockup-designer.md`)

Inputs:
- Visual spec (from design-director)
- Design tokens (from token-designer)
- Awwwards screenshots — image content blocks once Spec 01 lands
- Today's signals brief

Output: a single HTML file with inline `<style>` and inline SVGs (no external assets). No React, no Panda, no JS frameworks. Real content from the portfolio data, not lorem ipsum.

The prompt should explicitly tell it: "you are not writing React. you are designing a website. the engineer will translate your work."

### 2. Mockup critic (`mockup-critic.md`)

Reads the HTML/CSS mockup and returns either `APPROVE` or `REVISE` + feedback. Reviews:
- Composition matches the visual spec's archetype declaration
- Token usage matches the token-designer's preset (no off-palette colors)
- Mobile/responsive section present (post-PR #49 requirement)
- No obvious dead-end CSS (z-index spaghetti, broken positioning)

On `REVISE`, the mockup-designer gets one revision attempt, mirroring the existing spec-critic loop.

### 3. React engineer (`react-engineer.md`)

Inputs:
- The approved HTML/CSS mockup
- Design tokens preset
- Library references (color/layout/typography/components)
- Technical contracts (route file paths, what each file must export)

Output: the same set of files `unified-designer` produces today — `app/components/Layout.tsx`, `Sidebar.tsx`, route files, `elements/preset.ts`, `elements/__root.tsx`. Translation only — no design re-decisions.

The prompt should be strict: "if the mockup says it, you implement it. do not improve it. do not adapt it. translate."

### 4. Pipeline orchestration (`scripts/design-agents.js`)

Replace the single `unified-designer` call (`design-agents.js:1052`) with:

```
mockup = callAgent('mockup-designer', ..., { model: 'opus' })
critique = callAgent('mockup-critic', mockup, { model: 'haiku' })
if (critique.verdict === 'REVISE') mockup = callAgent('mockup-designer', ..., revisionPrompt)
files = callAgent('react-engineer', { mockup, tokens, libraries }, { model: 'sonnet' })
```

Reuse the existing retry-on-build-error path — replace `'unified-designer'` with `'react-engineer'` in:
- `STRUCTURE_FILES.map(...)` and `COMPONENT_FILES.map(...)` ownership table (`design-agents.js:55-57`)
- All `responsibleAgent === 'unified-designer'` branches in screenshot-critic and build-failure retry blocks

### 5. Archive integration

- Save the approved mockup to `public/archive/$date/mockup.html` during the build step
- Add `mockupPath` (or just rely on convention) to `public/archive/$date/_detail.json`
- `app/routes/archive.$date.tsx` — add a "Mockup" link/section near the existing "View archived site" anchor (~line 514). Open in new tab; could also embed in an iframe with a "fullscreen" affordance.
- Archive index (`app/routes/archive.tsx`) gets no changes — the row layout still surfaces archetype + brief.

## Acceptance criteria

- [ ] Three new prompt files exist and are wired through `callAgent`
- [ ] Five orphan prompts deleted
- [ ] One scheduled run completes end-to-end producing both mockup.html and React output
- [ ] Mockup opens in a browser with no JS errors and no missing assets
- [ ] Live site (React build) visually matches mockup at desktop breakpoint (eye test, 3 consecutive days)
- [ ] Archive detail page exposes the mockup link
- [ ] Run cost increase ≤ +$0.50/run versus unified baseline
- [ ] No regression in screenshot-critic pass rate over 5 days

## Risks

- **Translation fidelity loss.** React engineer might subtly drift from the mockup. Mitigation: mockup-critic catches taste issues before engineering; screenshot-critic catches them after. If drift becomes recurring, tighten react-engineer prompt with diff-style examples.
- **Cost.** Adding a Sonnet call per run. Tracked; tolerable per the "best model per role" directive.
- **Re-introducing the consolidation pain.** Past split failed because component-level agents duplicated design judgment. This split puts all design judgment in one agent; engineer is downstream and dumb. Different shape — should not recreate the problem, but worth flagging in the postmortem if quality regresses.
- **Opus availability.** Same risk as today (unified is on Opus). No new exposure.
