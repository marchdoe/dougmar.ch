---
type: spec
tags: [spec, area/core]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: ready
---

# Spec 09 — Resolve dependabot alert #325 (follow-redirects)

**Status:** ready to execute
**Depends on:** none
**Estimated effort:** 15 minutes

## Goal

Close [dependabot alert #325](https://github.com/marchdoe/doug-march.com/security/dependabot/325) by upgrading `follow-redirects` to a patched version.

## Vulnerability summary

| Field | Value |
|-------|-------|
| Package | `follow-redirects` |
| Severity | Medium |
| Issue | Leaks custom Authorization headers to cross-domain redirect targets |
| Fixed in | `1.16.0` |
| Status | Transitive dependency — not a direct dependency in `package.json` |

## Implementation outline

### Step 1 — Identify parent

```
pnpm why follow-redirects
```

This shows which top-level dep is pulling in the vulnerable version. Common candidates: `axios`, dev tooling, anything HTTP client-flavored.

### Step 2 — Apply the override

In `package.json`, add or extend `pnpm.overrides`:

```json
{
  "pnpm": {
    "overrides": {
      "follow-redirects": "^1.16.0"
    }
  }
}
```

Use `^1.16.0` (not `>=1.16.0`) so future major-version changes don't sneak in.

If a `pnpm.overrides` block already exists for other packages, add to it — don't create a second.

### Step 3 — Refresh lockfile and test

```
pnpm install
pnpm test
pnpm build
```

The build step is the meaningful integration test for an HTTP-flavored dep — make sure CI-like flow still works end-to-end.

### Step 4 — Verify the fix

```
pnpm why follow-redirects
```

Confirm only `1.16.0` (or higher) appears. No nested duplicates of older versions.

### Step 5 — PR

- Branch: `fix/dependabot-325-follow-redirects`
- Title: `fix(deps): override follow-redirects to ^1.16.0 (CVE-XXXX)` (use the actual CVE from the alert page if listed)
- Body: link the dependabot alert; one-line summary of the vulnerability; confirmation that tests pass
- Once merged, the alert auto-resolves on the next dependabot scan (or close it manually with a "fixed via override" comment)

## Acceptance criteria

- [ ] `pnpm why follow-redirects` shows only versions `>= 1.16.0`
- [ ] `pnpm test` passes
- [ ] `pnpm build` completes successfully
- [ ] Dependabot alert #325 is closed (auto or manual)
- [ ] No new alerts surfaced by the override

## Risks

- **Override breaks a transitive caller.** Older `follow-redirects` versions had a different behavior around redirect-loop detection. Mitigation: tests + build verify the surface we use; if a specific dev tool breaks, address that separately.
- **The override doesn't propagate.** pnpm's override lives in `package.json`; if a dependency uses a different package manager pattern (e.g., bundles its deps), the override may not apply. Mitigation: Step 4 verification.

## Out of scope

- Auditing the rest of the dependency tree for similar vulnerabilities. This spec resolves #325 only.
- Removing the parent dependency that pulled in `follow-redirects`. That's a bigger architectural decision worth its own consideration.
