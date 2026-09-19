/**
 * The SPA catch-all must not answer for a missing asset.
 *
 * vercel.json takes no comments, so the reasoning lives here.
 *
 * `rewrites` run after the filesystem, so the catch-all only ever sees a URL
 * that matched no file. For a page that is the whole point: `/about` has no
 * file and must return the shell. For `/assets/index-<hash>.js` it is a trap.
 * A missing asset was rewritten to `_shell.html` and returned **200 with
 * `text/html`**, and the `/assets/:path*` header rule then stamped that HTML
 * `public, max-age=31536000, immutable`.
 *
 * A browser that caught one of those cached an HTML document under a `.js`
 * URL for a year, and `immutable` means it never asks again. Every later
 * visit failed on `'text/html' is not a valid JavaScript MIME type for module
 * script`, and no reload could clear it, because a reload is exactly what
 * `immutable` tells the browser to skip. Reported from Safari on 2026-09-19.
 *
 * Excluding `assets/` lets a miss be a real 404, which nothing caches as a
 * successful response.
 *
 * These assertions read the anchoring behaviour of the pattern, not Vercel's
 * router. That is the property that went wrong, twice now (see csp.test.js for
 * the other).
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const config = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'))

const shellRule = config.rewrites.find((r) => r.destination === '/_shell.html')
const matchesShell = (p) => new RegExp(`^${shellRule.source}$`).test(p)

describe('the SPA catch-all', () => {
  it('exists and points at the shell', () => {
    expect(shellRule).toBeTruthy()
  })

  it.each([['/about'], ['/experiments'], ['/work/spaceman'], ['/elements'], ['/']])(
    'answers for the app route %s',
    (p) => {
      expect(matchesShell(p)).toBe(true)
    }
  )

  it.each([
    ['/assets/index-C2UsMhaF.css'],
    ['/assets/preload-helper-BUEe2X8A.js'],
    ['/assets/gone-in-the-last-build.js'],
  ])('leaves %s to the filesystem, so a miss is a 404 and not HTML', (p) => {
    expect(matchesShell(p)).toBe(false)
  })

  it.each([['/og/2026-09-19.png'], ['/archive/2026-06-28/']])(
    'still leaves %s alone, as it did before',
    (p) => {
      expect(matchesShell(p)).toBe(false)
    }
  )
})

describe('the immutable header that made the trap permanent', () => {
  const assetRule = config.headers.find((h) => h.source === '/assets/:path*')

  it('still caches hashed assets for a year', () => {
    const cc = assetRule?.headers.find((h) => h.key === 'Cache-Control')?.value
    expect(cc).toContain('immutable')
  })

  it('covers exactly the prefix the catch-all now excludes', () => {
    // If these two ever disagree again, some path under /assets/ can be both
    // rewritten to HTML and cached as immutable, which is the whole bug.
    expect(assetRule.source.startsWith('/assets/')).toBe(true)
    expect(shellRule.source).toContain('assets/')
  })
})
