/**
 * The type-size floors (#567), with the page walk's records fed in by hand.
 * small-text-dom.test.js proves the other half: that a browser hands back
 * these records for the pages that shipped them.
 */
import { describe, expect, it } from 'vitest'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import {
  SMALL_COPY_FLOOR_PX,
  SMALL_TEXT_FLOOR_PX,
} from '../../scripts/utils/responsive-thresholds.js'
import {
  MAX_SMALL_TEXT_REPORTED,
  SMALL_TEXT_OPTIONS,
  collapseSmallText,
  smallTextFindings,
} from '../../scripts/utils/small-text.js'
import {
  evaluateMeasurement,
  faultsForOwner,
  formatFindingsForCritic,
} from '../../scripts/utils/surface-gate.js'
import { collapseTextContrast } from '../../scripts/utils/text-contrast.js'

/** A page-walk record; override what the case is about. */
const entry = (over = {}) => ({
  selector: 'main > p.lede',
  tag: 'p',
  sizePx: 15,
  sample: 'Design systems, mostly.',
  running: true,
  visibleText: false,
  part: null,
  count: 1,
  ...over,
})

const measurement = (viewport, entries, route = '/') => ({
  id: 'home',
  route,
  viewport,
  scheme: 'light',
  status: 200,
  scrollWidth: 1,
  clientWidth: 1,
  consoleErrors: [],
  textContrast: { candidates: [], texts: 0, large: 0, smallText: { entries } },
})

const mobile = (entries, route) => measurement('mobile', entries, route)
const desktop = (entries, route) => measurement('desktop', entries, route)

/** Just under, and at, a floor. */
const under = (floor) => Math.round((floor - 0.1) * 100) / 100

describe('the floors', () => {
  it('are 14 for running copy and 12 for any text, today', () => {
    // Numbers, not references, so that moving one is a decision somebody sees.
    expect(SMALL_COPY_FLOOR_PX).toBe(14)
    expect(SMALL_TEXT_FLOOR_PX).toBe(12)
  })

  it('reach the page walk, so it collects what the rules will read', () => {
    expect(SMALL_TEXT_OPTIONS.scanBelowPx).toBe(Math.max(SMALL_COPY_FLOOR_PX, SMALL_TEXT_FLOOR_PX))
    expect(SMALL_TEXT_OPTIONS.textMinPx).toBe(SMALL_TEXT_FLOOR_PX)
  })

  // The gate must not reject the design system's own tokens: every chassis
  // sets `2xs` at 0.75rem and `sm` at 0.909rem since #564, and a night that
  // follows the engineer prompt uses both.
  const REM = 16
  const stepPx = (chassis, step) => Number.parseFloat(chassis.type.steps[step].size) * REM

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))('sit at or under the ramp: %s', (_id, chassis) => {
    expect(stepPx(chassis, '2xs')).toBeGreaterThanOrEqual(SMALL_TEXT_FLOOR_PX)
    expect(stepPx(chassis, 'sm')).toBeGreaterThanOrEqual(SMALL_COPY_FLOOR_PX)
  })
})

describe.each(['mobile', 'desktop'])(
  'small-copy at the %s rung: running copy under the floor',
  (rung) => {
    const at = (entries, route) => measurement(rung, entries, route)

    it.each(['p', 'li', 'blockquote'])('is an error for a <%s> just under the floor', (tag) => {
      const [f, ...rest] = smallTextFindings(
        at([entry({ tag, selector: `main > ${tag}`, sizePx: under(SMALL_COPY_FLOOR_PX) })]),
        'react-engineer'
      )
      expect(rest).toEqual([])
      expect(f).toMatchObject({ kind: 'small-copy', severity: 'error', owner: 'react-engineer' })
    })

    it('is quiet at exactly the floor', () => {
      expect(
        smallTextFindings(at([entry({ sizePx: SMALL_COPY_FLOOR_PX })]), 'react-engineer')
      ).toEqual([])
    })

    it('names the selector, the size and the floor', () => {
      const [f] = smallTextFindings(at([entry({ sizePx: 12.64 })]), 'react-engineer')
      expect(f.detail).toContain('main > p.lede')
      expect(f.detail).toContain('12.64px')
      expect(f.detail).toContain(`${SMALL_COPY_FLOOR_PX}px floor`)
      expect(f.detail).toContain('Design systems, mostly.')
    })

    it('notes how many elements share the chain', () => {
      const [f] = smallTextFindings(at([entry({ sizePx: 12, count: 4 })]), 'react-engineer')
      expect(f.detail).toContain('(x4)')
    })

    it('is one finding, not two, for running copy that is also under the text floor', () => {
      const findings = smallTextFindings(
        at([entry({ sizePx: under(SMALL_TEXT_FLOOR_PX), visibleText: true })]),
        'react-engineer'
      )
      expect(findings.map((f) => f.kind)).toEqual(['small-copy'])
    })
  }
)

