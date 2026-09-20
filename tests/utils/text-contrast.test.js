import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../../scripts/utils/contrast.js'
import { evaluateMeasurement, faultsForOwner } from '../../scripts/utils/surface-gate.js'
import {
  MAX_TEXT_CONTRAST_REPORTED,
  MAX_UNRESOLVED_REPORTED,
  collapseTextContrast,
  compositeOver,
  flattenLayers,
  measureCandidate,
  textContrastFindings,
} from '../../scripts/utils/text-contrast.js'

const rgb = (r, g = r, b = r, a = 1) => ({ r, g, b, a })
const BLACK = rgb(0)
const WHITE = rgb(255)

describe('compositeOver', () => {
  it('is the top colour at alpha 1 and the base at alpha 0', () => {
    expect(compositeOver(rgb(10, 20, 30), WHITE)).toEqual({ r: 10, g: 20, b: 30 })
    expect(compositeOver(rgb(10, 20, 30, 0), rgb(1, 2, 3))).toEqual({ r: 1, g: 2, b: 3 })
  })

  it('blends per channel by alpha', () => {
    expect(compositeOver(rgb(255, 0, 0, 0.25), rgb(0, 0, 255))).toEqual({
      r: 63.75,
      g: 0,
      b: 191.25,
    })
  })

  it('treats a missing alpha as opaque', () => {
    expect(compositeOver({ r: 9, g: 9, b: 9 }, WHITE)).toEqual({ r: 9, g: 9, b: 9 })
  })
})

