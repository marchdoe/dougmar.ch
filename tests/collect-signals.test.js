import { describe, it, expect } from 'vitest'
import { parseOnly, runCollector, selectProviders } from '../scripts/collect-signals.js'

describe('collect-signals orchestrator', () => {
  // No cleanup hook here on purpose.
  //
  // There used to be one that unlinked signals/today.yml and today.meta.yml
  // after every test. runCollector() does not write them — writeOutputs() does,
  // and only from the CLI branch — so the hook deleted files this file had
  // never created. Running `pnpm test` with a collected today.yml on disk threw
  // away the real signals for the day, and because the dev server re-collects
  // on the next /api/dev-data hit, it looked like nothing had happened.
  //
  // If a test here ever does need to write, give runCollector a temp path;
  // do not clean the developer's working tree from a unit test.

  it('collects from providers and writes YAML + meta', async () => {
    const mockProviders = [
      {
        name: 'test-ok',
        timeout: 1000,
        collect: async () => ({ data: { value: 'hello' }, meta: { source: 'test', items: 1 } }),
      },
      {
        name: 'test-fail',
        timeout: 1000,
        collect: async () => {
          throw new Error('API down')
        },
      },
    ]

    const mockProfile = { location: { zip: '20105' } }
    const result = await runCollector(mockProviders, mockProfile)

    expect(result.signals['test-ok']).toEqual({ value: 'hello' })
    expect(result.signals['test-fail']).toBeUndefined()
    expect(result.meta.sources['test-ok'].status).toBe('ok')
    expect(result.meta.sources['test-fail'].status).toBe('error')
    expect(result.meta.sources['test-fail'].reason).toContain('API down')
  })

  it('enforces per-provider timeout', async () => {
    // A provider that never settles rather than one that races a real 5s
    // timer. The old version needed a 10s test budget, accepted either
    // 'skipped' or 'error' because "CI timing jitter can cause the timeout to
    // fire slightly early", and left a live 5s timer running after the test
    // had finished. The provider's own 100ms timeout is the thing under test,
    // so nothing here needs to take 100ms of wall clock either.
    const mockProviders = [
      {
        name: 'test-slow',
        timeout: 100,
        collect: () => new Promise(() => {}),
      },
    ]

    const mockProfile = { location: { zip: '20105' } }
    const result = await runCollector(mockProviders, mockProfile)

    expect(result.meta.sources['test-slow'].status).toBe('skipped')
    expect(result.meta.sources['test-slow'].reason).toContain('timeout')
  })

  it('stamps the date in the site timezone, not UTC', async () => {
    // 22:00 in Ashburn is already tomorrow in UTC. The record used to say
    // tomorrow's date beside today's weekday.
    const now = new Date('2026-08-31T02:00:00Z')
    expect(now.toISOString().slice(0, 10)).toBe('2026-08-31')

    const result = await runCollector([], { location: { tz: 'America/New_York' } }, { now })
    expect(result.signals.date).toBe('2026-08-30')
  })

  it('hands every provider the same instant', async () => {
    // Each derived collector used to call new Date() milliseconds apart,
    // which straddles midnight about once a year.
    const seen = []
    const providers = ['a', 'b', 'c'].map((name) => ({
      name,
      timeout: 1000,
      collect: async (_p, opts) => {
        seen.push(opts.now.toISOString())
        return { data: { name }, meta: { source: 'test', items: 1 } }
      },
    }))
    const now = new Date('2026-08-30T12:00:00Z')
    await runCollector(providers, { location: { tz: 'America/New_York' } }, { now })
    expect(new Set(seen).size).toBe(1)
    expect(seen[0]).toBe('2026-08-30T12:00:00.000Z')
  })
})

describe('--only', () => {
  const provider = (name) => ({
    name,
    timeout: 1000,
    collect: async () => ({ data: { name }, meta: { source: 'test', items: 1 } }),
  })
  const providers = ['weather', 'season', 'sun'].map(provider)

  it('reads the names after the flag, either spelling', () => {
    expect(parseOnly(['--only', 'weather,season'])).toEqual(['weather', 'season'])
    expect(parseOnly(['--only=weather, season'])).toEqual(['weather', 'season'])
    expect(parseOnly(['--other', '--only', 'sun'])).toEqual(['sun'])
  })

  it('is null when the flag is absent, and an error when it names nothing', () => {
    expect(parseOnly([])).toBeNull()
    expect(() => parseOnly(['--only'])).toThrow(/comma-separated list/)
    expect(() => parseOnly(['--only='])).toThrow(/comma-separated list/)
  })

  it('keeps only the named providers, so only those are collected', async () => {
    const chosen = selectProviders(providers, ['season', 'weather'])
    expect(chosen.map((p) => p.name)).toEqual(['weather', 'season'])

    const { signals, meta } = await runCollector(chosen, { location: { tz: 'America/New_York' } })
    expect(Object.keys(signals).sort()).toEqual(['date', 'season', 'weather'])
    expect(meta.providers_total).toBe(2)
    expect(Object.keys(meta.sources).sort()).toEqual(['season', 'weather'])
  })

  it('refuses a name that is not a provider and lists the ones that are', () => {
    expect(() => selectProviders(providers, ['weather', 'wether'])).toThrow(
      /wether, which is not a provider\. Providers: season, sun, weather/
    )
  })
})
