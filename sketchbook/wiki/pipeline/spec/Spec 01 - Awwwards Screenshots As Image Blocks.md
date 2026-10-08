---
type: spec
tags: [spec, area/pipeline]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: ready
---

# Spec 01 — Awwwards screenshots via API image content blocks

**Status:** ready to execute
**Depends on:** API mode (already live as of 2026-04-26)
**Mode scope:** API path only — MOCK_MODE keeps the current text-only behavior

## Goal

Today the pipeline drops Awwwards SOTD screenshots and only sends the title + description as text to Claude. Replace that with native API image content blocks so all three creative agents have the actual visual reference, not a name.

## Decisions

| Question | Decision |
|---------|----------|
| Which agents receive the screenshots | All three: `interpret-signals`, `token-designer`, `unified-designer` |
| Source format | **base64**, fetched once at signal-collection time |
| Number of screenshots per run | **3** (matches current text cap) |
| Failure handling | If a screenshot fetch fails, skip that one and continue. If all 3 fail, downstream agents fall back to text-only. Never hard-fail the pipeline on inspiration assets. |
| MOCK_MODE | unchanged — CLI stdin can't carry binary content blocks. Image blocks live entirely on the API path. |

**Why base64 over URL blocks:**
- URL blocks force Anthropic to re-fetch on every agent call (3 agents × signal day = 9 fetches). Any awwwards.com hiccup mid-run cascades.
- We already have a signal-collection stage with retry/skip semantics for flaky providers. Fetch once there, persist bytes, and downstream stages get deterministic input.
- Cost delta is negligible — typical og:image PNGs are 100–500KB; 3 × ~300KB ≈ 1MB payload bump per call.

## Implementation outline

### 1. Signal collection — download bytes

`scripts/signals/awwwards.js` already extracts `screenshot_url` from each SOTD's `og:image` (line 75). Extend the collector to:

- Download the bytes for each `screenshot_url` in the top 3 sites
- Convert to base64
- Store on the site object as `screenshot_b64` + `screenshot_media_type` (e.g. `image/png`, `image/jpeg`)
- On fetch failure, log a warning, omit the b64 fields, and continue

Persisted output: `signals/today.yml` gets `screenshot_b64` per site (or, if YAML payload size is a concern, write a sibling `signals/today.images.json` keyed by site URL — see "Storage format" below).

### 2. Pipeline calls — pass image blocks

Three call sites need to thread image content blocks into the user message:

- `scripts/interpret-signals.js` — `callAnthropicAPI` (line 358) currently sends `messages: [{role: 'user', content: prompt}]`. Switch to a content array:
  ```js
  content: [
    ...screenshots.map(s => ({
      type: 'image',
      source: { type: 'base64', media_type: s.media_type, data: s.b64 },
    })),
    { type: 'text', text: prompt },
  ]
  ```
- `scripts/design-agents.js` — `callAgent` flows for `token-designer` and `unified-designer`. Image blocks attach to the user prompt the same way. The `screenshot-critic` already uses base64 image markdown — that path stays unchanged.

### 3. Signal-collection failure semantics

- Each screenshot fetch is independent. One 404 doesn't block the others.
- If 0 of 3 succeed, agents fall back to text-only — same as today.
- Log every fetch result so failures are visible in CI logs without breaking the build.

### 4. Storage format (decide during implementation)

Two options, low-stakes:

- **(a)** Add `screenshot_b64` + `screenshot_media_type` directly to each site object in `signals/today.yml`. Simplest. YAML grows by ~1MB.
- **(b)** Sidecar file `signals/today.images.json` keyed by `slug` or `url`. Keeps YAML readable.

Default to **(a)** unless review of the resulting `today.yml` size is unwieldy.

## Acceptance criteria

- [ ] A scheduled run in API mode produces a brief that references visual elements only the screenshot reveals (e.g., "the SOTD's left-aligned serif masthead" rather than just "Title X")
- [ ] If `og:image` URL returns 404 for one of the 3 sites, run completes successfully with the other 2 + a warning log
- [ ] If all 3 fail, run completes with text-only references — current behavior preserved
- [ ] MOCK_MODE local runs unaffected (no image blocks emitted via CLI)
- [ ] `today.yml` (or sidecar) is human-readable enough to spot-check
- [ ] Token cost per run within ~10% of pre-change baseline (image tokens add up but Haiku 4.5 image costs are modest)

## Risks / open during implementation

- Anthropic API image input limits — confirm current per-image and per-request size caps. Resize to ≤1568px on long edge if needed.
- Awwwards `og:image` URLs occasionally point at JPEG, sometimes PNG. Detect content-type from response headers, don't assume.
- Cache hit interaction — if we use prompt caching, image blocks should be at the front of the content array so they're cacheable across the run's sibling agents on the same day.
