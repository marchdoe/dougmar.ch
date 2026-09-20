// tests/app/panel-api.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchStatus, saveWeights, submitRating, triggerRun } from '../../app/components/panel/api'

// `isPanelStatus` is private, so these reach it the way the panel does: through
// fetchStatus, with fetch stubbed. The panel destructures the response on first
// paint, so a bad shape has to be an error and not a crash.

const fetchMock = vi.fn<typeof fetch>()

function respond(body: unknown, status = 200) {
  fetchMock.mockResolvedValueOnce(
    new Response(typeof body === 'string' ? body : JSON.stringify(body), { status })
  )
}

const status = (over: Record<string, unknown> = {}) => ({
  unrated: [],
  weights: { signals: 1, inspiration: 1, ratings: 1, risk: null },
  latestRun: null,
  errors: {},
  ...over,
})

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('fetchStatus', () => {
  it('returns a well-formed status', async () => {
    respond(status())
    await expect(fetchStatus()).resolves.toEqual(status())
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/panel/status')
  })

  it('accepts a null weights read, which `errors.weights` explains', async () => {
    respond(status({ weights: null, errors: { weights: 'GitHub said no' } }))
    await expect(fetchStatus()).resolves.toMatchObject({ weights: null })
  })

  it.each([
    ['null', null],
    ['an array', []],
    ['a string', 'ok'],
    ['a number', 7],
    ['unrated missing', { weights: {}, errors: {} }],
    ['unrated not an array', status({ unrated: {} })],
    ['weights key missing', { unrated: [], errors: {} }],
    ['weights a string', status({ weights: 'heavy' })],
    ['errors missing', { unrated: [], weights: {} }],
    ['errors null', status({ errors: null })],
    ['errors a string', status({ errors: 'none' })],
  ])('rejects a response where %s', async (_label, body) => {
    respond(body)
    await expect(fetchStatus()).rejects.toThrow('Panel status response was not the expected shape')
  })

  it('throws the server error message on a failed request', async () => {
    respond({ error: 'GitHub token missing' }, 500)
    await expect(fetchStatus()).rejects.toThrow('GitHub token missing')
  })

  it('falls back to the status code when the failure carries no JSON', async () => {
    respond('<html>bad gateway</html>', 502)
    await expect(fetchStatus()).rejects.toThrow('Request failed (502)')
  })
})

describe('the write calls', () => {
  it('submitRating posts the rating as JSON', async () => {
    respond({ ok: true, issueUrl: 'https://example.test/1' })
    const rating = { date: '2026-09-20', grade: 'B', worked: 'a', didnt: 'b', try: 'c' } as const
    await expect(submitRating(rating)).resolves.toEqual({
      ok: true,
      issueUrl: 'https://example.test/1',
    })
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('/api/panel/rate')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual(rating)
    expect(init?.headers).toMatchObject({ 'content-type': 'application/json' })
  })

  it('saveWeights puts the weights', async () => {
    respond({ ok: true })
    const weights = { signals: 2, inspiration: 1, ratings: 3, risk: 5 }
    await saveWeights(weights)
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('/api/panel/weights')
    expect(init?.method).toBe('PUT')
    expect(JSON.parse(String(init?.body))).toEqual(weights)
  })

  it('triggerRun sends dry_run', async () => {
    respond({ ok: true })
    await triggerRun(true)
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('/api/panel/run')
    expect(JSON.parse(String(init?.body))).toEqual({ dry_run: true })
  })
})
