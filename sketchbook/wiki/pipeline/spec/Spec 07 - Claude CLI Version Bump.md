---
type: spec
tags: [spec, area/pipeline]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: ready
---

# Spec 07 — Bump Claude CLI past 2.1.92

**Status:** ready to execute
**Depends on:** none
**Cost:** $0 — entire test loop runs locally on Max plan auth

## Goal

Move the pinned Claude CLI version past `2.1.92` (latest as of writing: `2.1.120`), unlocking CLI improvements while verifying the original "0KB output for large prompts" regression (PR #40, March 2026) is no longer present.

## Why this is testable locally

The CLI binary is the same in both environments — the only difference is auth mode:

- **CI** — `ANTHROPIC_API_KEY` env var present → CLI uses the API
- **Local** — env var absent → CLI uses Max plan subscription

The original failure was about **CLI prompt-handling behavior with large (~56KB) inputs** — upstream of auth. Local exercise of the CLI tests the same code path that broke.

## Approach

### Phase 1 — Local discovery (no cost)

1. Install the candidate CLI version locally:
   ```
   npm install -g @anthropic-ai/claude-code@2.1.120
   ```
2. Run the daily redesign pipeline locally with the largest realistic prompt:
   ```
   node scripts/daily-redesign.js
   ```
   (Max plan auth picks up automatically because `ANTHROPIC_API_KEY` is absent from `.env` — confirmed by project convention.)
3. Verify each agent stage produces non-empty output:
   - interpret-signals → brief written
   - design-director → visual spec captured
   - token-designer → preset.ts + __root.tsx written, non-zero size
   - unified-designer → all expected files written, each non-zero (this is the stage that historically failed with 0KB output)
   - screenshot-critic → review captured
4. Inspect output quality — eye-test against a recent production build.

### Phase 2 — Binary search if Phase 1 fails

If `2.1.120` produces 0KB output (or any other regression):

- Try `2.1.93` (the version immediately after the pinned one). If it works, the regression came in 2.1.94 — test 2.1.94 to confirm, then walk forward to find the last good version
- If 2.1.93 fails, the regression spans the entire 2.1.93+ range — file an issue with Anthropic and stay on 2.1.92

### Phase 3 — CI confidence check (~$2)

Once a local-passing version is identified:

1. Update the pin in `.github/workflows/daily-redesign.yml:47`
2. Trigger one `workflow_dispatch` with `dry_run: true`
3. Verify the run completes end-to-end with non-empty designer output
4. If pass: merge the pin bump
5. If fail despite local pass: revert pin, document the divergence, file an issue

## Acceptance criteria

- [ ] Local run with new CLI version produces non-empty output at every agent stage
- [ ] Output quality is at parity with recent production builds (eye test, no obvious regressions)
- [ ] CI dry-run completes successfully
- [ ] Pin updated, change committed, no rollback needed within 7 days of bump

## Risks

- **Local CLI behavior may diverge from CI in subtle ways.** Mitigation: Phase 3 dry-run before declaring done.
- **Max plan rate limits during testing.** If multiple full runs are needed, queue them. Not a $-cost issue, just a wall-clock pacing one.
- **Newer CLI may have different default behavior.** E.g., model selection defaults, tool defaults. The pipeline pins models per-agent (`claude-cli.js:58`) so this should be insulated. Verify per-agent options still parse on the new CLI.

## Out of scope

- Updating to a CLI major version (`@latest` could be 3.x someday). This spec covers minor/patch bumps within 2.x.
- Replacing the CLI with the Anthropic SDK across all agents. The interpret-signals stage already uses the SDK in API mode; design-agents stages use the CLI in both modes by design.
