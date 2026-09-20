// tests/dev-server/signals-endpoints.test.ts
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { Readable } from 'node:stream'
import * as yaml from 'js-yaml'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { collectSignalsHandler, devOverridesHandler } from '../../app/dev-server/signals-endpoints'
import { MAX_BODY_SIZE } from '../../app/dev-server/guards'

// devOverridesHandler writes signals/today.yml, which steers the next pipeline
// run, and collectSignalsHandler spawns the collector with .env loaded. Neither
// may touch the real thing from a test.
//
// - The write goes through the real `_saveOverridesHandler`, but the mock below
//   always hands it a temp path, and throws if the test has not set one, so the
//   default (the real today.yml) is unreachable.
// - `spawnSync` is mocked, so the collector never runs.
// - afterAll checks the real file is byte-for-byte what it was.

const temp = vi.hoisted(() => ({ path: '' }))

vi.mock('../../app/server/signals-impl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../app/server/signals-impl')>()
  return {
    ...actual,
    _saveOverridesHandler: (data: Parameters<typeof actual._saveOverridesHandler>[0]) => {
      if (!temp.path) throw new Error('test did not set a temp signals path')
      actual._saveOverridesHandler(data, temp.path)
    },
  }
})

vi.mock('node:child_process', () => ({ spawnSync: vi.fn() }))

const REAL_SIGNALS = resolve(process.cwd(), 'signals/today.yml')
let realBefore: string | null
let dir: string

beforeAll(() => {
  realBefore = existsSync(REAL_SIGNALS) ? readFileSync(REAL_SIGNALS, 'utf8') : null
})

afterAll(() => {
  const realAfter = existsSync(REAL_SIGNALS) ? readFileSync(REAL_SIGNALS, 'utf8') : null
  expect(realAfter).toBe(realBefore)
})

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'dm-signals-endpoints-'))
  temp.path = join(dir, 'today.yml')
})

afterEach(() => {
  temp.path = ''
  rmSync(dir, { recursive: true, force: true })
  vi.mocked(spawnSync).mockReset()
})

const sample = {
  date: '2026-09-20',
  weather: { conditions: 'Sunny' },
  mood_override: null,
  notes: null,
}

function seed(data: object = sample) {
  writeFileSync(temp.path, yaml.dump(data), 'utf8')
}

const readTemp = () => yaml.load(readFileSync(temp.path, 'utf8')) as Record<string, unknown>

/** A loopback request the guard lets through, with a body the handler can read. */
function request(method: string, body = '', headers: Record<string, string> = {}) {
  return Object.assign(Readable.from(body ? [Buffer.from(body)] : []), {
    method,
    headers: { host: 'localhost:5173', ...headers },
    socket: { remoteAddress: '127.0.0.1' },
  }) as never
}

function fakeRes() {
  const res = { status: 0, body: '', writeHead: vi.fn(), end: vi.fn() }
  res.writeHead.mockImplementation((s: number) => {
    res.status = s
  })
  res.end.mockImplementation((b?: string) => {
    res.body = b ?? ''
  })
  return res
}

const post = (payload: unknown) => request('POST', JSON.stringify(payload))