describe('flattenLayers', () => {
  const layer = (bg, opacity = 1) => ({ bg, opacity })

  it('puts text on the canvas when nothing paints', () => {
    const { fg, bg } = flattenLayers(BLACK, [layer(null)])
    expect(bg).toEqual({ r: 255, g: 255, b: 255 })
    expect(fg).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('stacks translucent grounds from the outside in', () => {
    // white 50% over black is 127.5; black 50% over that is 63.75
    const { bg } = flattenLayers(WHITE, [
      layer(rgb(0, 0, 0, 0.5)),
      layer(rgb(255, 255, 255, 0.5)),
      layer(BLACK),
    ])
    expect(bg.r).toBeCloseTo(63.75, 6)
  })

  it('lets an opaque ground hide everything behind it', () => {
    const { bg } = flattenLayers(BLACK, [layer(rgb(200, 100, 50)), layer(rgb(1, 2, 3))])
    expect(bg).toEqual({ r: 200, g: 100, b: 50 })
  })

  it('composites text alpha over the ground before opacity applies', () => {
    // text black at .5 over white = 127.5; the group at .5 over white = 191.25
    const { fg, bg } = flattenLayers(rgb(0, 0, 0, 0.5), [layer(WHITE, 0.5)])
    expect(fg.r).toBeCloseTo(191.25, 6)
    expect(bg.r).toBe(255)
  })

  it('dims text and ground together under an opacity group', () => {
    const { fg, bg } = flattenLayers(BLACK, [layer(null), layer(WHITE, 0.5)])
    expect(fg.r).toBeCloseTo(127.5, 6)
    expect(bg.r).toBe(255)
  })

  it('shows what is behind an opacity group through it', () => {
    const { fg, bg } = flattenLayers(BLACK, [layer(null), layer(WHITE, 0.5), layer(BLACK)])
    expect(bg.r).toBeCloseTo(127.5, 6)
    expect(fg.r).toBeCloseTo(0, 6)
  })

  it('multiplies nested opacity groups', () => {
    // black text under two groups at .5 over white: 255 * (1 - .25) = 191.25
    const { fg } = flattenLayers(BLACK, [layer(null, 0.5), layer(null, 0.5), layer(WHITE)])
    expect(fg.r).toBeCloseTo(191.25, 6)
  })

  it('takes a canvas other than white when told to', () => {
    expect(flattenLayers(WHITE, [layer(null)], BLACK).bg).toEqual({ r: 0, g: 0, b: 0 })
  })
})

describe('measureCandidate', () => {
  const candidate = (over = {}) => ({
    selector: 'p.kicker',
    text: 'Featured work',
    sizePx: 12.64,
    weight: 400,
    fg: rgb(0x77),
    layers: [{ bg: WHITE, opacity: 1 }],
    unresolved: null,
    part: null,
    count: 1,
    ...over,
  })

  it('uses the WCAG ratio from contrast.js', () => {
    const m = measureCandidate(candidate())
    expect(m.ratio).toBeCloseTo(contrastRatio(rgb(0x77), WHITE), 6)
  })

  it('returns nothing for an unresolved candidate rather than guessing a ratio', () => {
    expect(measureCandidate(candidate({ unresolved: 'div.a (background-image)' }))).toBeNull()
  })
})

describe('textContrastFindings', () => {
  const candidate = (grey, over = {}) => ({
    selector: 'p.kicker',
    text: 'Featured work',
    sizePx: 12.64,
    weight: 400,
    fg: rgb(grey),
    layers: [{ bg: WHITE, opacity: 1 }],
    unresolved: null,
    part: null,
    count: 1,
    ...over,
  })
  const find = (candidates, owner = 'react-engineer') =>
    textContrastFindings({ textContrast: { candidates } }, owner)

  it('errors under 3:1, and names the element, text, size and both colours', () => {
    const [f] = find([candidate(0xbb)])
    expect(f).toMatchObject({ kind: 'contrast', severity: 'error', owner: 'react-engineer' })
    expect(f.detail).toContain('p.kicker')
    expect(f.detail).toContain('Featured work')
    expect(f.detail).toContain('12.64px')
    expect(f.detail).toContain('#bbbbbb on #ffffff')
    expect(f.detail).toContain('under 3:1')
  })

  it('warns from 3:1 up to 4.5:1', () => {
    const [f] = find([candidate(0x8a)])
    expect(contrastRatio(rgb(0x8a), WHITE)).toBeGreaterThan(3)
    expect(f.severity).toBe('warning')
    expect(f.detail).toContain('under 4.5:1')
  })

  it('passes 4.5:1 and over, and 4.478 is not shown as 4.48', () => {
    expect(find([candidate(0x76)])).toEqual([]) // #767676 is 4.54:1
    const [f] = find([candidate(0x77)]) // #777 is 4.478:1, which rounds to 4.48
    expect(f.detail).toContain('4.47:1')
  })

  it('reports an unresolved ground as a warning with no ratio, naming the ancestor', () => {
    const [f] = find([candidate(0, { unresolved: 'section.ruled (background-image)' })])
    expect(f).toMatchObject({ kind: 'contrast-unresolved', severity: 'warning' })
    expect(f.ratio).toBeUndefined()
    expect(f.detail).toContain('section.ruled (background-image)')
    expect(f.detail).toContain('not measured')
  })

  it('states a repeat count, and keeps one finding per element chain and colour pair', () => {
    const found = find([candidate(0xbb, { count: 4 }), candidate(0xbb, { text: 'Other' })])
    expect(found).toHaveLength(1)
    expect(found[0].detail).toContain('(x4)')
    expect(find([candidate(0xbb), candidate(0xaa)])).toHaveLength(2)
    expect(find([candidate(0xbb), candidate(0xbb, { selector: 'p.other' })])).toHaveLength(2)
  })

  it('owns an orchestrator part by the human, whatever the route, and says so', () => {
    const [f] = find([candidate(0xbb, { part: 'SiteCallout' })])
    expect(f.owner).toBe('human')
    expect(f.severity).toBe('error')
    expect(f.detail).toContain('SiteCallout is written by the orchestrator')
    expect(f.detail).not.toContain('Set it in a token')
  })

  it('says nothing when the measurement carries no text block', () => {
    expect(textContrastFindings({}, 'react-engineer')).toEqual([])
  })
})

describe('text contrast in evaluateMeasurement', () => {
  const page = {
    id: 'home',
    route: '/',
    viewport: 'desktop',
    scheme: 'light',
    status: 200,
    scrollWidth: 1440,
    clientWidth: 1440,
    allowsXOverflow: false,
    consoleErrors: [],
  }
  const c = {
    selector: 'p.kicker',
    text: 'Specimen',
    sizePx: 12.64,
    weight: 400,
    fg: rgb(0xbb),
    layers: [{ bg: WHITE, opacity: 1 }],
    unresolved: null,
    part: null,
    count: 1,
  }

  it('forces an engineer revision for an engineer-owned route', () => {
    const findings = evaluateMeasurement({ ...page, textContrast: { candidates: [c] } })
    expect(faultsForOwner(findings, 'react-engineer')).toHaveLength(1)
  })

  it('leaves a route no agent owns to the human', () => {
    const findings = evaluateMeasurement({
      ...page,
      route: '/experiments',
      textContrast: { candidates: [c] },
    })
    expect(faultsForOwner(findings, 'react-engineer')).toEqual([])
    expect(faultsForOwner(findings, 'human')).toHaveLength(1)
  })

  it('never forces an engineer revision for the orchestrator’s parts', () => {
    const findings = evaluateMeasurement({
      ...page,
      textContrast: { candidates: [{ ...c, part: 'BrandLockup' }] },
    })
    expect(findings).toHaveLength(1)
    expect(faultsForOwner(findings, 'react-engineer')).toEqual([])
    expect(faultsForOwner(findings, 'human')).toHaveLength(1)
  })
})

describe('collapseTextContrast', () => {
  const finding = (over = {}) => ({
    kind: 'contrast',
    severity: 'error',
    owner: 'react-engineer',
    surface: '/',
    viewport: 'desktop',
    width: 1440,
    scheme: 'light',
    ratio: 2.5,
    key: 'contrast|p.kicker|#bbbbbb|#ffffff',
    detail: 'p.kicker is low.',
    ...over,
  })

  it('folds the same element and colours across routes, keeping the worst reading', () => {
    const out = collapseTextContrast([
      finding({ surface: '/', ratio: 2.8 }),
      finding({ surface: '/about', ratio: 2.1 }),
      finding({ surface: '/work/spaceman', ratio: 2.5 }),
    ])
    expect(out).toHaveLength(1)
    expect(out[0].surface).toBe('/about')
    expect(out[0].detail).toContain('Also on /, /work/spaceman.')
  })

  it('keeps different owners apart', () => {
    const out = collapseTextContrast([finding(), finding({ owner: 'human' })])
    expect(out.map((f) => f.owner).sort()).toEqual(['human', 'react-engineer'])
  })

  it('passes other kinds through untouched, ahead of the contrast findings', () => {
    const overflow = { kind: 'overflow', severity: 'error', surface: '/', detail: 'wide' }
    const out = collapseTextContrast([finding(), overflow])
    expect(out[0]).toBe(overflow)
    expect(out).toHaveLength(2)
  })

  it('caps a bad night: the worst few, errors first, and one line counting the rest', () => {
    const many = Array.from({ length: MAX_TEXT_CONTRAST_REPORTED + 5 }, (_, i) =>
      finding({ key: `k${i}`, ratio: 1 + i * 0.1 })
    )
    const out = collapseTextContrast(many)
    expect(out).toHaveLength(MAX_TEXT_CONTRAST_REPORTED + 1)
    expect(out.slice(0, MAX_TEXT_CONTRAST_REPORTED).map((f) => f.ratio)).toEqual(
      [...many]
        .map((f) => f.ratio)
        .sort((a, b) => a - b)
        .slice(0, MAX_TEXT_CONTRAST_REPORTED)
    )
    const summary = out.at(-1)
    expect(summary.severity).toBe('warning')
    expect(summary.detail).toContain('5 more distinct low-contrast pairs are not listed')
    expect(summary.detail).toContain('worst is 1.60:1')
  })

  it('lists errors ahead of warnings when it has to cut', () => {
    const many = [
      ...Array.from({ length: MAX_TEXT_CONTRAST_REPORTED }, (_, i) =>
        finding({ key: `w${i}`, severity: 'warning', ratio: 4 })
      ),
      finding({ key: 'e', ratio: 2.9 }),
    ]
    const out = collapseTextContrast(many)
    expect(out[0].key).toBe('e')
  })

  it('caps unresolved findings separately and counts the rest', () => {
    const many = Array.from({ length: MAX_UNRESOLVED_REPORTED + 2 }, (_, i) => ({
      kind: 'contrast-unresolved',
      severity: 'warning',
      owner: 'react-engineer',
      surface: '/',
      key: `u${i}`,
      detail: `text ${i}`,
    }))
    const out = collapseTextContrast(many)
    expect(out).toHaveLength(MAX_UNRESOLVED_REPORTED + 1)
    expect(out.at(-1).detail).toContain('2 more distinct texts over a textured ground')
  })
})
