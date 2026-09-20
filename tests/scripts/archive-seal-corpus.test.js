/**
 * Seal regression tests — #156.
 *
 * These assert over the real corpus rather than a fixture, because the failure
 * they guard against is a snapshot leaking onto the live site, and that can only
 * be true or false of the bytes actually committed.
 *
 * The fonts assertion is the one that matters most. An over-eager rewrite that
 * stripped the Google Fonts stylesheet would flatten 120 designs to Times New
 * Roman, and would do it silently — every other test here would still pass.
 */

import { CANONICAL_ORIGIN } from '../../shared/site-origin.js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { beforeAll, describe, expect, it } from 'vitest'

import { ESCAPE_ALLOWLIST, FRAME_MARKER } from '../../scripts/utils/archive-seal.js'
import { listSnapshots } from '../../scripts/seal-archive.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const ARCHIVE_ROOT = path.join(ROOT, 'public', 'archive')

/** @type {{ date: string, relPath: string, html: string }[]} */
let pages = []

beforeAll(async () => {
  const snapshots = await listSnapshots(ARCHIVE_ROOT)
  pages = await Promise.all(
    [...snapshots].flatMap(([date, rels]) =>
      rels.map(async (relPath) => ({
        date,
        relPath,
        html: await readFile(path.join(ARCHIVE_ROOT, date, relPath), 'utf8'),
      }))
    )
  )
}, 60_000)

const label = (p) => `${p.date}/${p.relPath}`

describe('the corpus itself', () => {
  // Floors, not equalities. The archive gains a date every night, and a working
  // copy usually holds a build that is not committed yet, so an exact count
  // would fail for reasons that have nothing to do with sealing. What must never
  // happen is the corpus shrinking or a snapshot losing pages.
  it('has not shrunk below what was committed for #156', () => {
    expect(new Set(pages.map((p) => p.date)).size).toBeGreaterThanOrEqual(119)
    expect(pages.length).toBeGreaterThanOrEqual(1032)
  })

  it('tripwire: every date has a whole snapshot of 5, 9 or 10 pages', () => {
    const counts = new Map()
    for (const p of pages) counts.set(p.date, (counts.get(p.date) ?? 0) + 1)
    // 5 in the early prose era, 9 once the work pages settled, 10 on
    // 2026-04-14, which also captured a stray _shell.html.
    const odd = [...counts].filter(([, n]) => ![5, 9, 10].includes(n))
    expect(odd).toEqual([])
  })

  it('has an index.html for every date', () => {
    const dates = new Set(pages.map((p) => p.date))
    const missing = [...dates].filter(
      (d) => !pages.some((p) => p.date === d && p.relPath === 'index.html')
    )
    expect(missing).toEqual([])
  })
})

describe('no page escapes to the live site', () => {
  it('has no absolute href outside the allowlist', () => {
    const allowed = (href) =>
      ESCAPE_ALLOWLIST.some((ok) => href === ok || href.startsWith(`${ok}/`))

    const offenders = []
    for (const page of pages) {
      for (const [, href] of page.html.matchAll(/href="(\/[^"]*)"/g)) {
        if (!allowed(href)) offenders.push(`${label(page)} → ${href}`)
      }
    }
    expect(offenders.slice(0, 20)).toEqual([])
  })

  it('has no link pointing at the live origin', () => {
    const offenders = []
    for (const page of pages) {
      for (const [, href] of page.html.matchAll(/href="(https:\/\/doug-march\.com[^"]*)"/g)) {
        offenders.push(`${label(page)} → ${href}`)
      }
    }
    expect(offenders.slice(0, 20)).toEqual([])
  })

  it('keeps the archive link the 93 snapshots already carried', () => {
    const withArchiveLink = pages.filter((p) => p.html.includes('href="/archive"'))
    expect(withArchiveLink.length).toBeGreaterThan(0)
  })
})