describe.each(['mobile', 'desktop'])(
  'small-text at the %s rung: any visible text under the floor',
  (rung) => {
    const label = (over = {}) =>
      entry({
        selector: 'header > span.kicker',
        tag: 'span',
        sizePx: 10.5,
        sample: 'Specimen',
        running: false,
        visibleText: true,
        ...over,
      })

    it('is an error just under the floor', () => {
      const sizePx = under(SMALL_TEXT_FLOOR_PX)
      const [f, ...rest] = smallTextFindings(
        measurement(rung, [label({ sizePx })]),
        'react-engineer'
      )
      expect(rest).toEqual([])
      expect(f).toMatchObject({ kind: 'small-text', severity: 'error', owner: 'react-engineer' })
      expect(f.detail).toContain('header > span.kicker')
      expect(f.detail).toContain(`${sizePx}px`)
      expect(f.detail).toContain(`${SMALL_TEXT_FLOOR_PX}px floor`)
    })

    it('is quiet at exactly the floor', () => {
      const entries = [label({ sizePx: SMALL_TEXT_FLOOR_PX })]
      expect(smallTextFindings(measurement(rung, entries), 'react-engineer')).toEqual([])
    })

    it.each(['span', 'div', 'dt', 'small', 'h3', 'a', 'button', 'label'])(
      'does not exempt a <%s> by tag',
      (tag) => {
        const findings = smallTextFindings(
          measurement(rung, [label({ tag, selector: `main > ${tag}` })]),
          'react-engineer'
        )
        expect(findings.map((f) => f.kind)).toEqual(['small-text'])
      }
    )

    it('ignores a record that carries no visible text and is not running copy', () => {
      const bare = label({ visibleText: false })
      expect(smallTextFindings(measurement(rung, [bare]), 'react-engineer')).toEqual([])
    })

    it('says nothing about a page whose walk found nothing, or was never taken', () => {
      expect(smallTextFindings(measurement(rung, []), 'react-engineer')).toEqual([])
      expect(smallTextFindings({ viewport: rung }, 'react-engineer')).toEqual([])
      expect(smallTextFindings({ viewport: rung, textContrast: {} }, 'react-engineer')).toEqual([])
    })
  }
)

describe('who owns a small-text finding', () => {
  it('routes a route no agent owns to the human', () => {
    const [f] = smallTextFindings(mobile([entry({ sizePx: 12 })], '/experiments'), 'human')
    expect(f.owner).toBe('human')
  })

  it('routes text inside an orchestrator part to the human, on an engineer route', () => {
    const parts = ['BrandLockup', 'SiteCallout', 'WhitePaper', 'Material', 'the archive link']
    for (const part of parts) {
      const findings = smallTextFindings(
        desktop([
          entry({ tag: 'span', sizePx: 10, running: false, visibleText: true, part }),
          entry({ selector: 'main > p.note', sizePx: 13, part }),
        ]),
        'react-engineer'
      )
      expect(findings.map((f) => f.owner)).toEqual(['human', 'human'])
      expect(findings[0].detail).toContain('written by the orchestrator')
      expect(findings[0].detail).not.toContain('Set it at')
    }
  })

  it('reaches faultsForOwner by owner, so a part never forces an engineer revision', () => {
    const findings = evaluateMeasurement(
      desktop([
        entry({ tag: 'span', sizePx: 10, running: false, visibleText: true, part: 'SiteCallout' }),
        entry({
          selector: 'main > p.mine',
          tag: 'span',
          sizePx: 10,
          running: false,
          visibleText: true,
        }),
      ])
    ).map((f) => ({ ...f, surface: '/' }))
    expect(faultsForOwner(findings, 'human')).toHaveLength(1)
    const mine = faultsForOwner(findings, 'react-engineer')
    expect(mine).toHaveLength(1)
    expect(mine[0].detail).toContain('main > p.mine')
  })

  it('is part of evaluateMeasurement, so an error on `/` forces a revision', () => {
    const findings = evaluateMeasurement(mobile([entry({ sizePx: 12 })])).map((f) => ({
      ...f,
      surface: '/',
    }))
    expect(faultsForOwner(findings, 'react-engineer').map((f) => f.kind)).toEqual(['small-copy'])
  })
})

