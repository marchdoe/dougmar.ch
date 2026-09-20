import { CANONICAL_ORIGIN, RECOGNIZED_ORIGINS } from '../../shared/site-origin.js'
import { describe, expect, it } from 'vitest'

import {
  FRAME_MARKER,
  buildFrame,
  depthOf,
  resolveHref,
  rewriteLinks,
  rewriteMeta,
  sealPage,
  stripDeadPreloads,
  stripFrame,
} from '../../scripts/utils/archive-seal.js'

const CTX = { date: '2026-06-28', relPath: 'index.html', prev: '2026-06-27', next: '2026-06-30' }

describe('depthOf', () => {
  it('is flat for a top-level page', () => {
    expect(depthOf('index.html')).toBe(0)
    expect(depthOf('about.html')).toBe(0)
  })

  it('is one level down inside work/', () => {
    expect(depthOf('work/spaceman.html')).toBe(1)
  })
})

describe('resolveHref', () => {
  const top = { prefix: '' }
  const nested = { prefix: '../' }

  it('sends a bare root fragment to the in-date home page', () => {
    expect(resolveHref('/#work', top)).toBe('index.html#work')
    expect(resolveHref('/', top)).toBe('index.html')
  })

  it('maps the nav paths that have no file behind them', () => {
    // No snapshot contains work.html and none defines an id="work" anchor,
    // so the honest destination is the day's own home page.
    expect(resolveHref('/work', top)).toBe('index.html')
    expect(resolveHref('/work#experiments', top)).toBe('index.html#experiments')
    expect(resolveHref('/contact', top)).toBe('index.html')
    expect(resolveHref('/experiments', top)).toBe('index.html')
  })

  it('maps about, keeping the fragment', () => {
    expect(resolveHref('/about', top)).toBe('about.html')
    expect(resolveHref('/about#timeline', top)).toBe('about.html#timeline')
  })

  it('maps a work slug to its captured file', () => {
    expect(resolveHref('/work/spaceman', top)).toBe('work/spaceman.html')
    expect(resolveHref('/work/15th-club', top)).toBe('work/15th-club.html')
  })

  it('climbs out of work/ when the page is one level down', () => {
    expect(resolveHref('/#work', nested)).toBe('../index.html#work')
    expect(resolveHref('/about', nested)).toBe('../about.html')
    expect(resolveHref('/work/teeturn', nested)).toBe('../work/teeturn.html')
  })

  it('collapses every recognized origin onto the in-date page', () => {
    // Loops rather than naming a host. A snapshot taken before the domain
    // move carries the old origin and one taken after carries the new one,
    // and both must collapse for as long as the archive exists.
    for (const origin of RECOGNIZED_ORIGINS) {
      expect(resolveHref(origin, top)).toBe('index.html')
      expect(resolveHref(`${origin}/about`, top)).toBe('about.html')
      expect(resolveHref(`${origin}/work/teeturn`, top)).toBe('work/teeturn.html')
    }
  })

  it('leaves an origin that is not ours untouched', () => {
    expect(resolveHref('https://doug-march.com.evil.example/about', top)).toBeNull()
    expect(resolveHref('https://example.com/about', top)).toBeNull()
  })

  it('leaves the two deliberate exits alone', () => {
    expect(resolveHref('/archive', top)).toBeNull()
    expect(resolveHref('/archive/2026-05-01/', top)).toBeNull()
    expect(resolveHref('/how/2026-06-28', top)).toBeNull()
  })

  it('leaves everything that is not an absolute site path alone', () => {
    expect(resolveHref('about.html', top)).toBeNull()
    expect(resolveHref('#contact', top)).toBeNull()
    expect(resolveHref('mailto:doug@example.com', top)).toBeNull()
    expect(resolveHref('https://fonts.googleapis.com/css2?family=Inter', top)).toBeNull()
    expect(resolveHref('https://github.com/marchdoe', top)).toBeNull()
  })

  it('does not mistake the doug-march-dot-com case study for the live host', () => {
    // No archived file carries this filename any more — the corpus was
    // scrubbed and the files renamed on 2026-08-29. Kept as a defensive case:
    // resolveHref must not mistake ANY work/*.html for a host, and this is the
    // shape that would break first if the host-prefix matching regressed.
    expect(resolveHref('work/doug-march-dot-com.html', top)).toBeNull()
    expect(resolveHref('/work/doug-march-dot-com', top)).toBe('work/doug-march-dot-com.html')
  })

  it('does not mistake the dougmar-ch case study for the live host either', () => {
    // The new slug is a near-miss for the new origin the same way the old one
    // was for the old origin, and RECOGNIZED_ORIGINS now contains both.
    expect(resolveHref('work/dougmar-ch.html', top)).toBeNull()
    expect(resolveHref('/work/dougmar-ch', top)).toBe('work/dougmar-ch.html')
  })
})