describe('share metadata does not advertise the live site', () => {
  it('drops og:image and twitter:image, which already 404', () => {
    const offenders = pages
      .filter((p) => /property="og:image"|name="twitter:image"/.test(p.html))
      .map(label)
    expect(offenders.slice(0, 20)).toEqual([])
  })

  it('points every og:url at that snapshot, not the live home page', () => {
    const offenders = []
    for (const page of pages) {
      const m = /<meta property="og:url" content="([^"]*)">/.exec(page.html)
      if (!m) continue
      const expected = `${CANONICAL_ORIGIN}/archive/${page.date}/`
      if (m[1] !== expected) offenders.push(`${label(page)} → ${m[1]}`)
    }
    expect(offenders.slice(0, 20)).toEqual([])
  })
})

describe('the designs survive the seal', () => {
  it('still loads webfonts — the assertion that catches an over-eager rewrite', () => {
    // Every date carried a webfont stylesheet before sealing. If a rewrite ever
    // strips one, the design does not break loudly; it silently becomes Times
    // New Roman, and every other test on this page still passes.
    const fontless = [...new Set(pages.map((p) => p.date))].filter(
      (d) =>
        !pages.some(
          (p) =>
            p.date === d &&
            (p.html.includes('fonts.googleapis.com') || p.html.includes('api.fontshare.com'))
        )
    )
    expect(fontless).toEqual([])
  })

  it('keeps the inline stylesheet that is the design', () => {
    const without = pages.filter((p) => !p.html.includes('<style')).map(label)
    expect(without.slice(0, 20)).toEqual([])
  })
})

describe('the frame', () => {
  it('is on every page exactly once', () => {
    const wrong = pages
      .map((p) => ({ p, n: p.html.split(`<div ${FRAME_MARKER}=`).length - 1 }))
      .filter(({ n }) => n !== 1)
      .map(({ p, n }) => `${label(p)} → ${n}`)
    expect(wrong.slice(0, 20)).toEqual([])
  })

  it('is stamped with the date of the snapshot it sits on', () => {
    const wrong = pages
      .filter((p) => !p.html.includes(`<div ${FRAME_MARKER}="${p.date}"`))
      .map(label)
    expect(wrong.slice(0, 20)).toEqual([])
  })

  it('runs no script, because a sealed snapshot cannot execute any', () => {
    const offenders = []
    for (const page of pages) {
      const open = page.html.indexOf(`<div ${FRAME_MARKER}=`)
      const frame = page.html.slice(open, page.html.indexOf('</div>', open))
      if (/<script|\son[a-z]+=/i.test(frame)) offenders.push(label(page))
    }
    expect(offenders.slice(0, 20)).toEqual([])
  })

  /**
   * The invariant is that an arrow never points at a day that is not here —
   * not that the newest day has no next arrow.
   *
   * The weaker version of this test passed locally and failed in CI, which is
   * exactly what it was for. A working copy usually holds a build that is not
   * committed yet; sealing on that machine gives the previous day a next arrow
   * pointing at it, and committing only the previous day publishes a link to a
   * date that does not exist. That is the actual defect, and it is what this
   * checks.
   */
  it('never points an arrow at a day the archive does not have', () => {
    const dates = new Set(pages.map((p) => p.date))
    const dangling = new Set()
    for (const page of pages) {
      const open = page.html.indexOf(`<div ${FRAME_MARKER}=`)
      const frame = page.html.slice(open, page.html.indexOf('</div>', open))
      for (const [, target] of frame.matchAll(/href="\/archive\/(\d{4}-\d{2}-\d{2})\/"/g)) {
        if (!dates.has(target)) dangling.add(`${label(page)} → ${target}`)
      }
    }
    expect([...dangling].slice(0, 20)).toEqual([])
  })

  it('goes dead at the far end rather than pointing before the first build', () => {
    const dates = [...new Set(pages.map((p) => p.date))].sort()
    for (const p of pages.filter((page) => page.date === dates[0])) {
      expect(p.html, label(p)).not.toContain('title="Previous build')
    }
  })

  it('links every page to its own explainer', () => {
    const wrong = pages.filter((p) => !p.html.includes(`href="/how/${p.date}"`)).map(label)
    expect(wrong.slice(0, 20)).toEqual([])
  })
})

describe('dead weight is gone', () => {
  it('has no modulepreload for bundles that were never captured', () => {
    const offenders = pages.filter((p) => p.html.includes('modulepreload')).map(label)
    expect(offenders.slice(0, 20)).toEqual([])
  })
})