describe('devOverridesHandler', () => {
  it('writes the mood and notes into the signals file and says ok', async () => {
    seed()
    const res = fakeRes()
    await devOverridesHandler(post({ moodOverride: 'dark', notes: 'Hole in one' }), res as never)
    expect(res.status).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ ok: true })
    expect(readTemp()).toMatchObject({ mood_override: 'dark', notes: 'Hole in one' })
  })

  it('keeps the rest of the file', async () => {
    seed()
    await devOverridesHandler(post({ moodOverride: 'dark', notes: null }), fakeRes() as never)
    expect(readTemp()).toMatchObject({ date: '2026-09-20', weather: { conditions: 'Sunny' } })
  })

  it('turns empty and missing values into null, clearing an earlier override', async () => {
    seed({ ...sample, mood_override: 'dark', notes: 'old' })
    await devOverridesHandler(post({ moodOverride: '' }), fakeRes() as never)
    expect(readTemp()).toMatchObject({ mood_override: null, notes: null })
  })

  it('coerces a non-string value to a string', async () => {
    seed()
    await devOverridesHandler(post({ moodOverride: 5, notes: true }), fakeRes() as never)
    expect(readTemp()).toMatchObject({ mood_override: '5', notes: 'true' })
  })

  it('405s anything but POST, and writes nothing', async () => {
    seed()
    const res = fakeRes()
    await devOverridesHandler(request('GET'), res as never)
    expect(res.status).toBe(405)
    expect(readTemp()).toMatchObject({ mood_override: null, notes: null })
  })

  it('403s a request from another site before reading the body or the file', async () => {
    seed()
    const res = fakeRes()
    const cross = request('POST', JSON.stringify({ moodOverride: 'dark' }), {
      'sec-fetch-site': 'cross-site',
    })
    await devOverridesHandler(cross, res as never)
    expect(res.status).toBe(403)
    expect(readTemp().mood_override).toBeNull()
  })

  it('403s a remote peer', async () => {
    seed()
    const res = fakeRes()
    const remote = Object.assign(request('POST', '{}'), {
      socket: { remoteAddress: '192.168.1.20' },
    })
    await devOverridesHandler(remote, res as never)
    expect(res.status).toBe(403)
    expect(res.body).toContain('localhost-only')
  })

  it('500s on a body that is not JSON, and writes nothing', async () => {
    seed()
    const res = fakeRes()
    await devOverridesHandler(request('POST', '{not json'), res as never)
    expect(res.status).toBe(500)
    expect(JSON.parse(res.body).error).toMatch(/SyntaxError/)
    expect(readTemp().mood_override).toBeNull()
  })

  it('500s when the body passes the size cap', async () => {
    seed()
    const res = fakeRes()
    const big = JSON.stringify({ notes: 'x'.repeat(MAX_BODY_SIZE) })
    await devOverridesHandler(request('POST', big), res as never)
    expect(res.status).toBe(500)
    expect(JSON.parse(res.body).error).toContain('exceeds')
  })

  it('500s when the signals file is missing', async () => {
    const res = fakeRes()
    await devOverridesHandler(post({ moodOverride: 'dark' }), res as never)
    expect(res.status).toBe(500)
    expect(JSON.parse(res.body).error).toMatch(/ENOENT/)
    expect(existsSync(temp.path)).toBe(false)
  })

  it.each([
    ['empty', ''],
    ['a bare scalar', 'just words\n'],
  ])('500s when the signals file is %s, and leaves it alone', async (_label, content) => {
    writeFileSync(temp.path, content, 'utf8')
    const res = fakeRes()
    await devOverridesHandler(post({ moodOverride: 'dark' }), res as never)
    expect(res.status).toBe(500)
    expect(readFileSync(temp.path, 'utf8')).toBe(content)
  })
})

describe('collectSignalsHandler', () => {
  it('runs the collector with a 15 second cap and says ok', () => {
    const res = fakeRes()
    collectSignalsHandler(request('GET'), res as never)
    expect(spawnSync).toHaveBeenCalledTimes(1)
    const [cmd, args, options] = vi.mocked(spawnSync).mock.calls[0] ?? []
    expect(cmd).toBe('node')
    expect(args).toEqual([resolve('scripts/collect-signals.js')])
    expect(options).toMatchObject({ cwd: resolve('.'), timeout: 15000, stdio: 'inherit' })
    expect(res.status).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ ok: true })
  })

  it('does not run the collector for a request from another site', () => {
    const res = fakeRes()
    collectSignalsHandler(request('GET', '', { 'sec-fetch-site': 'cross-site' }), res as never)
    expect(spawnSync).not.toHaveBeenCalled()
    expect(res.status).toBe(403)
  })

  it('500s when the spawn throws', () => {
    vi.mocked(spawnSync).mockImplementationOnce(() => {
      throw new Error('spawn node ENOENT')
    })
    const res = fakeRes()
    collectSignalsHandler(request('GET'), res as never)
    expect(res.status).toBe(500)
    expect(JSON.parse(res.body).error).toContain('spawn node ENOENT')
  })
})