describe('rewriteLinks', () => {
  it('rewrites the attribute and not the document text', () => {
    // Two snapshots print the live URL as the visible text of a link.
    // A string replace would edit what the design says.
    for (const origin of RECOGNIZED_ORIGINS) {
      const html = `<a href="${origin}">${origin}</a>`
      expect(rewriteLinks(html, { prefix: '' })).toBe(`<a href="index.html">${origin}</a>`)
    }
  })

  it('leaves a font stylesheet untouched', () => {
    const html =
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&amp;display=swap">'
    expect(rewriteLinks(html, { prefix: '' })).toBe(html)
  })
})

describe('stripDeadPreloads', () => {
  it('drops modulepreload links to bundles that were never captured', () => {
    const html =
      '<link rel="modulepreload" crossorigin href="/assets/index-ABC123.js"><main>hi</main>'
    expect(stripDeadPreloads(html)).toBe('<main>hi</main>')
  })

  it('keeps a real stylesheet', () => {
    const html = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">'
    expect(stripDeadPreloads(html)).toBe(html)
  })
})

describe('rewriteMeta', () => {
  it('points og:url at the snapshot rather than the live site', () => {
    // Reads whichever origin the snapshot happens to carry; always writes the
    // canonical one. This is the pointer-vs-record distinction: og:url says
    // where the page lives NOW, so it follows a domain move.
    for (const origin of RECOGNIZED_ORIGINS) {
      const html = `<meta property="og:url" content="${origin}/">`
      expect(rewriteMeta(html, { date: '2026-06-28' })).toBe(
        `<meta property="og:url" content="${CANONICAL_ORIGIN}/archive/2026-06-28/">`
      )
    }
  })

  it('drops image meta, which already 404s on 123 of 135 dates', () => {
    const html = RECOGNIZED_ORIGINS.map(
      (o) =>
        `<meta property="og:image" content="${o}/og/2026-07-17.png"><meta name="twitter:image" content="${o}/og/2026-07-17.png">`
    ).join('')
    expect(rewriteMeta(html, { date: '2026-07-17' })).toBe('')
  })
})