describe('collapseSmallText', () => {
  const run = (findings) => findings.map((f, i) => ({ surface: `/r${i}`, width: 360, ...f }))
  const copyAt = (i, sizePx = 12) =>
    smallTextFindings(mobile([entry({ selector: `main > p.n${i}`, sizePx })]), 'react-engineer')[0]

  it('folds the same element and size across routes and schemes into one finding', () => {
    const one = copyAt(0)
    const folded = collapseSmallText([
      { surface: '/', width: 360, scheme: 'light', ...one },
      { surface: '/', width: 360, scheme: 'dark', ...one },
      { surface: '/about', width: 360, scheme: 'light', ...one },
    ])
    expect(folded).toHaveLength(1)
    expect(folded[0].detail).toContain('Also on /about.')
  })

  it('keeps two sizes of one element apart', () => {
    const folded = collapseSmallText(run([copyAt(0, 12), copyAt(0, 13)]))
    expect(folded).toHaveLength(2)
  })

  it('caps each owner and kind, smallest first, with one closing line for the rest', () => {
    const total = MAX_SMALL_TEXT_REPORTED + 3
    // Listed largest first, so the cap has to reorder to keep the smallest.
    const findings = run(Array.from({ length: total }, (_, i) => copyAt(i, 13 - i * 0.5)))
    const folded = collapseSmallText(findings)
    expect(folded).toHaveLength(MAX_SMALL_TEXT_REPORTED + 1)
    expect(folded.slice(0, MAX_SMALL_TEXT_REPORTED).map((f) => f.sizePx)).toEqual(
      Array.from({ length: MAX_SMALL_TEXT_REPORTED }, (_, i) => 13 - (total - 1 - i) * 0.5)
    )
    const closing = folded[MAX_SMALL_TEXT_REPORTED]
    expect(closing.detail).toContain('3 more distinct running copy under its floor')
    // An error, so the count reaches the repair brief with the rest.
    expect(closing.severity).toBe('error')
  })

  it('caps owners separately', () => {
    const mine = Array.from({ length: MAX_SMALL_TEXT_REPORTED }, (_, i) => copyAt(i))
    const theirs = smallTextFindings(
      mobile(
        Array.from({ length: MAX_SMALL_TEXT_REPORTED }, (_, i) =>
          entry({ selector: `main > p.x${i}`, sizePx: 12, part: 'SiteCallout' })
        )
      ),
      'react-engineer'
    )
    const folded = collapseSmallText(run([...mine, ...theirs]))
    expect(folded).toHaveLength(MAX_SMALL_TEXT_REPORTED * 2)
    expect(folded.filter((f) => f.owner === 'human')).toHaveLength(MAX_SMALL_TEXT_REPORTED)
  })

  it('caps the two kinds separately', () => {
    const texts = smallTextFindings(
      desktop(
        Array.from({ length: MAX_SMALL_TEXT_REPORTED }, (_, i) =>
          entry({
            selector: `span.t${i}`,
            tag: 'span',
            sizePx: 10,
            running: false,
            visibleText: true,
          })
        )
      ),
      'react-engineer'
    )
    const copies = Array.from({ length: MAX_SMALL_TEXT_REPORTED }, (_, i) => copyAt(i))
    expect(collapseSmallText(run([...texts, ...copies]))).toHaveLength(MAX_SMALL_TEXT_REPORTED * 2)
  })

  it('passes every other finding through, and composes with the contrast fold', () => {
    const overflow = { surface: '/', kind: 'overflow', severity: 'error', detail: 'wide' }
    const out = collapseSmallText(collapseTextContrast([overflow, ...run([copyAt(0)])]))
    expect(out[0]).toBe(overflow)
    expect(out).toHaveLength(2)
  })

  it('reaches the critic and repair brief as one line per fault', () => {
    const folded = collapseSmallText(
      run([copyAt(0)]).map((f) => ({ ...f, viewport: 'mobile', scheme: 'light' }))
    )
    const text = formatFindingsForCritic(folded)
    expect(text).toContain('[error]')
    expect(text).toContain('main > p.n0')
  })
})
