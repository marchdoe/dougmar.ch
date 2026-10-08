---
type: knowledge
tags: [research, area/site]
created: 2026-08-23
updated: 2026-08-23
aliases: []
sources: []
status: published
---

# What escapes a sealed snapshot

Research for [#156](https://github.com/marchdoe/doug-march.com/issues/156), part of the archive map [#152](https://github.com/marchdoe/doug-march.com/issues/152). Audited 2026-08-23 against the files in `public/archive/`, not against assumptions about them.

## Scope of the audit

120 date directories under `public/archive/` contain an `index.html`. Between them they hold **1,040 HTML pages**. Every one was parsed, plus a browser pass on seven dates spanning every era: 2026-03-16, 03-29, 04-20, 05-15, 06-28, 07-29, 08-23.

Four directories are metadata-only (`_detail.json`, no HTML): 2026-03-12, 03-14, 03-15, and a `2099-01-02` test fixture. They cannot leak because there is nothing to browse.

The "9 pages per date" figure in #152 holds from 2026-03-26 onward. The ten earliest dates (03-16 through 03-25) ship 5 pages, with `work/project-alpha.html` and `work/ai-experiment.html` in place of the seven real project pages. A backfill script that hardcodes nine filenames will miss those.

## Headline: 112 of 120 dates leak

Eight dates are already sealed and need no rewrite: 2026-03-17, 03-18, 03-19, 03-20, 03-22, 03-24, 03-25, 03-27. All of them are from the first two weeks. From 2026-04-01 onward, **every single date leaks** (21/21 April, 30/30 May, 30/30 June, 25/25 July, 1/1 August).

The dominant leak is not the one #156 opens with. `href="/#work"` appears on 13 dates. `href="/archive"` appears on **93**, and it is the single biggest rewrite target by a wide margin. Bare `href="/"` appears **zero** times in any served snapshot page. The two occurrences in the repo are both inside `public/archive/2026-04-14/_shell.html`, a stray file discussed below.

## The full pattern table

Counted across 120 dates / 1,040 pages. "occ" is raw occurrences.

### Same-origin escapes: rewrite these

| # | Pattern | Dates | Pages | Occ |
|---|---|---|---|---|
| E1 | `<a href="/archive">` | 93/120 | 751 | 761 |
| E2 | `<a href="/#work">`, `/#index`, `/#log`, `/#charge`, `/#contact` | 13/120 | 108 | 156 |
| E3 | `<a href="/work">`, `/work#experiments`, `/about#timeline`, `/contact`, `/experiments` | 6/120 | 54 | 81 |
| E4 | `<a href="https://doug-march.com">` | 105/120 | 113 | 115 |
| E5 | `<meta property="og:url" content="https://doug-march.com">` | 15/120 | 135 | 135 |
| E6 | `<meta property="og:image" content="https://doug-march.com/og/<date>.png">` | 15/120 | 135 | 135 |
| E7 | `<meta name="twitter:image" content="https://doug-march.com/og/<date>.png">` | 15/120 | 135 | 135 |

Notes on the ones that surprised me:

**E4 is the work page linking to itself.** The `doug-march.com` project card carries a live link to the production homepage. It reads as an external portfolio link, so it is easy to miss, but it dumps the visitor on today's build exactly like `/` would. 105 dates, and only 113 pages, so it is roughly one link per page on one or two pages per date.

**E5 through E7 are a July-era regression.** OG tags first appear on 2026-07-13 and run through 07-29, plus 08-23. Fifteen dates, all nine pages each. `og:url` is `https://doug-march.com` with no date path on all 135, so sharing any archived page to Slack or a social card renders it as today's homepage. The `og:image` values are worse than stale: they point at `/og/<date>.png` for seven distinct dates, and `public/og/` currently holds exactly one file, `2026-08-23.png`. The other 123 image references already 404 in production.

### External references: leave these alone

| # | Pattern | Dates | Pages | Occ |
|---|---|---|---|---|
| X1 | `<link rel="preconnect">` to `fonts.googleapis.com`, `fonts.gstatic.com`, `api.fontshare.com` | 119/120 | 1,031 | 2,255 |
| X2 | `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?…">` | 118/120 | 1,022 | 1,045 |
| X3 | `@import url(https://fonts.googleapis.com/…)` inside the inlined `<style>` | 8/120 | 56 | 56 |
| X4 | `url(//cdn.fontshare.com/wf/…)` inside `<style>`, protocol-relative | 1/120 | 9 | 108 |
| X5 | `<a href>` to spaceman.llc (150), 15th.club (106), getfishsticks.com (106), github.com (61), linkedin.com (3), news.ycombinator.com (1) | 116/120 | 387 | 427 |
| X6 | `<a href="mailto:…">` | 11/120 | 77 | 78 |

These are load-bearing for fidelity, and I verified it rather than assuming. Loading `2026-05-15/about.html` from a local server produced nine network requests: the document, the Google Fonts stylesheet, three `fonts.gstatic.com` woff2 files that all returned 200, and a `data:` SVG. Strip or rewrite X1 through X3 and every snapshot falls back to system fonts, which is a bigger fidelity loss than any link leak.

X4 is the only protocol-relative URL in the archive and it sits on a single date, 2026-04-03, 108 times across 9 pages. It resolves against the page protocol, so it works today over HTTPS. A rewrite that pattern-matches `//` as a path prefix would corrupt it. Worth a named test case.

X5 and X6 point at genuinely different sites. A visitor clicking through to spaceman.llc has not been leaked onto today's build, they have followed a link that was real on that date. Leave them.

### Dead but harmless

| # | Pattern | Dates | Pages | Occ |
|---|---|---|---|---|
| D1 | `<link rel="modulepreload" href="/assets/*.js">` | 120/120 | 1,040 | 3,611 |

536 distinct filenames. Every one 404s in production, and `public/assets/` does not exist in the repo at all.

I can now say something stronger than "visually harmless," and it holds across all eras rather than just 2026-05-15.

**There is not a single `<script>` tag anywhere in the 1,040 snapshot pages.** Not one, in any era. The capture process strips `<script>` but leaves the preload hints behind. Per the [HTML Standard](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload), `rel="modulepreload"` tells the browser to "preemptively fetch the module script and store it in the document's module map **for later evaluation**." Nothing triggers that later evaluation, because the tag that would trigger it does not exist. The JS is not merely broken. It never runs.

Browser confirmation on 2026-05-15: the `/assets/*.js` requests do fire and do fail, and the console stayed **completely empty**. No errors, no warnings. The cost is two wasted round trips per page and nothing else.

**No snapshot depends on JS for layout.** I checked for the failure mode that would matter, CSS that sets `opacity: 0` and waits for a script to reveal it. `opacity:0` appears on 20 dates, so I inspected computed styles in the browser rather than trusting the grep. On 2026-03-29, zero elements with text content had computed opacity 0 or `visibility: hidden`, and zero had a running animation. There are no `data-animate` or `data-reveal` hooks, no `is-visible` toggle classes, and no scroll-driven animation properties anywhere in the archive.

One false alarm worth recording so nobody re-raises it. 2026-03-29 screenshots blank at first paint. It is a 5,756px page with a full-viewport hero, so the content sits below the fold. Scrolling reveals it fully styled. Same for the tall gap on 2026-04-20. Both are intentional design, not breakage.

### Safe, and already doing the right thing

| # | Pattern | Dates | Pages | Occ |
|---|---|---|---|---|
| S1 | `<a href>` page-relative (`index.html`, `about.html`, `work/*.html`) | 120/120 | 1,039 | 4,612 |
| S2 | `<img src="data:image/svg+xml,…">` | 98/120 | 874 | 874 |
| S3 | `<a href="#…">` in-page fragment | 14/120 | 34 | 38 |

Ten distinct relative targets, no `../` traversal anywhere in the archive. Every image in every snapshot is an inline data URI, so no snapshot has ever depended on a binary asset file.

### Vectors that do not exist

I looked for all of these and found zero across all 1,040 pages, so the rewrite does not need to handle them:

`<script>` of any kind. `<base>`. `<form>` or any `action=` attribute. `<iframe>`. Inline `on*` event handlers. `<link rel="canonical">`. `<link rel="icon">` or `manifest`. Any `<img src>` that is root-relative or absolute HTTP. Any root-relative `url()` inside a `<style>` block, so no font or background image escapes through CSS. `srcset`, `poster`, `data-src`, `formaction`. Relative hrefs containing `../`.

The absence of `<base>` matters most. A `<base href>` would have silently changed how every relative link resolves, and the rewrite can now assume relative means relative.

## Two anomalies

**`public/archive/2026-04-14/` is not a snapshot, it is a whole `dist/` dump.** Alone among the 120 dates it contains `assets/`, `clients/`, `favicon.ico`, `logo192.png`, `logo512.png`, `manifest.json`, `robots.txt`, a `_shell.html`, and a recursive `archive/` directory holding 234 files, which is a complete copy of the archive as it stood that day, snapshots inside a snapshot. `_shell.html` is the only file in the entire archive with `<script>` tags, including a live `import("/assets/main-U0KJ3PlE.js")` and a `localStorage` theme reader, and it holds the only `<link rel="stylesheet" href="/assets/main-DiooMTG1.css">` and the only two `href="/"`. It is not reachable from the nine real pages. I excluded it from all counts above. Decide whether to delete the extra files or seal them, but do not let a backfill script walk into that nested `archive/` and rewrite 234 files twice.

**84 pages across 12 dates have no `<meta charset>`.** The dates are 2026-03-16, 03-18, 03-20, 03-21, 03-24, 03-25, 04-04, 04-06, 04-10, 04-13, 04-15, 04-17. This is not a live defect. Vercel serves `content-type: text/html; charset=utf-8`, which I confirmed with `curl -sI` against production, so these render correctly today. It is a latent one. When I served the same files from a local Python server that omits the charset, 2026-03-16 rendered visible mojibake, `â€"` for em dashes and `Â·` for middots. Any future move to a host that does not set the header, or anyone opening a snapshot over `file://`, gets garbled text on those 84 pages. Adding the meta tag costs nothing while a rewrite pass is already touching every file. Not an escape vector, so treat it as optional.

## What a capture-time rewrite has to do

In priority order. Counts are dates out of 120, then pages out of 1,040.

**Rewrite, in this order.** Order matters, because E1 and E3 both match a `/`-prefixed href and E4 must run before any generic absolute-URL rule.

1. `<a href="/archive">` becomes a link out to the archive index, or gets neutralised. 93 dates, 751 pages, 761 occurrences. Biggest single target. This one needs a product decision rather than a mechanical rewrite: `/archive` is arguably where you *want* the visitor to go, so it may become the frame's own back-link instead of an in-date rewrite.
2. `<a href="/#fragment">` becomes `index.html#fragment`. 13 dates, 108 pages, 156 occurrences. Five distinct fragments: `#work`, `#index`, `#log`, `#charge`, `#contact`.
3. `<a href="/work…">`, `/about…`, `/contact`, `/experiments` become the in-date equivalent. 6 dates, 54 pages, 81 occurrences. Note `/work` has no `work.html` in any snapshot, so this needs a mapping, not a naive strip of the leading slash.
4. `<a href="https://doug-march.com">` becomes `index.html`. 105 dates, 113 pages, 115 occurrences. Match the host exactly and do not catch `doug-march-dot-com.html`, which is a legitimate relative filename.
5. `og:url` becomes the snapshot's own archive URL. 15 dates, 135 pages.
6. `og:image` and `twitter:image` become the real OG image path, or get dropped. 15 dates, 135 pages each. 123 of the 135 already 404, so dropping them is defensible.
7. Optional: add `<meta charset="utf-8">` where missing. 12 dates, 84 pages.

**Leave untouched.** Rewriting any of these makes the archive worse.

- `preconnect` to fonts.googleapis.com, fonts.gstatic.com, api.fontshare.com. 119 dates, 1,031 pages, 2,255 occurrences.
- `<link rel="stylesheet">` to fonts.googleapis.com. 118 dates, 1,022 pages, 1,045 occurrences.
- `@import url(https://fonts.googleapis.com/…)` inside `<style>`. 8 dates, 56 pages.
- `url(//cdn.fontshare.com/…)` inside `<style>`, protocol-relative. 1 date (2026-04-03), 9 pages, 108 occurrences. Guard against a `//`-eats-`/` bug here.
- Third-party `<a href>` to spaceman.llc, 15th.club, getfishsticks.com, github.com, linkedin.com, news.ycombinator.com. 116 dates, 387 pages, 427 occurrences.
- `mailto:` links. 11 dates, 77 pages.
- Page-relative hrefs. 120 dates, 4,612 occurrences. Already correct.
- `data:` image URIs. 98 dates, 874 occurrences.

**Decide separately.**

- `<link rel="modulepreload" href="/assets/*.js">`. 120 dates, all 1,040 pages, 3,611 occurrences, 536 distinct filenames. Provably inert: no `<script>` exists to evaluate them, and the failed fetches log nothing. Stripping them is free and saves two dead requests per page. Not required for sealing.
- `public/archive/2026-04-14/`. The extra `dist/` files, `_shell.html`, and the nested 234-file `archive/` copy. Exclude from any backfill walk at minimum.

**Regression tests worth writing.** Assert zero matches for `href="/`, and for `content="https://doug-march.com` in an `og:` or `twitter:` meta, across `public/archive/*/**/*.html`. Assert a non-zero count of `fonts.googleapis.com` references, so a future over-eager rewrite that strips the fonts fails loudly instead of quietly flattening 120 designs to Times New Roman.

## Method

Pattern counts come from a Python pass over all 1,040 files using the regexes listed in the tables, counting distinct dates, distinct pages, and raw occurrences separately. Browser checks ran against `python3 -m http.server` over `public/`, which reproduces the production `/assets/` failure. Production headers checked with `curl -sI https://doug-march.com/…`. The modulepreload semantics are quoted from the WHATWG HTML Standard, [4.6.7 Link types, `modulepreload`](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload).
