/**
 * The rules of the line-length check (#569), against records built by hand.
 * line-length-dom.test.js proves the records against real Chromium.
 */
import { describe, expect, it } from 'vitest'
import {
  LINE_LENGTH_FIX,
  LINE_LENGTH_OPTIONS,
  MAX_LINE_LENGTH_REPORTED,
  collapseLineLength,
  describeBlock,
  lineLengthFindings,
  longestLine,
  medianFullLine,
} from '../../scripts/utils/line-length.js'
import { evaluateMeasurement, faultsForOwner } from '../../scripts/utils/surface-gate.js'
import { LINE_LENGTH_MAX_CHARS } from '../../scripts/utils/responsive-thresholds.js'
import { SMALL_TEXT_OPTIONS } from '../../scripts/utils/small-text.js'

const block = (over = {}) => ({
  selector: 'main > p.body',
  tag: 'p',
  sizePx: 16,
  boxPx: 568,
  words: 30,
  lines: [70, 72, 40],
  sample: 'Independent design and engineering',
  part: null,
  ...over,
})

const at = (blocks, extra = {}) => ({
  route: '/about',
  viewport: 'desktop',
  scheme: 'light',
  lineLength: { blocks },
  ...extra,
})

describe('what a block reads as', () => {
  it('takes the median of the full lines, the last line being what was left over', () => {
    expect(medianFullLine([80, 72, 10])).toBe(76)
    expect(medianFullLine([80, 72, 60, 5])).toBe(72)
    // A block of one line is its own measure.
    expect(medianFullLine([97])).toBe(97)
  })

  it('takes the longest line whatever line it is on', () => {
    expect(longestLine([70, 84, 12])).toBe(84)
    expect(longestLine([])).toBe(0)
  })

  it('walks the same tags as the type-size floor, and eight words', () => {
    expect(LINE_LENGTH_OPTIONS.runningTags).toBe(SMALL_TEXT_OPTIONS.runningTags)
    expect(LINE_LENGTH_OPTIONS.minWords).toBe(8)
  })
})

describe('lineLengthFindings', () => {
  it('leaves a block whose longest line is at the limit alone', () => {
    const lines = [LINE_LENGTH_MAX_CHARS, 60, 20]
    expect(lineLengthFindings(at([block({ lines })]), 'react-engineer')).toEqual([])
  })

  it('flags a block one character over, as an error the engineer owns', () => {
    const lines = [LINE_LENGTH_MAX_CHARS + 1, 60, 20]
    const [f] = lineLengthFindings(at([block({ lines })]), 'react-engineer')
    expect(f).toMatchObject({
      kind: 'line-length',
      severity: 'error',
      owner: 'react-engineer',
      rank: LINE_LENGTH_MAX_CHARS + 1,
    })
    expect(f.detail).toContain(`sets ${LINE_LENGTH_MAX_CHARS + 1} characters on its longest line`)
    expect(f.detail).toContain('3 lines')
    expect(f.detail).toContain('16px in a 568px box')
    expect(f.detail).toContain(LINE_LENGTH_FIX)
  })

  it('judges the longest line, so one lumpy line in a column of 70s counts', () => {
    const lines = [70, 71, 88, 70, 30]
    expect(lineLengthFindings(at([block({ lines })]), 'react-engineer')).toHaveLength(1)
  })

  it('reads a block that sets on one line as that line', () => {
    const [f] = lineLengthFindings(at([block({ lines: [97], boxPx: 750 })]), 'react-engineer')
    expect(f.detail).toContain('sets 97 characters on one line')
  })

  it('gives every block of one element chain one finding, at its worst, with a count', () => {
    const blocks = [
      block({ lines: [82, 50] }),
      block({ lines: [90, 70, 10], sample: 'the worst one' }),
      block({ lines: [85, 5] }),
    ]
    const found = lineLengthFindings(at(blocks), 'react-engineer')
    expect(found).toHaveLength(1)
    expect(found[0].rank).toBe(90)
    expect(found[0].detail).toContain('"the worst one" (x3)')
  })

  it('keeps chains apart', () => {
    const blocks = [block({ lines: [90, 5] }), block({ selector: 'main > li', lines: [95, 5] })]
    expect(lineLengthFindings(at(blocks), 'react-engineer')).toHaveLength(2)
  })

  it('is owned by a human, and not a revision, inside a part the orchestrator writes', () => {
    const [f] = lineLengthFindings(
      at([block({ lines: [120], part: 'SiteCallout' })]),
      'react-engineer'
    )
    expect(f.owner).toBe('human')
    expect(f.detail).toContain('SiteCallout is written by the orchestrator')
    expect(f.detail).not.toContain(LINE_LENGTH_FIX)
    expect(faultsForOwner([{ ...f, surface: '/about' }], 'react-engineer')).toEqual([])
  })

  it('says nothing about a measurement that took none, as the dark scheme and the phone rung do', () => {
    expect(lineLengthFindings({ route: '/', scheme: 'dark' }, 'react-engineer')).toEqual([])
    expect(lineLengthFindings(at([]), 'react-engineer')).toEqual([])
  })

  it('reaches the gate through evaluateMeasurement, on an engineer-owned route', () => {
    const m = {
      id: 'about',
      route: '/about',
      viewport: 'desktop',
      scheme: 'light',
      status: 200,
      scrollWidth: 1440,
      clientWidth: 1440,
      lineLength: { blocks: [block({ lines: [88, 60] })] },
    }
    expect(evaluateMeasurement(m).map((f) => f.kind)).toEqual(['line-length'])
    const authored = evaluateMeasurement({ ...m, route: '/experiments' })
    expect(authored[0].owner).toBe('human')
  })
})

