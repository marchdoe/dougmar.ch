# sketchbook: the dougmar.ch vault

This vault is the memory for dougmar.ch, a portfolio that redesigns itself every night. Its subject is design. It also holds the build docs: specs, plans, ADRs and research. Claude owns and maintains it. Doug curates sources and asks questions. Everything is plain markdown. Obsidian is the human interface, and git is the safety net.

Start every piece of work from [[The Four Pillars]]. A spec, gate, prompt or PR should say which pillar it serves.

## What lives here and what doesn't

The pipeline reads some files at fixed paths, so they stay outside the vault: `signals/taste.md`, `signals/voice.md`, `signals/profile.yml`, `references/`, `archive/`, `docs/evidence/`. The vault links to them and never moves them. Never edit `archive/`, `public/archive*` or `docs/evidence/canary/`. Those are the build history.

## Structure

- `raw/` holds sources Doug drops in. Read-only to Claude. After ingesting a file, move it to `raw/processed/`.
- `wiki/` holds every page, in one folder per area. Each area can have `spec/`, `plan/` and `knowledge/` subfolders. Create a subfolder the first time it needs a page.
  - `taste/` covers Doug's point of view and the feedback loop: ratings, taste notes, references.
  - `pipeline/` covers the nightly run: agents, prompts, gates, critics, repair.
  - `site/` covers the TanStack Start app, the archive, `/how/<date>` and `/panel`.
  - `core/` is cross-cutting: CI, dependencies, deploys.
- `wiki/The Four Pillars.md` is the root note.
- `wiki/Design MOC.md` (the subject) and `wiki/dougmar.ch MOC.md` (the build) are the hubs.
- `wiki/CONTEXT.md` is the glossary (night, run, gate, slate…). Use its words.
- `index.md` is home. `log.md` is the append-only ledger.

`[[wikilinks]]` resolve by page name, whatever folder the page is in.

## Page conventions

- The filename is the page title, in Title Case with spaces (`Feedback Channels.md`). Headings inside a page use sentence case.
- One page per concept. If a page already exists, update it rather than adding a duplicate.
- Link every concept you mention to its page. If the page doesn't exist yet, create a stub.
- Specs and plans keep their number: `Spec 12 - Live Rail.md`, `Plan 10 - Mobile First Fixes.md`. The next spec is 13. ADRs continue from `ADR 0001`.
- Every page has frontmatter:

  ```yaml
  ---
  type: knowledge
  tags: [area/taste]
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  aliases: []
  sources: []
  status: living
  verified: YYYY-MM-DD   # optional: knowledge about a live system, last checked against it
  ---
  ```

  | `type` | What it is | Allowed `status` |
  |---|---|---|
  | `concept` `entity` `source` `synthesis` `query` | design knowledge | `stub` `draft` `published` |
  | `knowledge` | build reference: gotchas, how the system works, research | `stub` `draft` `published` `living` |
  | `moc` `roadmap` | hubs and dashboards | `living` |
  | `adr` | a hard-to-reverse decision | `draft` `accepted` `superseded` |
  | `spec` `plan` | designs and phased plans | `draft` `ready` `in-progress` `shipped` `parked` `superseded` |

  Whenever you check a `knowledge` page against the code, set `verified` to that day's date. Write the numbers on the page with a date, because counts like unrated nights go stale.

## Tags

- Design: `#type` `#colour` `#composition` `#gesture` `#reference` `#pillar`
- Build: `#project` `#spec` `#plan` `#adr` `#decision` `#research` `#glossary`, plus `#area/taste` `#area/pipeline` `#area/site` `#area/core`
- Mechanics: `#moc` `#source` `#synthesis` `#query`

## Maps of content

`index.md` links to `[[The Four Pillars]]`, `[[Design MOC]]` and `[[dougmar.ch MOC]]`. `[[dougmar.ch MOC]]` links to the four area MOCs, each at the root of its folder. A new page gets linked from its area MOC, and also from `[[Design MOC]]` if it's design knowledge. Don't link it from `index.md`.

## Work tracking

[GitHub issues](https://github.com/marchdoe/dougmar.ch/issues) are the ticket store. `[[Roadmap]]` is the dashboard that links to them. Each entry names its pillar and status (in progress, blocked, later). When an item ships, move it to `[[Completed Work]]`.

## Loops

**Ingest** (a new file in `raw/`). Read it. Create or update the pages it covers, with dense links. Write a `#source` summary that lists the raw file in `sources:`. Update the MOCs. Append to `log.md`. Move the file to `raw/processed/`.

**Query** (a question). Route through `index.md` and the tags, read the relevant pages, and answer with `[[links]]`. If the answer will be useful again, file it as a `#synthesis` page.

**Distill** (when work ships). Decisions become ADRs, gotchas become `knowledge/` pages, and statuses go into `[[Roadmap]]`. Issues and PRs are where work happens. The vault is where what we learned gets kept. When Doug repeats a complaint about a design, record it in `signals/taste.md` and propose a gate (pillar 2).

**Lint** (on request). Fix dead links, orphans, missing frontmatter, stale `updated` dates and MOC entries that don't exist. Report what you found before fixing it.

**Ledger.** Every create, update, move or ingest appends one line to `log.md`: `## [YYYY-MM-DD] <action> | <Title>`.

## Git

Commit vault changes with a `wiki:` prefix. Stage files by explicit path.
