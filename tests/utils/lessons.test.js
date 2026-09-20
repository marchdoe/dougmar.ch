import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  PHONE_WIDTHS,
  buildLessonsBlock,
  buildMobileLessonBlock,
  extractMobileSignals,
  formatMobileLessonBlock,
} from '../../scripts/utils/lessons.js'

function seed(archiveDir, date, { verdicts, rating, composition } = {}) {
  const buildDir = path.join(archiveDir, date, `build-${Date.parse(date)}`)
  mkdirSync(buildDir, { recursive: true })
  if (verdicts) writeFileSync(path.join(buildDir, 'verdicts.json'), JSON.stringify(verdicts))
  if (composition)
    writeFileSync(path.join(buildDir, 'composition.json'), JSON.stringify(composition))
  if (rating)
    writeFileSync(
      path.join(archiveDir, date, `rating-${Date.parse(date)}.json`),
      JSON.stringify(rating)
    )
}

describe('buildLessonsBlock', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'lessons-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('collects REVISE feedback and rating critiques, newest first, capped', () => {
    seed(archiveDir, '2026-06-09', {
      verdicts: [
        { critic: 'mockup-critic', verdict: 'REVISE', feedback: 'utilization ~45% vs floor 70' },
      ],
    })
    seed(archiveDir, '2026-06-10', {
      rating: { grade: 'C', didnt: 'footer felt bolted on', try: 'fold footer into the rail' },
    })
    const block = buildLessonsBlock(archiveDir, { limit: 7 })
    expect(block).toContain('## Recent Lessons')
    expect(block).toContain('utilization ~45%')
    expect(block).toContain('footer felt bolted on')
    expect(block.indexOf('footer felt')).toBeLessThan(block.indexOf('utilization')) // newest first
  })

  it('ignores SHIP/APPROVE verdicts and returns empty string with no material', () => {
    seed(archiveDir, '2026-06-10', {
      verdicts: [
        { critic: 'screenshot-critic', verdict: 'SHIP', feedback: 'fine' },
        { critic: 'mockup-critic', verdict: 'APPROVE', feedback: 'strong' },
        { critic: 'spec-critic', verdict: 'APPROVED', feedback: 'ok' },
      ],
    })
    expect(buildLessonsBlock(archiveDir, { limit: 7 })).toBe('')
  })

  it('respects the limit', () => {
    for (let d = 1; d <= 9; d++) {
      const date = `2026-06-0${d}`
      seed(archiveDir, date, {
        verdicts: [{ critic: 'mockup-critic', verdict: 'REVISE', feedback: `flaw-${d}` }],
      })
    }
    const block = buildLessonsBlock(archiveDir, { limit: 3 })
    expect(block).toContain('flaw-9')
    expect(block).not.toContain('flaw-1')
    expect((block.match(/^- /gm) || []).length).toBe(3)
  })

  it('caps by ENTRY count, not date count — mixed sources on one date', () => {
    seed(archiveDir, '2026-06-10', {
      verdicts: [
        { critic: 'mockup-critic', verdict: 'REVISE', feedback: 'round-0 utilization low' },
        { critic: 'screenshot-critic', verdict: 'REVISE', feedback: 'render diverged from mockup' },
      ],
      rating: { grade: 'C', didnt: 'hero too quiet', try: '' },
    })
    seed(archiveDir, '2026-06-09', {
      verdicts: [{ critic: 'mockup-critic', verdict: 'REVISE', feedback: 'older flaw' }],
    })
    const block = buildLessonsBlock(archiveDir, { limit: 3 })
    // three entries from 06-10 fill the cap; 06-09's entry is cut
    expect((block.match(/^- /gm) || []).length).toBe(3)
    expect(block).toContain('hero too quiet')
    expect(block).toContain('utilization low')
    expect(block).not.toContain('older flaw')
  })

  it('escalates substantially-similar complaints across ≥2 builds to RECURRING, folded into one entry', () => {
    seed(archiveDir, '2026-06-08', {
      rating: { grade: 'C', didnt: 'the header is messed up and cramped', try: '' },
    })
    seed(archiveDir, '2026-06-10', {
      rating: { grade: 'C', didnt: 'header still messed up, cramped again', try: '' },
    })
    seed(archiveDir, '2026-06-11', {
      verdicts: [{ critic: 'mockup-critic', verdict: 'REVISE', feedback: 'unrelated spacing nit' }],
    })
    const block = buildLessonsBlock(archiveDir, { limit: 7 })
    expect(block).toContain('RECURRING (2x):')
    // folded to one line, not two
    expect((block.match(/RECURRING/g) || []).length).toBe(1)
    // uses the newest occurrence's text
    expect(block).toContain('header still messed up, cramped again')
  })

  it('sorts RECURRING lessons before non-recurring ones regardless of date', () => {
    seed(archiveDir, '2026-06-05', {
      rating: { grade: 'C', didnt: 'brand lockup is a placeholder gray box', try: '' },
    })
    seed(archiveDir, '2026-06-06', {
      rating: { grade: 'C', didnt: 'brand lockup still a placeholder gray box', try: '' },
    })
    seed(archiveDir, '2026-06-12', {
      verdicts: [
        {
          critic: 'screenshot-critic',
          verdict: 'REVISE',
          feedback: 'a totally distinct one-off nit',
        },
      ],
    })
    const block = buildLessonsBlock(archiveDir, { limit: 7 })
    expect(block.indexOf('RECURRING')).toBeLessThan(block.indexOf('distinct one-off nit'))
  })

  it('does not mark a single occurrence as RECURRING', () => {
    seed(archiveDir, '2026-06-10', {
      rating: { grade: 'C', didnt: 'footer felt bolted on', try: '' },
    })
    const block = buildLessonsBlock(archiveDir, { limit: 7 })
    expect(block).not.toContain('RECURRING')
  })

  it('surfaces a BAR self-eval entry even on a SHIP verdict', () => {
    seed(archiveDir, '2026-06-10', {
      verdicts: [
        {
          critic: 'screenshot-critic',
          verdict: 'SHIP',
          feedback: 'fine',
          bar: { position: 'below', reason: 'canvas utilization was lower than the reference' },
        },
      ],
    })
    const block = buildLessonsBlock(archiveDir, { limit: 7 })
    expect(block).toContain('BAR vs best build: below')
    expect(block).toContain('canvas utilization was lower than the reference')
    expect(block).toContain('screenshot-critic (BAR)')
  })

  it('tolerates a BAR entry with an empty reason', () => {
    seed(archiveDir, '2026-06-10', {
      verdicts: [
        { critic: 'screenshot-critic', verdict: 'SHIP', bar: { position: 'at', reason: '' } },
      ],
    })
    const block = buildLessonsBlock(archiveDir, { limit: 7 })
    expect(block).toContain('BAR vs best build: at')
  })

  it('omits a BAR entry when the verdict carries no bar field (no reference was attached)', () => {
    seed(archiveDir, '2026-06-10', {
      verdicts: [{ critic: 'screenshot-critic', verdict: 'SHIP', feedback: 'fine' }],
    })
    expect(buildLessonsBlock(archiveDir, { limit: 7 })).toBe('')
  })
})

