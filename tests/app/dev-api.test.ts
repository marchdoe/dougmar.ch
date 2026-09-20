// tests/app/dev-api.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { collectSignals, fetchDevData, saveOverrides, startPipeline } from '../../app/dev/api'

// `asDevData` is private, so it is exercised through fetchDevData with fetch
// stubbed. dev-panel.tsx used to assign the response fields straight out of
// `any` (#227); a bad shape should be an error with a message.

const fetchMock = vi.fn<typeof fetch>()

function respond(body: unknown, init: ResponseInit = {}) {
  fetchMock.mockResolvedValueOnce(
    new Response(typeof body === 'string' ? body : JSON.stringify(body), { status: 200, ...init })
  )
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('fetchDevData', () => {
  it('returns the three parts of a well-formed response', async () => {
    const meta = {
      collected_at: '2026-09-20T09:00:00Z',
      duration_ms: 1200,
      providers_total: 2,
      providers_ok: 2,
      providers_failed: 0,
      sources: {},
    }
    respond({ signals: { date: '2026-09-20' }, archive: [{ date: '2026-09-19' }], meta })
    await expect(fetchDevData()).resolves.toEqual({
      signals: { date: '2026-09-20' },
      archive: [{ date: '2026-09-19' }],
      meta,
    })
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/dev-data')
  })

  it('reads null signals as null', async () => {
    respond({ signals: null, archive: [], meta: null })
    await expect(fetchDevData()).resolves.toEqual({ signals: null, archive: [], meta: null })
  })

  it('reads an absent meta as null, which an older server sends', async () => {
    respond({ signals: null, archive: [] })
    await expect(fetchDevData()).resolves.toMatchObject({ meta: null })
  })

  it.each([
    ['null', null, 'response is not an object'],
    ['an array', [], 'response is not an object'],
    ['a string', '"nope"', 'response is not an object'],
    ['signals a string', { signals: 'x', archive: [] }, 'signals is not an object'],
    ['signals an array', { signals: [], archive: [] }, 'signals is not an object'],
    ['signals absent', { archive: [] }, 'signals is not an object'],
    ['archive absent', { signals: null }, 'archive is not an array'],
    ['archive an object', { signals: null, archive: {} }, 'archive is not an array'],
    ['meta a string', { signals: null, archive: [], meta: 'x' }, 'meta is not an object'],
    ['meta an array', { signals: null, archive: [], meta: [] }, 'meta is not an object'],
  ])('rejects a response where %s', async (_label, body, message) => {
    respond(body)
    await expect(fetchDevData()).rejects.toThrow(`dev-data: ${message}`)
  })

  it('says what the server said on a failed request, cut to 200 characters', async () => {
    respond('x'.repeat(500), { status: 500, statusText: 'Server Error' })
    await expect(fetchDevData()).rejects.toThrow(`500 Server Error: ${'x'.repeat(200)}`)
    respond('x'.repeat(500), { status: 500, statusText: 'Server Error' })
    await expect(fetchDevData()).rejects.not.toThrow('x'.repeat(201))
  })

  it('reports just the status when the failed response has no body', async () => {
    respond('', { status: 404, statusText: 'Not Found' })
    await expect(fetchDevData()).rejects.toThrow(/^404 Not Found$/)
  })
})

describe('the other panel calls', () => {
  it('collectSignals resolves on ok and rejects on a failure', async () => {
    respond({ ok: true })
    await expect(collectSignals()).resolves.toBeUndefined()
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/collect-signals')
    respond('collector crashed', { status: 500, statusText: 'Internal' })
    await expect(collectSignals()).rejects.toThrow('500 Internal: collector crashed')
  })

  it('saveOverrides posts the override body as JSON', async () => {
    respond({ ok: true })
    await saveOverrides({ moodOverride: 'dark', notes: null })
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('/api/dev-overrides')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({ moodOverride: 'dark', notes: null })
  })

  it('startPipeline resolves null on success', async () => {
    respond({ ok: true })
    await expect(startPipeline({ dryRun: true, mock: false, weights: null })).resolves.toBeNull()
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('/api/pipeline/start')
    expect(JSON.parse(String(init?.body))).toEqual({ dryRun: true, mock: false, weights: null })
  })

  it('startPipeline resolves the refusal message, or a default when there is none', async () => {
    const body = { dryRun: false, mock: false, weights: null }
    respond({ error: 'A run is already going' }, { status: 409 })
    await expect(startPipeline(body)).resolves.toBe('A run is already going')
    respond('not json', { status: 500 })
    await expect(startPipeline(body)).resolves.toBe('Failed to start pipeline')
  })
})
