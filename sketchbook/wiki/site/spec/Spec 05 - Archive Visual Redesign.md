---
type: spec
tags: [spec, area/site]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: ready
---

# Spec 05 — Archive visual redesign + Mark-as-reference (owner-only)

**Status:** ready to execute
**Depends on:** Spec 04 (loading skeletons should match the new visual layout)

## Goal

Improve the visual feel of the archive without changing its structure or how it relates to the daily redesign. Plus: bring back the ability to mark an archived design as inspiration for future runs — restricted to the owner.

The archive is a portfolio surface in its own right (not a member of the daily-redesigning live site). It deserves its own permanent identity.

## What we're NOT doing

- The archive does **not** participate in the daily redesign. Its visual language is fixed.
- No structural changes to navigation, routing, or what the archive contains.
- No new public features. The mark-as-reference action is private.

## Decisions

| Question | Decision |
|----------|----------|
| Archive participates in daily redesign? | **No.** Fixed identity. |
| Mark-as-reference availability | **Owner-only**, gated to dev mode (matches existing `dev-panel.tsx` pattern — no new auth) |
| Index row format | **Thumbnail + text** — visual preview alongside archetype + brief |
| Detail page screenshot position | **Hero at top** — visual product leads, then brief/tokens/signals |
| Reference library backend | **Existing** — append to `references/index.yml` + copy screenshot. Pipeline already consumes it via `scripts/collect-references.js` |

## Implementation outline

### Part A — Index page visual upgrade (`app/routes/archive.tsx`)

Today: text-only rows (archetype label + truncated brief + date).

New row layout — thumbnail left, text right:

- Thumbnail: ~160×100 (desktop) / ~96×60 (mobile) — preserves aspect ratio with `object-fit: cover`
- Source: `/archive/$date.png` (the per-day screenshot already produced)
- Fallback for entries without screenshot: a token-derived placeholder — a small gradient or color-block strip using that day's preset colors. Pulls from `_detail.json` (or the existing `entries` payload — extend it if needed to include preset colors)
- Text column: archetype kicker (small caps, dim) → brief truncate → date
- Hover: subtle lift on the thumbnail, brief darkens slightly. No backgroundChange (current row hover swaps bg — drop it, the thumbnail does the visual work now)

Header section keeps "ARCHIVE" / "Daily Redesigns" / intro paragraph but tighten typography: drop h1 to ~28px (it's an archive, not a hero), let the thumbnails carry visual weight.

### Part B — Detail page hero (`app/routes/archive.$date.tsx`)

Reorder sections:

1. **Hero screenshot** (NEW position) — full container width within the existing 720 maxWidth, OR optionally break out to a wider treatment (suggest 1024 max for the screenshot only). 1px border, subtle shadow (`box-shadow: 0 8px 32px rgba(0,0,0,0.08)`), rounded corners (4px).
   - Caption underneath: archetype + date in a small-caps row
   - On hover: cursor pointer, opens the live archived HTML (`/archive/$date/index.html`) in a new tab
2. **Brief section** (moved down, otherwise unchanged) — kicker + h1 brief + rationale
3. **Tokens section** (unchanged)
4. **Signals section** (unchanged)
5. **Actions section** (unchanged) — Back to Archive + View archived site

For days without screenshot: the hero falls back to a styled "no preview" panel (token color blocks arranged into a poster-like composition). Better than skipping the section entirely.

### Part C — Mark-as-reference (owner-only, dev mode only)

Reuse the dev-only gating pattern from `app/dev-panel.tsx`. The button only appears when the site is running in dev mode (`import.meta.env.DEV` or equivalent).

**UI:**
- A small "★ Mark as reference" button below the hero on the detail page (or in a top-right corner of the hero)
- Click → reveal a small inline form with three select fields matching `references/index.yml` schema:
  - `composition` (poster · broadsheet · gallery · scroll · split · stack · specimen · index)
  - `mood` (warm · cold · energetic · calm · dramatic · minimal · playful · serious)
  - `density` (sparse · moderate · dense)
- Optional `description` text input
- Submit → calls a Vite dev-server endpoint (mirror the pattern from `vite.config.ts:81` lines added in commit `d91b3e1`)

**Server side (Vite middleware in `vite.config.ts`):**
- Endpoint: `POST /api/mark-as-reference` (dev-only middleware)
- Body: `{ date, composition, mood, density, description }`
- Action:
  1. Copy `public/archive/$date.png` to `references/$date.png`
  2. Append a YAML entry to `references/index.yml` matching the existing schema (file, url, description, tags)
  3. Return success

User then commits the changes manually. Pipeline picks them up on the next run via `scripts/collect-references.js`.

**Hard gate:** middleware checks `process.env.NODE_ENV !== 'production'` AND request comes from localhost (already an existing pattern in dev-panel infra). Production builds never include the button OR the endpoint.

### Part D — Light identity treatment

The archive is "fixed identity" — meaning consistent across days, not stylized to today's daily redesign. But "fixed" doesn't mean "default browser styles." Define a small set of archive-specific tokens in a single CSS file (`app/styles/archive.css` or inline in the routes):

- Type: one display face for the page header (e.g., a serif like `Fraunces` or `DM Serif Display`), system stack for body
- Color: neutral palette — off-white bg, warm grey text, single accent (pick one — e.g., a deep ink blue or burnt orange)
- Spacing: existing `maxWidth: 720` for detail / `760` for index — keep
- Use CSS variables so it's easy to tweak

Don't over-design. Goal is "this is clearly an archive, not the live site, and it's polished" — not "this has its own complex design system."

## Acceptance criteria

- [ ] Index page rows show a thumbnail + text layout, with a fallback for missing screenshots
- [ ] Detail page leads with the hero screenshot, followed by brief / tokens / signals / actions
- [ ] Hero has a clear "view archived site" affordance (click or explicit link)
- [ ] In `npm run dev`, the detail page shows a "Mark as reference" button; submitting writes to `references/index.yml` and copies the screenshot to `references/`
- [ ] In production build (`npm run build`), the button is absent and the endpoint returns 404
- [ ] Loading skeletons (Spec 04) updated to match the new layouts (thumbnail-shaped block on index rows; hero-shaped block on detail)
- [ ] Archive looks visibly distinct from the live daily-redesigning site — same site, different room
- [ ] No layout shift on slow image load — thumbnails reserve their space

## Risks

- **Thumbnail performance.** Listing 30+ days × ~200KB PNGs = significant bandwidth on the index. Mitigations:
  - Generate WebP variants in the pipeline's screenshot step (smaller files)
  - Lazy-load with `loading="lazy"` on `<img>`
  - Optionally, generate small thumb variants (`$date.thumb.png`) at build time
- **Reference library committing requires the user.** Mark-as-reference writes to disk in dev — user must `git commit && push` for the pipeline to pick it up. Document this clearly in the form's success message.
- **Out-of-scope creep.** "Visual redesign" is open-ended. Lock to the four parts above; further visual work is a separate spec.

## Open questions for the implementer

- WebP/thumb generation can happen as a fast follow if the bandwidth concern doesn't materialize at current archive size (~30 days). Worth measuring before optimizing.
- Whether to break the hero out of the 720 maxWidth on detail — try both at execution time and pick what looks better.