describe('extractMobileSignals', () => {
  const tuple = { columns: 'two-asymmetric', hero_zone: 'edge-bound', density: 'measured' }

  it('keeps a surface-gate line with @360 and drops one with @1440', () => {
    const verdicts = [
      {
        critic: 'surface-gate',
        verdict: 'REVISE',
        feedback: '/ @360: document is 91px wider than the 360px viewport\n/ @1440: fine',
      },
    ]
    const out = extractMobileSignals('2026-06-10', verdicts, tuple)
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      date: '2026-06-10',
      tuple: 'two-asymmetric/edge-bound/measured',
    })
    expect(out[0].text).toContain('@360')
  })

  it('picks mockup-critic and screenshot-critic sentences mentioning 360, phone or mobile', () => {
    const verdicts = [
      {
        critic: 'mockup-critic',
        verdict: 'REVISE',
        feedback:
          'Canvas utilization is fine on desktop. At 360×640, the split collapses to a single column and the idea survives.',
      },
      {
        critic: 'screenshot-critic',
        verdict: 'REVISE',
        feedback: 'This content is gone for phone visitors. Desktop rendering is unaffected.',
      },
    ]
    const out = extractMobileSignals('2026-06-10', verdicts, tuple)
    expect(out).toHaveLength(2)
    expect(out.some((e) => e.text.includes('single column'))).toBe(true)
    expect(out.some((e) => e.text.includes('gone for phone visitors'))).toBe(true)
    expect(out.some((e) => e.text.includes('unaffected'))).toBe(false)
  })

  it('ignores critics other than surface-gate, mockup-critic and screenshot-critic', () => {
    const verdicts = [
      { critic: 'spec-critic', verdict: 'APPROVED', feedback: 'mentions phone and 360 anyway' },
    ]
    expect(extractMobileSignals('2026-06-10', verdicts, tuple)).toEqual([])
  })

  it('defaults the tuple to ?/?/? when composition.json is missing', () => {
    const verdicts = [{ critic: 'surface-gate', verdict: 'REVISE', feedback: '/ @360: too wide' }]
    const out = extractMobileSignals('2026-06-10', verdicts, null)
    expect(out[0].tuple).toBe('?/?/?')
  })

  it('reads the archive at 360 and at the current width, each listed once', () => {
    expect(PHONE_WIDTHS).toContain(360)
    expect(PHONE_WIDTHS).toContain(NARROW_VIEWPORT.width)
    expect(new Set(PHONE_WIDTHS).size).toBe(PHONE_WIDTHS.length)
  })

  it('keeps @360 history readable beside a second phone width', () => {
    // What the archive looks like after the width moves: old nights gated at
    // 360, new ones at the other width. Both are the phone; 1440 never is.
    const verdicts = [
      {
        critic: 'surface-gate',
        verdict: 'REVISE',
        feedback: '/ @360: old night\n/about @320: new night\n/ @1440: desktop',
      },
      {
        critic: 'mockup-critic',
        verdict: 'REVISE',
        feedback: 'At 320 wide the split is gone. At 360 it was gone too. At 1440 it holds.',
      },
    ]
    const out = extractMobileSignals('2026-06-10', verdicts, tuple, { phoneWidths: [360, 320] })
    expect(out.map((e) => e.text)).toEqual([
      '/ @360: old night',
      '/about @320: new night',
      'At 320 wide the split is gone.',
      'At 360 it was gone too.',
    ])
    // With only 360 listed, the other width is not the phone.
    const only360 = extractMobileSignals('2026-06-10', verdicts, tuple, { phoneWidths: [360] })
    expect(only360.map((e) => e.text)).toEqual(['/ @360: old night', 'At 360 it was gone too.'])
  })

  it('returns nothing for an empty or missing verdicts list', () => {
    expect(extractMobileSignals('2026-06-10', [], tuple)).toEqual([])
    expect(extractMobileSignals('2026-06-10', undefined, tuple)).toEqual([])
  })
})

