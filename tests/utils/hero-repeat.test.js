import { describe, expect, it } from 'vitest'
import { tempDir, writeUnder } from '../helpers/tmp.js'
import {
  findHeroRepeats,
  formatOlderHeroes,
  heroRepeatReason,
  normaliseHeroPhrase,
  readRecentHeroes,
} from '../../scripts/utils/hero-repeat.js'

const BUILDABLE = 'Buildable before the first line of code. Faithful after the last.'

describe('normaliseHeroPhrase', () => {
  it('drops case, punctuation, accents and extra whitespace', () => {
    expect(
      normaliseHeroPhrase(
        '  Buildable before the first line of code.\nFaithful — after the LAST!  '
      )
    ).toBe('buildable before the first line of code faithful after the last')
    expect(normaliseHeroPhrase('Café “au lait”')).toBe('cafe au lait')
    expect(normaliseHeroPhrase('TIGERS 11–7')).toBe('tigers 11 7')
    expect(normaliseHeroPhrase(null)).toBe('')
  })
})

describe('findHeroRepeats', () => {
  const past = [
    { date: '2026-09-27', hero: 'No one ever said life was fair. Just Eventful.' },
    { date: '2026-09-23', hero: 'Deep in both. Not a generalist.' },
    { date: '2026-09-22', hero: BUILDABLE },
    { date: '2026-09-15', hero: 'BOTH' },
    { date: '2026-09-14', hero: BUILDABLE },
  ]

  it('catches 2026-09-28 repeating 2026-09-22 and 2026-09-14', () => {
    expect(findHeroRepeats(BUILDABLE, past)).toEqual([
      { date: '2026-09-22', hero: BUILDABLE, kind: 'exact' },
      { date: '2026-09-14', hero: BUILDABLE, kind: 'exact' },
    ])
  })

  it('matches after case and punctuation are gone', () => {
    const hit = findHeroRepeats(
      'BUILDABLE BEFORE THE FIRST LINE OF CODE — FAITHFUL AFTER THE LAST',
      past
    )
    expect(hit.map((r) => r.kind)).toEqual(['exact', 'exact'])
  })

  it('catches the line trimmed to its first sentence, or extended', () => {
    const trimmed = findHeroRepeats('Buildable before the first line of code.', past)
    expect(trimmed.map((r) => [r.date, r.kind])).toEqual([
      ['2026-09-22', 'contains'],
      ['2026-09-14', 'contains'],
    ])
    const longer = findHeroRepeats(`${BUILDABLE} Every time.`, past)
    expect(longer.map((r) => r.date)).toEqual(['2026-09-22', '2026-09-14'])
  })

  it('does not count a phrase under four words inside a longer one', () => {
    // 2026-09-15's "BOTH" sits inside 2026-09-23's line; they are different pages.
    expect(findHeroRepeats('Deep in both. Not a generalist.', [past[3]])).toEqual([])
    expect(findHeroRepeats('Both', [past[1]])).toEqual([])
    // Still an exact repeat when the short phrase comes back whole.
    expect(findHeroRepeats('both.', past).map((r) => r.date)).toEqual(['2026-09-15'])
  })

  it('matches whole words only', () => {
    expect(
      findHeroRepeats('Unbuildable before the first line of codebases', [
        { date: 'd', hero: 'buildable before the first line of code' },
      ])
    ).toEqual([])
  })

  it('passes a fresh phrase and an empty one', () => {
    expect(findHeroRepeats('What do we live for?', past)).toEqual([])
    expect(findHeroRepeats('', past)).toEqual([])
  })
})

describe('readRecentHeroes', () => {
  it('reads the 30 calendar days before tonight, newest first, skipping nights with no hero', async () => {
    const archive = await tempDir('heroes-')
    const night = (date, copy) =>
      writeUnder(archive, `${date}/record.json`, JSON.stringify({ date, hero: { copy } }))
    night('2026-08-28', 'Thirty-one days back.')
    night('2026-08-29', 'Thirty days back.')
    night('2026-09-22', BUILDABLE)
    night('2026-09-27', null)
    night('2026-09-28', 'Tonight is not its own history.')
    expect(readRecentHeroes(archive, { before: '2026-09-28' })).toEqual([
      { date: '2026-09-22', hero: BUILDABLE },
      { date: '2026-08-29', hero: 'Thirty days back.' },
    ])
  })
})

describe('heroRepeatReason', () => {
  it('names the phrase, every night that used it, and the rule', () => {
    const reason = heroRepeatReason(BUILDABLE, [
      { date: '2026-09-22', hero: BUILDABLE, kind: 'exact' },
      { date: '2026-09-10', hero: 'Buildable before the first line of code.', kind: 'contains' },
    ])
    expect(reason).toContain(`"${BUILDABLE}" was already the hero on 2026-09-22`)
    expect(reason).toContain('2026-09-10 ("Buildable before the first line of code.", overlapping)')
    expect(reason).toContain('last 30 days')
  })
})

describe('formatOlderHeroes', () => {
  it('lists only the nights older than the digest shows', () => {
    const past = [
      { date: '2026-09-27', hero: 'Shown.' },
      { date: '2026-09-13', hero: 'TIGERS\n11–7' },
    ]
    expect(formatOlderHeroes(past, '2026-09-14')).toBe(
      'Also taken, from earlier nights in the last 30 days: 2026-09-13 "TIGERS 11–7"'
    )
    expect(formatOlderHeroes(past.slice(0, 1), '2026-09-14')).toBe('')
  })
})
