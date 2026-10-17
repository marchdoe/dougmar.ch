import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { loadTier } from '../../scripts/utils/reference-tiers.js'

let root

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'tiers-'))
  mkdirSync(path.join(root, 'references'))
})
afterEach(() => rmSync(root, { recursive: true, force: true }))

function writeIndex(yml) {
  writeFileSync(path.join(root, 'references/index.yml'), yml)
}

describe('loadTier', () => {
  it('returns floor entries with an image on disk, in index order', async () => {
    writeIndex(`references:
  - file: own-2026-06-13-b.png
    tier: floor
    description: "second by date, first in index"
  - file: own-2026-04-28-a.png
    tier: floor
    description: "first by date"
`)
    writeFileSync(path.join(root, 'references/own-2026-06-13-b.png'), 'x')
    writeFileSync(path.join(root, 'references/own-2026-04-28-a.png'), 'x')
    const { entries, missing } = await loadTier({ root, tier: 'floor' })
    expect(missing).toEqual([])
    expect(entries.map((s) => s.file)).toEqual(['own-2026-06-13-b.png', 'own-2026-04-28-a.png'])
    expect(entries[0]).toEqual({
      file: 'own-2026-06-13-b.png',
      path: path.join(root, 'references/own-2026-06-13-b.png'),
      date: '2026-06-13',
      description: 'second by date, first in index',
    })
  })

  it('skips floor entries whose image is missing and reports them', async () => {
    writeIndex(`references:
  - file: present.png
    tier: floor
    description: here
  - file: absent.png
    tier: floor
    description: gone
`)
    writeFileSync(path.join(root, 'references/present.png'), 'x')
    const { entries, missing } = await loadTier({ root, tier: 'floor' })
    expect(entries.map((s) => s.file)).toEqual(['present.png'])
    expect(entries[0].date).toBeNull()
    expect(missing).toEqual(['absent.png'])
  })

  it('ignores entries that are no tier, even with an image', async () => {
    writeIndex(`references:
  - file: plain.png
    description: no tier
  - file: no.png
    tier: gold
    description: other tier
  - url: https://example.com
    tier: floor
    description: floor but no file
`)
    writeFileSync(path.join(root, 'references/plain.png'), 'x')
    writeFileSync(path.join(root, 'references/no.png'), 'x')
    expect(await loadTier({ root, tier: 'floor' })).toEqual({ entries: [], missing: [] })
  })

  it('keeps tiers apart and allows an empty gold tier', async () => {
    writeIndex(`references:
  - file: f.png
    tier: floor
    description: floor one
`)
    writeFileSync(path.join(root, 'references/f.png'), 'x')
    expect(await loadTier({ root, tier: 'gold' })).toEqual({ entries: [], missing: [] })
    expect((await loadTier({ root, tier: 'floor' })).entries).toHaveLength(1)
  })

  it('rejects an unknown tier', async () => {
    await expect(loadTier({ root, tier: 'silver' })).rejects.toThrow(/unknown reference tier/)
  })

  it('returns empty lists when there is no index', async () => {
    rmSync(path.join(root, 'references'), { recursive: true })
    expect(await loadTier({ root, tier: 'floor' })).toEqual({ entries: [], missing: [] })
  })
})
