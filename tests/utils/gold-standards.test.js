import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { loadGoldStandards } from '../../scripts/utils/gold-standards.js'

let root

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'gold-'))
  mkdirSync(path.join(root, 'references'))
})
afterEach(() => rmSync(root, { recursive: true, force: true }))

function writeIndex(yml) {
  writeFileSync(path.join(root, 'references/index.yml'), yml)
}

describe('loadGoldStandards', () => {
  it('returns gold entries with an image on disk, in index order', async () => {
    writeIndex(`references:
  - file: own-2026-06-13-b.png
    gold: true
    description: "second by date, first in index"
  - file: own-2026-04-28-a.png
    gold: true
    description: "first by date"
`)
    writeFileSync(path.join(root, 'references/own-2026-06-13-b.png'), 'x')
    writeFileSync(path.join(root, 'references/own-2026-04-28-a.png'), 'x')
    const { standards, missing } = await loadGoldStandards({ root })
    expect(missing).toEqual([])
    expect(standards.map((s) => s.file)).toEqual(['own-2026-06-13-b.png', 'own-2026-04-28-a.png'])
    expect(standards[0]).toEqual({
      file: 'own-2026-06-13-b.png',
      path: path.join(root, 'references/own-2026-06-13-b.png'),
      date: '2026-06-13',
      description: 'second by date, first in index',
    })
  })

  it('skips gold entries whose image is missing and reports them', async () => {
    writeIndex(`references:
  - file: present.png
    gold: true
    description: here
  - file: absent.png
    gold: true
    description: gone
`)
    writeFileSync(path.join(root, 'references/present.png'), 'x')
    const { standards, missing } = await loadGoldStandards({ root })
    expect(standards.map((s) => s.file)).toEqual(['present.png'])
    expect(standards[0].date).toBeNull()
    expect(missing).toEqual(['absent.png'])
  })

  it('ignores entries that are not gold, even with an image', async () => {
    writeIndex(`references:
  - file: plain.png
    description: not gold
  - file: no.png
    gold: false
    description: explicitly not gold
  - url: https://example.com
    gold: true
    description: gold but no file
`)
    writeFileSync(path.join(root, 'references/plain.png'), 'x')
    writeFileSync(path.join(root, 'references/no.png'), 'x')
    expect(await loadGoldStandards({ root })).toEqual({ standards: [], missing: [] })
  })

  it('returns empty lists when there is no index', async () => {
    rmSync(path.join(root, 'references'), { recursive: true })
    expect(await loadGoldStandards({ root })).toEqual({ standards: [], missing: [] })
  })
})
