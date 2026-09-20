import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  fetchArchiveFile,
  isArchiveIndex,
  loadArchiveDetail,
  loadArchiveIndex,
} from '../../app/lib/archive-data'

const DETAIL = {
  date: '2026-09-19',
  era: 'grammar',
  tokens: null,
  hasScreenshot: true,
  pages: 9,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isArchiveIndex', () => {
  it('accepts an array of entries that carry a date', () => {
    expect(isArchiveIndex([{ date: '2026-09-19' }, { date: '2026-09-18', extra: 1 }])).toBe(true)
    expect(isArchiveIndex([])).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isArchiveIndex(null)).toBe(false)
    expect(isArchiveIndex({ date: '2026-09-19' })).toBe(false)
    expect(isArchiveIndex([{ date: 3 }])).toBe(false)
    expect(isArchiveIndex([null])).toBe(false)
    expect(isArchiveIndex(['2026-09-19'])).toBe(false)
    expect(isArchiveIndex([{ date: '2026-09-19' }, {}])).toBe(false)
  })
})

describe('loadArchiveIndex', () => {
  it('returns the index its source parsed', async () => {
    const source = vi.fn().mockResolvedValue([{ date: '2026-09-19' }])
    await expect(loadArchiveIndex(source)).resolves.toEqual([{ date: '2026-09-19' }])
    expect(source).toHaveBeenCalledWith('index.json')
  })

  it('throws when the source is not an index', async () => {
    await expect(loadArchiveIndex(async () => ({ date: '2026-09-19' }))).rejects.toThrow(
      /not the expected shape/
    )
  })

  it('lets a source failure through', async () => {
    await expect(
      loadArchiveIndex(async () => {
        throw new Error('offline')
      })
    ).rejects.toThrow('offline')
  })
})

describe('loadArchiveDetail', () => {
  it('returns a record that passes the guard', async () => {
    const source = vi.fn().mockResolvedValue(DETAIL)
    await expect(loadArchiveDetail('2026-09-19', source)).resolves.toBe(DETAIL)
    expect(source).toHaveBeenCalledWith('2026-09-19.json')
  })

  it('is null for a record that fails the guard', async () => {
    await expect(loadArchiveDetail('2026-09-19', async () => ({}))).resolves.toBeNull()
    await expect(loadArchiveDetail('2026-09-19', async () => null)).resolves.toBeNull()
    await expect(loadArchiveDetail('2026-09-19', async () => '<html>')).resolves.toBeNull()
  })

  it('is null, not a throw, when the source fails', async () => {
    const source = async () => {
      throw new Error('404')
    }
    await expect(loadArchiveDetail('2026-09-19', source)).resolves.toBeNull()
  })

  it('never asks the source about a malformed date', async () => {
    const source = vi.fn().mockResolvedValue(DETAIL)
    await expect(loadArchiveDetail('../secrets', source)).resolves.toBeNull()
    await expect(loadArchiveDetail('2026-9-19', source)).resolves.toBeNull()
    await expect(loadArchiveDetail('', source)).resolves.toBeNull()
    expect(source).not.toHaveBeenCalled()
  })
})

describe('fetchArchiveFile', () => {
  it('fetches the file under /archive-data and parses it', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [1] })
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchArchiveFile('index.json')).resolves.toEqual([1])
    expect(fetchMock).toHaveBeenCalledWith('/archive-data/index.json')
  })

  it('throws with the status when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))
    await expect(fetchArchiveFile('index.json')).rejects.toThrow('Failed to load archive (503)')
  })

  it('makes the detail loader answer null when the host serves the SPA shell as HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token <')
        },
      })
    )
    await expect(loadArchiveDetail('2026-09-19')).resolves.toBeNull()
  })
})