describe('describeBlock', () => {
  it('names the element, the sample, the count, the size and the box', () => {
    const b = block({ lines: [90, 60] })
    const text = describeBlock(b, { longest: 90, median: 90 }, 4)
    expect(text).toBe(
      '<main > p.body> "Independent design and engineering" (x4) sets 90 characters on its ' +
        'longest line (2 lines, median 90) at 16px in a 568px box, over the 80 limit'
    )
  })
})

describe('collapseLineLength', () => {
  const finding = (over) => ({
    kind: 'line-length',
    severity: 'error',
    owner: 'react-engineer',
    surface: '/work/a',
    viewport: 'desktop',
    width: 1440,
    scheme: 'light',
    rank: 90,
    key: 'line-length|p.a',
    detail: 'one',
    ...over,
  })

  it('folds one chain seen at every rung and route into its worst, naming the places', () => {
    const folded = collapseLineLength([
      finding({ rank: 84, width: 820, viewport: 'tablet' }),
      finding({ rank: 90 }),
      finding({ rank: 88, surface: '/work/b' }),
    ])
    expect(folded).toHaveLength(1)
    expect(folded[0].rank).toBe(90)
    expect(folded[0].detail).toContain('Also on /work/a at 820px, /work/b at 1440px.')
  })

  it('names three other places and counts the rest', () => {
    const many = ['/work/a', '/work/b', '/work/c', '/work/d', '/work/e'].map((surface, i) =>
      finding({ surface, rank: 90 - i })
    )
    const [f] = collapseLineLength(many)
    expect(f.detail).toContain(
      'Also on /work/b at 1440px, /work/c at 1440px, /work/d at 1440px and 1 more.'
    )
  })

  it('keeps an engineer chain and a human one apart', () => {
    const folded = collapseLineLength([finding({}), finding({ owner: 'human' })])
    expect(folded.map((f) => f.owner).sort()).toEqual(['human', 'react-engineer'])
  })

  it('caps an owner at six, worst first, and counts the rest in one closing line', () => {
    const findings = Array.from({ length: 9 }, (_, i) =>
      finding({ key: `line-length|p.${i}`, rank: 81 + i })
    )
    const folded = collapseLineLength(findings)
    expect(folded).toHaveLength(MAX_LINE_LENGTH_REPORTED + 1)
    expect(folded[0].rank).toBe(89)
    const closing = folded.at(-1)
    expect(closing.detail).toContain('3 more distinct blocks')
    expect(closing.detail).toContain('the longest line among them is 83 characters')
    expect(closing.severity).toBe('error')
  })

  it('passes other findings through untouched, ahead of its own', () => {
    const other = { kind: 'overflow', severity: 'error', surface: '/', detail: 'x' }
    const folded = collapseLineLength([finding({}), other])
    expect(folded[0]).toBe(other)
  })
})
