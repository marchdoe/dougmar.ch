import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  ARCHIVE_DATE_URL,
  VERCEL_DATE_SEGMENT,
  archiveStaticMiddleware,
} from '../../app/dev-server/archive-static'
import {
  PREVIEW_CONTENT_TYPES,
  contentTypeFor,
  resolvePreviewPath,
} from '../../app/dev-server/archive-preview'

const vercel = JSON.parse(readFileSync(resolve(import.meta.dirname, '../../vercel.json'), 'utf8'))

describe('the archive date route, in dev and on Vercel', () => {
  it('vercel.json redirects the slash-less form the same way the dev middleware does', () => {
    // Two encodings of one rule, written independently until #227. This
    // holds them together: the redirect source must use the same date
    // pattern, and its destination must be the trailing-slash form.
    const redirect = vercel.redirects.find((r: { source: string }) =>
      r.source.startsWith('/archive/:date(')
    )
    expect(redirect).toBeDefined()
    expect(redirect.source).toBe(`/archive/:date(${VERCEL_DATE_SEGMENT})`)
    expect(redirect.destination).toBe('/archive/:date/')
    expect(redirect.permanent).toBe(true)
  })

  it('has no rewrite that maps a path to itself', () => {
    // `/archive/:path+` → `/archive/:path+` did nothing: the catch-all already
    // excludes archive/. Removed; this keeps it from coming back.
    for (const r of vercel.rewrites) expect(r.source).not.toBe(r.destination)
  })

  it('the dev middleware 301s the slash-less form and ignores everything else', () => {
    const mw = archiveStaticMiddleware([])
    const res = { writeHead: vi.fn(), end: vi.fn() }
    const next = vi.fn()

    mw({ url: '/archive/2026-06-28' } as never, res as never, next)
    expect(res.writeHead).toHaveBeenCalledWith(301, { Location: '/archive/2026-06-28/' })
    expect(next).not.toHaveBeenCalled()

    for (const url of ['/archive', '/archive/', '/archive/not-a-date/', '/about']) {
      next.mockClear()
      mw({ url } as never, res as never, next)
      expect(next, url).toHaveBeenCalled()
    }
  })

  it('ARCHIVE_DATE_URL captures the date and the slash', () => {
    expect(ARCHIVE_DATE_URL.exec('/archive/2026-06-28/')?.slice(1)).toEqual(['2026-06-28', '/'])
    expect(ARCHIVE_DATE_URL.exec('/archive/2026-06-28')?.slice(1)).toEqual(['2026-06-28', ''])
  })
})

describe('archive preview', () => {
  it('serves each thing an archived site actually contains with its own type', () => {
    // These are the extensions found under archive/*/site/. The old handler
    // read everything as utf8 and knew three types; PNGs and the favicon
    // arrived mangled, .js and .svg with a type the browser refuses.
    for (const ext of ['html', 'json', 'js', 'svg', 'png', 'txt', 'ico', 'css']) {
      expect(PREVIEW_CONTENT_TYPES[`.${ext}`], ext).toBeDefined()
    }
    expect(contentTypeFor('a/b/logo192.png')).toBe('image/png')
    expect(contentTypeFor('favicon.ico')).toBe('image/x-icon')
    expect(contentTypeFor('x.SVG')).toBe('image/svg+xml')
    expect(contentTypeFor('x.unknown')).toBe('application/octet-stream')
  })

  it('resolves per-build and legacy URLs under archive/', () => {
    const base = '/repo/archive'
    expect(resolvePreviewPath('/2026-03-20/build-123/index.html', base)).toBe(
      '/repo/archive/2026-03-20/build-123/site/index.html'
    )
    expect(resolvePreviewPath('/2026-03-16/about.html', base)).toBe(
      '/repo/archive/2026-03-16/site/about.html'
    )
  })

  it('refuses a path that climbs out of archive/', () => {
    const base = '/repo/archive'
    expect(resolvePreviewPath('/2026-03-16/../../.env', base)).toBeNull()
    expect(resolvePreviewPath('/2026-03-20/build-1/../../../.env', base)).toBeNull()
    expect(resolvePreviewPath('/nope', base)).toBeNull()
  })

  it('strips a cache-busting query string before resolving a path (#331)', () => {
    // A preserved snapshot links its own assets with a cache-busting query
    // string (`style.css?v=2`); the file on disk has no such name.
    const base = '/repo/archive'
    expect(resolvePreviewPath('/2026-03-20/build-123/style.css?v=2', base)).toBe(
      '/repo/archive/2026-03-20/build-123/site/style.css'
    )
    expect(resolvePreviewPath('/2026-03-16/style.css?v=2', base)).toBe(
      '/repo/archive/2026-03-16/site/style.css'
    )
  })
})

describe('the pipeline map route, in dev and on Vercel', () => {
  it('the dev middleware serves the page with or without the slash and ignores the rest', async () => {
    const { pipelineMapMiddleware } = await import('../../app/dev-server/pipeline-map-static')
    const mw = pipelineMapMiddleware([resolve(import.meta.dirname, '../../public/pipeline-map')])
    for (const url of ['/pipeline-map', '/pipeline-map/', '/pipeline-map/?x=1']) {
      const res = { writeHead: vi.fn(), end: vi.fn() }
      const next = vi.fn()
      mw({ url } as never, res as never, next)
      expect(res.writeHead, url).toHaveBeenCalledWith(200, expect.anything())
      expect(next).not.toHaveBeenCalled()
    }
    for (const url of ['/pipeline-map-x', '/about', '/archive/']) {
      const next = vi.fn()
      mw({ url } as never, { writeHead: vi.fn(), end: vi.fn() } as never, next)
      expect(next, url).toHaveBeenCalled()
    }
  })
})
