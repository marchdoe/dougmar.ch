import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  AI_VOCABULARY,
  AI_VOCABULARY_ADDITIONS,
  AI_VOCABULARY_FROM_SKILL,
  ORPHAN_SEPARATOR_FIX,
  compileWordList,
  findOrphanSeparator,
  findTells,
  unslopPatternsSection,
} from '../../scripts/utils/copy-tells.js'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const vendored = readFileSync(path.join(REPO, 'scripts', 'prompts', 'unslop.md'), 'utf8')

const labels = (text) => findTells(text).map((h) => h.label)

describe('AI_VOCABULARY', () => {
  // The list cannot drift from its source (#504): every word we say came
  // from the vendored pattern list has to be in that file.
  it.each(AI_VOCABULARY_FROM_SKILL)('"%s" appears in scripts/prompts/unslop.md', (word) => {
    expect(vendored.toLowerCase()).toContain(word.toLowerCase())
  })

  it('is the skill words plus our own additions, kept apart', () => {
    expect(AI_VOCABULARY).toEqual([...AI_VOCABULARY_FROM_SKILL, ...AI_VOCABULARY_ADDITIONS])
    for (const word of AI_VOCABULARY_ADDITIONS) {
      expect(AI_VOCABULARY_FROM_SKILL).not.toContain(word)
    }
  })

  it('compiles to a whole-word, case-insensitive match', () => {
    const re = compileWordList(['surface', 'north star'])
    expect(re.test('the surface is')).toBe(true)
    expect(re.test('Surface')).toBe(true)
    expect(re.test('surfaces')).toBe(false)
    expect(re.test('our north star')).toBe(true)
  })
})

describe('findTells', () => {
  it('flags an em dash and a spaced en dash, and lets a range through', () => {
    expect(labels('Tigers 13–6 — no questions')).toEqual(['em dash'])
    expect(labels('one – two')).toEqual(['en dash used as a dash'])
    // A score set as three spans reads with spaces in innerText; still a score.
    expect(labels('TIGERS 11 – 7')).toEqual([])
    expect(labels('2014–2017')).toEqual([])
  })

  it('flags the site talking about itself', () => {
    expect(labels('This portfolio rebuilds itself every night')).toEqual([
      'self-reference "This portfolio"',
      'self-reference "rebuilds itself"',
      'self-reference "every night"',
    ])
    expect(labels('I rebuilt myself')).toEqual(['self-reference "rebuilt myself"'])
    expect(labels('it tears itself down')).toEqual(['self-reference "tears itself down"'])
    expect(labels('it tore itself down')).toEqual(['self-reference "tore itself down"'])
    expect(labels("tonight's rebuild log")).toEqual(['self-reference "rebuild log"'])
    expect(labels('$ rebuild self --nightly')).toEqual(['self-reference "--nightly"'])
    expect(labels('this site is')).toEqual(['self-reference "this site"'])
    expect(labels('a page that redesigns itself')).toEqual(['self-reference "redesigns itself"'])
  })

  it('flags "overnight" only after a rebuild word within thirty characters', () => {
    expect(labels('the page was remade, top to bottom, overnight')).toHaveLength(1)
    expect(labels('the storm stayed overnight')).toEqual([])
  })

  it('reports one finding where two self-reference rules start together', () => {
    expect(labels('rebuilt itself overnight')).toHaveLength(1)
  })

  it('flags AI vocabulary whole-word and case-insensitively', () => {
    expect(labels('Additionally, a vibrant tapestry')).toEqual([
      'AI vocabulary "Additionally"',
      'AI vocabulary "vibrant"',
      'AI vocabulary "tapestry"',
    ])
    expect(labels('glass surfaces')).toEqual([])
    expect(labels('gold-plating and a north star')).toHaveLength(2)
    expect(labels('a seamless journey')).toHaveLength(2)
  })

  it('flags the connective tells', () => {
    expect(labels('Not just fast, but robust')).toEqual([
      'connective tell "Not just fast, but"',
      'AI vocabulary "robust"',
    ])
    expect(labels('it serves as a hub')).toEqual(['connective tell "serves as"'])
    expect(labels("it's worth noting")).toHaveLength(1)
    expect(labels('in order to ship')).toHaveLength(1)
  })

  it('carries an index and a fix', () => {
    const [hit] = findTells('plain — words')
    expect(hit.index).toBe(6)
    expect(hit.fix).toBe('Use a period or a comma.')
  })

  it('says nothing about plain copy', () => {
    expect(findTells('Select a busy man; the other kind has no time.')).toEqual([])
  })
})

describe('unslopPatternsSection', () => {
  it('keeps the pattern list and drops the front matter', () => {
    const section = unslopPatternsSection(vendored)
    expect(section.startsWith('## Patterns to detect and fix')).toBe(true)
    expect(section).toContain('31. **Prefer the plain word.**')
    expect(section).not.toContain('name: unslop')
  })

  it('throws when the marker is missing', () => {
    expect(() => unslopPatternsSection('# nothing here')).toThrow(/Patterns to detect and fix/)
  })
})

describe('findOrphanSeparator (#568)', () => {
  it.each([
    [', iCapital', 'start', ','],
    ['· Mandiant', 'start', '·'],
    ['| Parallel Markets', 'start', '|'],
    ['— Yoko Ono', 'start', '—'],
    ['—Yoko Ono', 'start', '—'],
    ['- Mandiant', 'start', '-'],
    ['– Mandiant', 'start', '–'],
    ['/ 08', 'start', '/'],
    ['  , padded  ', 'start', ','],
  ])('flags %j at the start', (text, position, separator) => {
    expect(findOrphanSeparator(text)).toEqual({ position, separator })
  })

  it.each([
    ['2025,', ','],
    ['2025, ', ','],
    ['Bachelor of Fine Arts ·', '·'],
    ['2008 –', '–'],
    ['2008–', '–'],
    ['2025 —', '—'],
  ])('flags %j at the end', (text, separator) => {
    expect(findOrphanSeparator(text)).toEqual({ position: 'end', separator })
  })

  it('names the start when a run has a separator at both ends', () => {
    expect(findOrphanSeparator(', iCapital,')).toEqual({ position: 'start', separator: ',' })
  })

  it.each([
    'Founder & Consultant, Spaceman',
    '2022, 2025',
    '2018 — 2020',
    'Product Design · Front-End Engineering',
    // A number, a flag and a path start with a mark that is part of the value.
    '-12%',
    '–3°',
    '--flag',
    '/about',
    // A hyphen or a slash at the end is a word or a path, not a separator.
    'Well-',
    '/work/',
    '',
    '   ',
  ])('leaves %j alone', (text) => {
    expect(findOrphanSeparator(text)).toBeNull()
  })

  it.each(['—', '–', '-', '·', '|', '/', '— —', ' · '])(
    'leaves a lone divider or empty-value placeholder %j alone',
    (text) => {
      expect(findOrphanSeparator(text)).toBeNull()
    }
  )

  it('flags a lone comma, which nobody sets as a divider', () => {
    expect(findOrphanSeparator(',')).toEqual({ position: 'start', separator: ',' })
  })

  it('tolerates a missing run', () => {
    expect(findOrphanSeparator(undefined)).toBeNull()
  })

  it('has a fix that says what to do', () => {
    expect(ORPHAN_SEPARATOR_FIX).toBe(
      'A field can be empty; render the separator only when both sides exist.'
    )
  })
})
