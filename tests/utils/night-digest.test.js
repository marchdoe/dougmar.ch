import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { tempDir, writeUnder } from '../helpers/tmp.js'
import {
  buildNightDigest,
  digestKey,
  formatNightLine,
  readNight,
} from '../../scripts/utils/night-digest.js'

/** A 2026-09-28-shaped record: the fields the digest reads, nothing else. */
const record = (date, overrides = {}) => ({
  date,
  hero: { copy: `Hero for ${date}.`, source: 'quote' },
  chassis: 'bitter-mulish',
  colorScheme: { primary_hue: { h: 262, s: 63, l: 40, name: 'indigo-violet' } },
  shell: { ground_strategy: 'split-field', ground_material: 'rule' },
  composition: {
    columns: 'two-asymmetric',
    axis: 'horizontal',
    symmetry: 'left-weighted',
    hero_zone: 'upper-left',
    density: 'crowded',
    rhythm: 'even',
    shell_posture: 'folded-into-hero',
    field_ratio: 'field-dominant',
    collapse: 'split-to-sequence',
    hero_object: 'word',
  },
  ...overrides,
})

const TYPE = { case: 'caps', lead: 'roman', weight: 'heavy', alignment: 'left', texture: 'outline' }

/** One archived night: record.json, archetype.txt and a build with its type treatment. */
function seedNight(archive, date, { rec = record(date), archetype, type = TYPE } = {}) {
  writeUnder(archive, `${date}/brief.md`, `# ${date}\n`)
  writeUnder(archive, `${date}/build-1/brief.md`, `# ${date}\n`)
  if (rec) writeUnder(archive, `${date}/record.json`, JSON.stringify(rec))
  if (archetype) writeUnder(archive, `${date}/archetype.txt`, `${archetype}\n`)
  if (type) writeUnder(archive, `${date}/build-1/type-treatment.json`, JSON.stringify(type))
}

describe('formatNightLine', () => {
  it('puts every field on one line, in the key order', () => {
    const line = formatNightLine({
      date: '2026-09-28',
      composition: record('x').composition,
      archetype: 'a drafting sheet, stamped',
      hue: { h: 262, name: 'indigo-violet' },
      ground: { strategy: 'split-field', material: 'rule' },
      chassis: 'big-shoulders-atkinson',
      typeTreatment: TYPE,
      hero: 'Buildable before the first line of code.\nFaithful after the last.',
    })
    expect(line).toBe(
      '2026-09-28 | layout two-asymmetric/horizontal/left-weighted/upper-left/crowded/even/folded-into-hero/field-dominant/split-to-sequence/word "a drafting sheet, stamped" | hue 262 indigo-violet | ground split-field/rule | type big-shoulders-atkinson caps/roman/heavy/left/outline | hero "Buildable before the first line of code. Faithful after the last."'
    )
    expect(line.split(' | ')).toHaveLength(digestKey().split(' | ').length)
  })

  it('prints ? for every field a night never recorded', () => {
    expect(
      formatNightLine({
        date: '2026-07-01',
        composition: null,
        archetype: null,
        hue: null,
        ground: null,
        chassis: null,
        typeTreatment: null,
        hero: null,
      })
    ).toBe('2026-07-01 | layout ? | hue ? | ground ? | type ? ? | hero ?')
  })

  it('cuts a sentence-long archetype label short', () => {
    const line = formatNightLine({
      date: '2026-09-22',
      composition: null,
      archetype:
        'A builder’s promise on a diagonal seam: honey-gold before, raspberry after, and more',
      hue: null,
      ground: null,
      chassis: null,
      typeTreatment: null,
      hero: null,
    })
    const label = /layout \? "([^"]*)"/.exec(line)[1]
    expect(label.length).toBeLessThanOrEqual(60)
    expect(label.endsWith('…')).toBe(true)
  })
})

describe('readNight', () => {
  it('reads the record, the archetype and the shipped build’s type treatment', async () => {
    const archive = await tempDir('digest-')
    seedNight(archive, '2026-09-28', { archetype: 'a drafting sheet, stamped' })
    const night = readNight(archive, '2026-09-28')
    expect(night.hero).toBe('Hero for 2026-09-28.')
    expect(night.hue).toMatchObject({ h: 262, name: 'indigo-violet' })
    expect(night.ground).toEqual({ strategy: 'split-field', material: 'rule' })
    expect(night.typeTreatment).toEqual(TYPE)
    expect(night.archetype).toBe('a drafting sheet, stamped')
  })

  it('rebuilds a night with no record.json from its build', async () => {
    const archive = await tempDir('digest-')
    seedNight(archive, '2026-09-10', { rec: null, type: null })
    writeUnder(
      archive,
      '2026-09-10/build-1/signals-brief.md',
      '# Signals Brief\n\n## Hero Copy\nThe future is the worst thing about the present.\n\n## Chassis\ndm-serif-public\n'
    )
    writeUnder(
      archive,
      '2026-09-10/build-1/color-scheme.json',
      JSON.stringify({ primary_hue: { h: 50, name: 'old gold' } })
    )
    const night = readNight(archive, '2026-09-10')
    expect(night.hero).toBe('The future is the worst thing about the present.')
    expect(night.chassis).toBe('dm-serif-public')
    expect(night.hue).toMatchObject({ h: 50 })
    expect(night.typeTreatment).toBeNull()
    expect(night.composition).toBeNull()
  })
})

describe('buildNightDigest', () => {
  it('lists the fourteen nights before tonight, newest first, under the key', async () => {
    const archive = await tempDir('digest-')
    for (let d = 1; d <= 20; d++) seedNight(archive, `2026-09-${String(d).padStart(2, '0')}`)
    const lines = buildNightDigest(archive, { before: '2026-09-18' }).split('\n')
    expect(lines[0]).toBe(digestKey())
    const dates = lines.slice(1).map((l) => l.slice(0, 10))
    expect(dates).toHaveLength(14)
    expect(dates[0]).toBe('2026-09-17')
    expect(dates.at(-1)).toBe('2026-09-04')
  })

  it('is empty on an archive with no nights before tonight', async () => {
    const archive = await tempDir('digest-')
    seedNight(archive, '2026-09-28')
    expect(buildNightDigest(archive, { before: '2026-09-28' })).toBe('')
    expect(buildNightDigest(path.join(archive, 'missing'), { before: '2026-09-28' })).toBe('')
  })
})
