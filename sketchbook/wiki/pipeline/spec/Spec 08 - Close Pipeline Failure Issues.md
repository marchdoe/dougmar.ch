---
type: spec
tags: [spec, area/pipeline]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: ready
---

# Spec 08 — Close resolved pipeline-failure GitHub issues

**Status:** ready to execute
**Depends on:** none
**Estimated effort:** 30 minutes (mostly investigating the three unknowns)

## Goal

Triage and close the eight open issues with the `pipeline-failure` label. Five have known causes already resolved. Three pre-date the recent failures and need a quick look to determine whether they were transient or symptomatic of a real bug.

## Inventory

| Issue | Date | Cause | Resolved by | Action |
|-------|------|-------|-------------|--------|
| [#54](https://github.com/marchdoe/doug-march.com/issues/54) | 2026-04-25 | Error-sniff false positive on valid brief | PR #55 (merged 2026-04-26) | Close — comment refs PR #55 |
| [#53](https://github.com/marchdoe/doug-march.com/issues/53) | 2026-04-24 | Anthropic API credit balance depleted | Credits topped up 2026-04-26 | Close — comment refs top-up |
| [#52](https://github.com/marchdoe/doug-march.com/issues/52) | 2026-04-23 | Anthropic API credit balance depleted | Credits topped up 2026-04-26 | Close — comment refs top-up |
| [#51](https://github.com/marchdoe/doug-march.com/issues/51) | 2026-04-22 | Anthropic API credit balance depleted | Credits topped up 2026-04-26 | Close — comment refs top-up |
| [#50](https://github.com/marchdoe/doug-march.com/issues/50) | 2026-04-21 | Anthropic API credit balance depleted | Credits topped up 2026-04-26 | Close — comment refs top-up |
| [#48](https://github.com/marchdoe/doug-march.com/issues/48) | 2026-04-16 | **Unknown** | — | Investigate (see below) |
| [#45](https://github.com/marchdoe/doug-march.com/issues/45) | 2026-04-14 | **Unknown** | — | Investigate (see below) |
| [#43](https://github.com/marchdoe/doug-march.com/issues/43) | 2026-04-12 | **Unknown** | — | Investigate (see below) |

## Implementation outline

### Step 1 — Close the five known

For each of #54, #53, #52, #51, #50:

```
gh issue close <num> --comment "Resolved — see <reference>. <one-line context>."
```

Reference for #54: `PR #55`. Reference for the rest: `top-up on 2026-04-26 + 4 successful runs since`.

### Step 2 — Investigate the three unknowns

For each of #48 (2026-04-16), #45 (2026-04-14), #43 (2026-04-12):

1. Look at the issue body — it contains a link to the original Actions run
2. Pull the failed log:
   ```
   gh run view <run_id> --log-failed | grep -E "(Error|error|FAIL|##\[error)"
   ```
3. Categorize the failure into one of:
   - **Transient infra** (runner / network / Vercel hiccup) → close as `Resolved — transient`
   - **Same root cause as #50–53** (credit issue chain that started earlier) → close as `Resolved — credits`
   - **Real bug not yet fixed** → leave open, retitle to describe the actual bug, remove `pipeline-failure` label, replace with `bug`. File a new issue if the existing title obscures the real problem.
   - **Real bug already fixed** → close with comment naming the fixing PR

### Step 3 — Group orphan bugs (if any)

If Step 2 turns up a real, unfixed bug across multiple of the three unknowns, open one consolidated issue describing the underlying problem and link the original three to it before closing them.

## Acceptance criteria

- [ ] All eight issues are either closed (with descriptive comment + reference) or relabeled to a non-`pipeline-failure` category with an accurate title
- [ ] No remaining `pipeline-failure` issues are stale (older than the most recent successful runs without explanation)
- [ ] If a real bug surfaces in Step 2, it has a tracking issue and a clear next step (or is fixed and closed)

## Risks

- **Hiding a real bug.** Mitigation: don't bulk-close the unknowns; categorize each via the failed-log step.
- **Lost context if we close too aggressively.** Mitigation: every close comment names the resolution explicitly so future searches surface the cause.

## Out of scope

- Building automated triage for future pipeline-failure issues. The notification workflow already creates these issues on every failure (`.github/workflows/daily-redesign.yml:93-114`); auto-closing them on the next successful run is a future improvement, not part of this spec.
