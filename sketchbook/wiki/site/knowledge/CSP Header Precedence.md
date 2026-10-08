---
type: knowledge
tags: [research, area/site]
created: 2026-08-26
updated: 2026-08-29
aliases: []
sources: []
status: draft
---

# Open question: which CSP wins on an archived page

**Status:** unresolved, parked deliberately. Everything else in PR #173 is verified.

## The question

`vercel.json` carries two `Content-Security-Policy` rules, and both match a URL
like `/archive/2026-06-28/`:

| source | `script-src` | intent |
|---|---|---|
| `/(.*)` | `'self' 'unsafe-inline'` | the app — TanStack emits inline hydration scripts |
| `/archive/(.*)` | `'none'` | preserved snapshots, which contain no script at all |

Vercel sends **one** header per key. Which rule supplies it was never
established.

## What was actually tried

1. **Archive rule after the catch-all, pattern `/archive/:date(\d{4}-\d{2}-\d{2})/:path*`.**
   Archived page received the site policy.
2. **Moved the archive rule before the catch-all**, same pattern. Still the site
   policy. Two failures with opposite orderings only make sense if the pattern
   never matched, so the pattern was the first bug.
3. **Changed the pattern to `/archive/(.*)`**, rule first. Still the site policy —
   which is consistent with last-match-wins.
4. **Moved it back after the catch-all** with the working pattern. Verification
   blocked: Vercel returned `403` with `x-vercel-mitigated: challenge`, having
   decided the polling loop was a bot.

The published configuration docs describe `has` conditions and ordering for
`redirects`, but do not state precedence for a repeated header key.

Current state: pattern `/archive/(.*)`, listed **after** the catch-all.

## Why it is safe to leave

Both policies permit everything an archived page needs — inline `<style>`,
`fonts.googleapis.com`, `fonts.gstatic.com`, `api.fontshare.com`, `data:` SVGs.
Whichever header lands, the 120 designs render correctly. The strict rule is
hardening on pages that already carry no script, behind two existing controls:
`snapshot.js:42` strips every `<script>` at capture, and `build-validator.js`
blocks the pattern in agent-authored source.

So the downside of getting this wrong is losing a defense-in-depth layer, not
breaking anything.

## How to settle it

One request against any deployment, ideally not in a loop:

```
curl -sD - -o /dev/null https://<host>/archive/2026-06-28/ | grep -i content-security-policy
```

- `script-src 'none'` → current ordering is correct; assert it in
  `tests/scripts/csp.test.js` and delete this file.
- `script-src 'self' 'unsafe-inline'` → move `/archive/(.*)` above `/(.*)` in
  `vercel.json`, redeploy, check again.

`tests/scripts/csp.test.js` deliberately asserts only that both rules exist. It
does not assert an ordering, because encoding an unconfirmed inference as a test
makes it look settled.

## Related

The review that produced this also found that `doug-march.com` serves a dead
Create React App shell — 489 identical bytes on every path, including
`/api/panel/status`. The Vercel production deployment is healthy and current;
the domain is not aliased to it. That belongs with the `dougmar.ch` move (#163)
rather than here.
