import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { collect, name } from '../../scripts/signals/golf.js'

describe('golf provider', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns sorted leaderboard for in-progress tournament', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        events: [
          {
            name: 'The Masters',
            status: { type: { description: 'In Progress', state: 'in' } },
            competitions: [
              {
                competitors: [
                  { order: 2, athlete: { displayName: 'Rory McIlroy' }, score: '-8' },
                  { order: 1, athlete: { displayName: 'Scottie Scheffler' }, score: '-12' },
                  { order: 3, athlete: { displayName: 'Collin Morikawa' }, score: '-6' },
                ],
              },
            ],
          },
        ],
      }),
    })

    const result = await collect({})
    expect(name).toBe('golf')
    expect(result.data.tournament).toBe('The Masters')
    expect(result.data.status).toBe('In Progress')
    // Should be sorted by order, not array position
    expect(result.data.leaders[0].name).toBe('Scottie Scheffler')
    expect(result.data.leaders[0].score).toBe('-12')
    expect(result.data.leaders[0].position).toBe('1')
    expect(result.data.leaders.length).toBe(3)
  })

  it('returns empty leaders for scheduled (pre-event) tournament', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        events: [
          {
            name: 'Houston Open',
            status: { type: { description: 'Scheduled', state: 'pre' } },
            competitions: [
              {
                competitors: [
                  { order: 1, athlete: { displayName: 'Player A' }, score: 'E' },
                  { order: 2, athlete: { displayName: 'Player B' }, score: 'E' },
                ],
              },
            ],
          },
        ],
      }),
    })

    const result = await collect({})
    expect(result.data.tournament).toBe('Houston Open')
    expect(result.data.status).toBe('Scheduled')
    // Pre-event: no real leaderboard, return empty rather than fake field-entry order
    expect(result.data.leaders).toEqual([])
  })

  it('handles no active tournament', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
    })

    const result = await collect({})
    expect(result.data.tournament).toBeNull()
    expect(result.data.leaders).toEqual([])
  })

  it('gives two competitors with no athlete name distinct fallback names', async () => {
    // On 2026-09-25 ESPN sent two competitors with no `athlete.displayName`.
    // Both fell back to the shared literal 'Unknown', and the dev panel keys
    // its leaderboard rows by name — two rows with the same key, one React
    // console error, one red CI run. The fallback must be unique per row.
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        events: [
          {
            name: 'Fixture Open',
            status: { type: { description: 'In Progress', state: 'in' } },
            competitions: [
              {
                competitors: [
                  { order: 1, athlete: { displayName: 'Player A' }, score: '-4' },
                  { order: 2, athlete: null, score: 'E' },
                  { order: 3, athlete: null, score: 'E' },
                ],
              },
            ],
          },
        ],
      }),
    })

    const result = await collect({})
    const names = result.data.leaders.map((l) => l.name)
    expect(new Set(names).size).toBe(names.length)
    expect(names).toContain('Player A')
  })
})
