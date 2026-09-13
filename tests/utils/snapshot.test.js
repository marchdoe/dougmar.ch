import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  computeDownscaleDimensions,
  computePhoneFilmstripFolds,
  phoneFilmstripMoreLabel,
  processHtml,
} from '../../scripts/utils/snapshot.js'

describe('computeDownscaleDimensions', () => {
  it('scales a full-res capture down to the target width, preserving aspect ratio', () => {
    expect(computeDownscaleDimensions(1280, 900, 1024)).toEqual({ width: 1024, height: 720 })
  })

  it('scales a wider mockup capture down proportionally', () => {
    expect(computeDownscaleDimensions(1440, 900, 1024)).toEqual({ width: 1024, height: 640 })
  })

  it('never upscales a source already narrower than the target', () => {
    expect(computeDownscaleDimensions(800, 600, 1024)).toEqual({ width: 800, height: 600 })
  })

  it('defaults the target width to the critic-bound ceiling (1024)', () => {
    expect(computeDownscaleDimensions(1280, 900)).toEqual({ width: 1024, height: 720 })
  })
})

describe('computePhoneFilmstripFolds', () => {
  it('a page under one fold tall is one fold, none hidden', () => {
    expect(computePhoneFilmstripFolds(500)).toEqual({ totalFolds: 1, shownFolds: 1, moreFolds: 0 })
  })

  it('a page exactly one fold tall is one fold, none hidden', () => {
    expect(computePhoneFilmstripFolds(640)).toEqual({ totalFolds: 1, shownFolds: 1, moreFolds: 0 })
  })

  it('one CSS pixel past a fold starts a second fold', () => {
    expect(computePhoneFilmstripFolds(641)).toEqual({ totalFolds: 2, shownFolds: 2, moreFolds: 0 })
  })

  it('a page needing seven folds shows six and hides one', () => {
    expect(computePhoneFilmstripFolds(3841)).toEqual({
      totalFolds: 7,
      shownFolds: 6,
      moreFolds: 1,
    })
  })

  it('a page needing nine folds shows six and hides three', () => {
    expect(computePhoneFilmstripFolds(5486)).toEqual({
      totalFolds: 9,
      shownFolds: 6,
      moreFolds: 3,
    })
  })
})

describe('phoneFilmstripMoreLabel', () => {
  it('is null when every fold is already shown', () => {
    expect(phoneFilmstripMoreLabel(0)).toBeNull()
  })

  it('is singular for exactly one hidden fold', () => {
    expect(phoneFilmstripMoreLabel(1)).toBe('1 more fold not shown')
  })

  it('is plural for more than one hidden fold', () => {
    expect(phoneFilmstripMoreLabel(3)).toBe('3 more folds not shown')
  })
})

describe('processHtml', () => {
  const baseUrl = 'http://localhost:14321'
  const SVG = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="4"/></svg>'
  const b64 = (s) => Buffer.from(s).toString('base64')

  /** A fetch that serves the stylesheet and the client marks, and 404s the rest. */
  function stubFetch(routes) {
    const calls = []
    vi.stubGlobal('fetch', async (url) => {
      calls.push(url)
      const body = routes[url]
      if (body === undefined) return { ok: false, status: 404 }
      return {
        ok: true,
        status: 200,
        text: async () => body,
        arrayBuffer: async () => Uint8Array.from(Buffer.from(body)).buffer,
      }
    })
    return calls
  }
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('inlines a client mark as a data: URI so a snapshot opened from disk still shows it (#505)', async () => {
    const calls = stubFetch({ [`${baseUrl}/clients/rolex.svg`]: SVG })
    const html =
      '<a href="/work/spaceman"><img src="/clients/rolex.svg" alt="Rolex"></a>' +
      '<img src="/clients/rolex.svg" alt="Rolex again">'
    const out = await processHtml(html, baseUrl)
    const uri = `data:image/svg+xml;base64,${b64(SVG)}`
    expect(out).toBe(
      `<a href="work/spaceman.html"><img src="${uri}" alt="Rolex"></a><img src="${uri}" alt="Rolex again">`
    )
    // One fetch per distinct mark, not per occurrence.
    expect(calls).toEqual([`${baseUrl}/clients/rolex.svg`])
  })

  it('picks the MIME type from the extension', async () => {
    stubFetch({ [`${baseUrl}/clients/framebridge.png`]: 'PNG' })
    const out = await processHtml('<img src="/clients/framebridge.png" alt="Framebridge">', baseUrl)
    expect(out).toContain(`src="data:image/png;base64,${b64('PNG')}"`)
  })

  it('leaves the src alone when the mark cannot be fetched, and never touches other srcs', async () => {
    stubFetch({})
    const html = '<img src="/clients/missing.svg" alt=""><img src="/og/2026-09-13.png" alt="">'
    expect(await processHtml(html, baseUrl)).toBe(html)
  })

  it('still rewrites the nav links the way it always has', async () => {
    stubFetch({})
    const out = await processHtml('<a href="/">home</a><a href="/about">about</a>', baseUrl)
    expect(out).toBe('<a href="index.html">home</a><a href="about.html">about</a>')
  })
})