describe('buildFrame', () => {
  it('carries the four things the rail is for', () => {
    const frame = buildFrame({ date: '2026-06-28', prev: '2026-06-27', next: '2026-06-30' })
    expect(frame).toContain('href="/archive"')
    expect(frame).toContain('href="/how/2026-06-28"')
    expect(frame).toContain('href="/archive/2026-06-27/"')
    expect(frame).toContain('href="/archive/2026-06-30/"')
    expect(frame).toContain('June 28, 2026')
  })

  it('goes dead rather than dangling at the ends of the run', () => {
    const first = buildFrame({ date: '2026-03-12', prev: null, next: '2026-03-13' })
    expect(first).not.toContain('href="/archive/null/"')
    expect(first).toContain('af-off')
    expect(first).toContain('href="/archive/2026-03-13/"')
  })

  it('runs no script, because a sealed snapshot cannot execute any', () => {
    const frame = buildFrame({ date: '2026-06-28', prev: null, next: null })
    expect(frame).not.toMatch(/<script/i)
    expect(frame).not.toMatch(/\son[a-z]+=/i)
  })

  it('displaces the design instead of covering it', () => {
    const frame = buildFrame({ date: '2026-06-28', prev: null, next: null })
    expect(frame).toContain('padding-top:44px!important')
  })

  it('carries a short date and a short link label for phones next to the long ones (#562)', () => {
    const frame = buildFrame({ date: '2026-09-19', prev: null, next: null })
    expect(frame).toContain('<span class="af-long">September 19, 2026</span>')
    expect(frame).toContain('<span class="af-short">Sep 19</span>')
    expect(frame).toContain('<span class="af-long">How it was made</span>')
    expect(frame).toContain('<span class="af-short">How</span>')
  })

  it('keeps the full name on the explainer link whichever label is showing', () => {
    const frame = buildFrame({ date: '2026-09-19', prev: null, next: null })
    expect(frame).toContain('href="/how/2026-09-19" rel="nofollow" aria-label="How it was made"')
  })

  it('abbreviates every month to three letters', () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    months.forEach((abbr, i) => {
      const date = `2026-${String(i + 1).padStart(2, '0')}-05`
      expect(buildFrame({ date, prev: null, next: null })).toContain(
        `<span class="af-short">${abbr} 5</span>`
      )
    })
  })

  it('has no nested div, because stripFrame ends the frame at the first closing one', () => {
    const frame = buildFrame({ date: '2026-09-19', prev: '2026-09-18', next: '2026-09-20' })
    expect(frame.match(/<div\b/g)).toHaveLength(1)
    expect(frame.match(/<\/div>/g)).toHaveLength(1)
  })
})

describe('sealPage', () => {
  const PAGE = `<!DOCTYPE html><html><head>
<meta property="og:url" content="${CANONICAL_ORIGIN}/">
<meta property="og:image" content="${CANONICAL_ORIGIN}/og/2026-06-28.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&amp;display=swap">
<link rel="modulepreload" crossorigin href="/assets/index-ABC123.js">
<style>body{background:#111}</style>
</head><body class="dark"><nav><a href="/#work">Work</a><a href="/about">About</a><a href="/archive">Archive</a></nav></body></html>`

  it('rewrites, strips, and frames in one pass', () => {
    const out = sealPage(PAGE, CTX)
    expect(out).toContain('href="index.html#work"')
    expect(out).toContain('href="about.html"')
    expect(out).toContain('href="/archive"')
    expect(out).not.toContain('modulepreload')
    expect(out).not.toContain('og:image')
    expect(out).toContain(`content="${CANONICAL_ORIGIN}/archive/2026-06-28/"`)
    expect(out).toContain(FRAME_MARKER)
  })

  it('keeps the fonts, which is the whole design', () => {
    const out = sealPage(PAGE, CTX)
    expect(out).toContain('fonts.googleapis.com/css2?family=Inter')
  })

  it('injects the frame just inside body, so it paints over the design', () => {
    const out = sealPage(PAGE, CTX)
    expect(out).toMatch(/<body class="dark"><div data-archive-frame=/)
  })

  it('is idempotent — sealing twice equals sealing once', () => {
    const once = sealPage(PAGE, CTX)
    const twice = sealPage(once, CTX)
    expect(twice).toBe(once)
  })

  it('recovers from a stacked frame left by an earlier run', () => {
    const once = sealPage(PAGE, CTX)
    const doubled = once.replace(
      '<body class="dark">',
      `<body class="dark">${buildFrame({ date: '2026-06-28', prev: null, next: null })}`
    )
    expect(stripFrame(doubled)).not.toContain(FRAME_MARKER)
  })

  it('resolves relative to the page, not the snapshot root', () => {
    const nested = sealPage(PAGE, { ...CTX, relPath: 'work/spaceman.html' })
    expect(nested).toContain('href="../index.html#work"')
    expect(nested).toContain('href="../about.html"')
    // The frame's own links stay site-absolute; they are the intended exits.
    expect(nested).toContain('href="/how/2026-06-28"')
  })
})