describe('formatMobileLessonBlock', () => {
  it('returns an empty string when there is nothing to report', () => {
    expect(formatMobileLessonBlock([])).toBe('')
  })

  it('renders each entry as "date · tuple · text" under a one-line heading', () => {
    const block = formatMobileLessonBlock([
      { date: '2026-06-10', tuple: 'single/center/sparse', text: '/ @360: too wide' },
    ])
    const lines = block.split('\n')
    expect(lines[0]).toContain('##')
    expect(lines[0]).toContain(`${NARROW_VIEWPORT.width}px`)
    expect(block).toContain('2026-06-10 · single/center/sparse · / @360: too wide')
  })

  it('caps at the given limit, keeping the first (newest) entries', () => {
    const entries = Array.from({ length: 9 }, (_, i) => ({
      date: `2026-06-0${i + 1}`,
      tuple: 'single/center/sparse',
      text: `flaw-${i}`,
    }))
    const block = formatMobileLessonBlock(entries, { limit: 6 })
    expect(block).toContain('flaw-0')
    expect(block).toContain('flaw-5')
    expect(block).not.toContain('flaw-6')
    expect((block.match(/^2026-06/gm) || []).length).toBe(6)
  })

  it('deduplicates identical text (e.g. the same surface-gate line measured in both schemes)', () => {
    const entries = [
      { date: '2026-06-10', tuple: 'single/center/sparse', text: '/ @360: too wide' },
      { date: '2026-06-10', tuple: 'single/center/sparse', text: '/ @360: too wide' },
    ]
    const block = formatMobileLessonBlock(entries)
    expect((block.match(/too wide/g) || []).length).toBe(1)
  })
})

describe('buildMobileLessonBlock', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'mobile-lessons-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('returns empty when the archive has no shipped builds', () => {
    expect(buildMobileLessonBlock(archiveDir)).toBe('')
  })

  it('handles a shipped night with composition.json but no verdicts.json', () => {
    const buildDir = path.join(archiveDir, '2026-06-10', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(
      path.join(buildDir, 'composition.json'),
      JSON.stringify({ columns: 'single', hero_zone: 'center', density: 'sparse' })
    )
    expect(buildMobileLessonBlock(archiveDir)).toBe('')
  })

  it('combines surface-gate @360 findings, critic phone sentences and the tuple across recent nights', () => {
    seed(archiveDir, '2026-06-10', {
      verdicts: [
        {
          critic: 'surface-gate',
          verdict: 'REVISE',
          feedback: '/work @360: document is 154px wider than the 360px viewport',
        },
      ],
      composition: { columns: 'two-asymmetric', hero_zone: 'edge-bound', density: 'measured' },
    })
    seed(archiveDir, '2026-06-09', {
      verdicts: [
        {
          critic: 'screenshot-critic',
          verdict: 'REVISE',
          feedback: 'Section 10 (phone, 360px): the evidence half is entirely missing.',
        },
      ],
      composition: { columns: 'single', hero_zone: 'full-bleed', density: 'sparse' },
    })
    const block = buildMobileLessonBlock(archiveDir, { lookbackDays: 7, limit: 6 })
    expect(block).toContain('2026-06-10 · two-asymmetric/edge-bound/measured · /work @360')
    expect(block).toContain('2026-06-09 · single/full-bleed/sparse · Section 10 (phone, 360px)')
    // newest first
    expect(block.indexOf('2026-06-10')).toBeLessThan(block.indexOf('2026-06-09'))
  })
})
