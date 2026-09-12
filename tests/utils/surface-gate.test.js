import { describe, it, expect } from 'vitest'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  evaluateMeasurement,
  formatFindingsForCritic,
  formatAdvisoryForRepairBrief,
  listGeneratedRoutes,
  ownerForSurface,
  faultsForOwner,
  advisoryFaultsForOwner,
  OVERFLOW_TOLERANCE_PX,
  MAX_CLIPPED_REPORTED,
  MAX_TAP_TARGET_REPORTED,
  VIEWPORT_RUNGS,
  RUNNING_COPY_MAX_PX,
  RUNNING_COPY_MIN_CHARS,
  BRAND_MARK_MIN_PX,
  BRAND_CONTRAST_MIN,
} from '../../scripts/utils/surface-gate.js'

const ok = {
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

describe('evaluateMeasurement', () => {
  it('passes a page that fits', () => {
    expect(evaluateMeasurement(ok)).toEqual([])
  })

  it('flags a document wider than its viewport', () => {
    const findings = evaluateMeasurement({ ...ok, scrollWidth: 2097 })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('overflow')
    expect(findings[0].severity).toBe('error')
    // The number a human acts on is how far past the edge it went.
    expect(findings[0].detail).toContain('657px')
  })

  it('ignores sub-pixel overflow from fractional layout', () => {
    expect(evaluateMeasurement({ ...ok, scrollWidth: 1440 + OVERFLOW_TOLERANCE_PX })).toEqual([])
  })

  it('downgrades overflow the page has declared deliberate', () => {
    const findings = evaluateMeasurement({ ...ok, scrollWidth: 2000, allowsXOverflow: true })
    expect(findings[0].kind).toBe('overflow')
    expect(findings[0].severity).toBe('warning')
  })

  it('flags a non-200 route', () => {
    const findings = evaluateMeasurement({ ...ok, status: 404 })
    expect(findings.map((f) => f.kind)).toContain('status')
    expect(findings.find((f) => f.kind === 'status').severity).toBe('error')
  })

  it('reports an unreachable route once and stops', () => {
    const findings = evaluateMeasurement({ ...ok, error: 'net::ERR_CONNECTION_REFUSED' })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('unreachable')
  })

  it('treats console errors as advisory, not disqualifying', () => {
    const findings = evaluateMeasurement({ ...ok, consoleErrors: ['boom'] })
    expect(findings[0].kind).toBe('console')
    expect(findings[0].severity).toBe('warning')
  })

  it('makes a clipped text element an error, with the numbers and the words', () => {
    const findings = evaluateMeasurement({
      ...ok,
      clientWidth: 360,
      scrollWidth: 360,
      clipped: [{ tag: 'DIV', text: 'Daylight06:46', right: 392, over: 32 }],
    })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('clipped')
    expect(findings[0].severity).toBe('error')
    expect(findings[0].detail).toContain('392px')
    expect(findings[0].detail).toContain('32px past the 360px viewport')
    expect(findings[0].detail).toContain('Daylight06:46')
  })

  it('makes a clipped element carrying no text a warning that cannot fail a build', () => {
    const findings = evaluateMeasurement({
      ...ok,
      clientWidth: 360,
      scrollWidth: 360,
      clipped: [{ tag: 'IMG', text: '', right: 420, over: 60 }],
    })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('clipped')
    expect(findings[0].severity).toBe('warning')
    expect(findings[0].detail).toContain('data-allow-x-overflow')
    // A warning is not an engineer fault, so it cannot force a revision.
    expect(faultsForOwner([{ ...findings[0], surface: '/' }], 'react-engineer')).toEqual([])
  })

  it('reports clipping even when the document itself does not scroll', () => {
    // 2026-09-04: a parent carried overflow: hidden, so scrollWidth never
    // exceeded clientWidth and the only fault the gate could name was one it
    // did not have.
    const kinds = evaluateMeasurement({
      ...ok,
      clientWidth: 360,
      scrollWidth: 360,
      clipped: [{ tag: 'H1', text: 'Spacem', right: 500, over: 140 }],
    }).map((f) => f.kind)
    expect(kinds).toEqual(['clipped'])
  })

  it('tells the engineer a word wider than its box is a type fault, not a layout fault', () => {
    // #465: the box fit the column; the word did not. Pointing at the layout
    // width sends the repair the wrong way.
    const findings = evaluateMeasurement({
      ...ok,
      clientWidth: 360,
      scrollWidth: 360,
      clipped: [
        { tag: 'P', text: 'Shutout.', cause: 'text', right: 288, over: 1082, boxWidth: 216 },
      ],
    })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('clipped')
    expect(findings[0].severity).toBe('error')
    expect(findings[0].detail).toContain('wider than its own box')
    expect(findings[0].detail).toContain('Shutout.')
    expect(findings[0].detail).toContain('needs 1298px')
    expect(findings[0].detail).toContain('box is 216px')
    expect(findings[0].detail).toContain('1082px of it is cut off')
    expect(findings[0].detail).not.toContain('past the 360px viewport')
  })

  it('stops after a few clipped elements rather than filling the prompt', () => {
    const clipped = Array.from({ length: 14 }, (_, i) => ({
      tag: 'DIV',
      text: `block ${i}`,
      right: 400 + i,
      over: 40 + i,
    }))
    const findings = evaluateMeasurement({ ...ok, clientWidth: 360, scrollWidth: 360, clipped })
    expect(findings).toHaveLength(MAX_CLIPPED_REPORTED)
  })

  it('says nothing when nothing is clipped', () => {
    expect(evaluateMeasurement({ ...ok, clipped: [] })).toEqual([])
  })

  it('reports overflow and status together when both are wrong', () => {
    const kinds = evaluateMeasurement({ ...ok, status: 500, scrollWidth: 1600 }).map((f) => f.kind)
    expect(kinds).toEqual(['status', 'overflow'])
  })
})

describe('formatFindingsForCritic', () => {
  const overflow = (over) => ({
    surface: '/experiments',
    viewport: 'desktop',
    width: 1440,
    kind: 'overflow',
    severity: 'error',
    detail: `document is ${over}px wider than the 1440px viewport`,
  })

  it('says nothing when nothing is wrong', () => {
    expect(formatFindingsForCritic([])).toBe('')
    expect(formatFindingsForCritic(undefined)).toBe('')
  })

  it('collapses the same fault seen in both schemes into one line', () => {
    const out = formatFindingsForCritic([
      { ...overflow(657), scheme: 'light' },
      { ...overflow(657), scheme: 'dark' },
    ])
    const bullets = out.split('\n').filter((l) => l.startsWith('- '))
    expect(bullets).toHaveLength(1)
    expect(bullets[0]).toContain('both schemes')
  })

  it('keeps distinct viewports separate', () => {
    const out = formatFindingsForCritic([
      { ...overflow(657), scheme: 'light' },
      { ...overflow(84), viewport: 'mobile', width: 360, scheme: 'light' },
    ])
    expect(out.split('\n').filter((l) => l.startsWith('- '))).toHaveLength(2)
  })

  it('puts errors above warnings', () => {
    const out = formatFindingsForCritic([
      { ...overflow(657), severity: 'warning', scheme: 'light', detail: 'advisory' },
      { ...overflow(657), scheme: 'light' },
    ])
    const bullets = out.split('\n').filter((l) => l.startsWith('- '))
    expect(bullets[0]).toContain('[error]')
    expect(bullets[1]).toContain('[warning]')
  })

  it('tells the critic the measurements are not up for debate', () => {
    const out = formatFindingsForCritic([{ ...overflow(657), scheme: 'light' }])
    expect(out).toContain('Do not re-litigate')
  })
})

describe('listGeneratedRoutes', () => {
  it('expands a work route per project slug', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'surface-gate-'))
    await mkdir(path.join(root, 'app/content'), { recursive: true })
    await writeFile(
      path.join(root, 'app/content/projects.ts'),
      `export const projects = [{ slug: 'alpha' }, { slug: 'beta' }]`,
      'utf8'
    )
    const routes = await listGeneratedRoutes(root)
    const paths = routes.map((r) => r.route)
    expect(paths).toContain('/work/alpha')
    expect(paths).toContain('/work/beta')
    // The four fixed surfaces plus one per slug.
    expect(routes).toHaveLength(6)
  })
})

describe('ownerForSurface', () => {
  it('routes the nightly surfaces to the engineer', () => {
    expect(ownerForSurface('/')).toBe('react-engineer')
    expect(ownerForSurface('/about')).toBe('react-engineer')
    expect(ownerForSurface('/work/spaceman')).toBe('react-engineer')
  })

  it('does not hand authored routes to an agent that cannot edit them', () => {
    // /experiments and /work are authored route files outside MUTABLE_FILES.
    // The old fallback sent these to react-engineer regardless.
    expect(ownerForSurface('/experiments')).toBe('human')
    expect(ownerForSurface('/work')).toBe('human')
  })
})

describe('faultsForOwner', () => {
  // #306: the gate measured and pushed a verdict nobody read. This is the
  // predicate the orchestrator now forces a revision on.
  const finding = (surface, severity) => ({
    surface,
    viewport: 'desktop',
    width: 1440,
    scheme: 'light',
    kind: 'overflow',
    severity,
    detail: 'x',
  })

  it('keeps only error-severity findings on surfaces the owner can edit', () => {
    const findings = [
      finding('/', 'error'),
      finding('/about', 'warning'),
      finding('/work/spaceman', 'error'),
      finding('/experiments', 'error'),
    ]
    expect(faultsForOwner(findings, 'react-engineer').map((f) => f.surface)).toEqual([
      '/',
      '/work/spaceman',
    ])
    expect(faultsForOwner(findings, 'human').map((f) => f.surface)).toEqual(['/experiments'])
  })

  it('is empty for no findings', () => {
    expect(faultsForOwner([], 'react-engineer')).toEqual([])
    expect(faultsForOwner(undefined, 'react-engineer')).toEqual([])
  })
})

describe('VIEWPORT_RUNGS', () => {
  it('stays on the archiver ladder, and off the 1280 the critic used to capture at', () => {
    expect(VIEWPORT_RUNGS.map((v) => v.width)).toEqual([360, 1440])
  })
})

describe('running copy set at display size', () => {
  // 2026-09-01's /about set a 340-character paragraph at 110px. It filled
  // several screens. Every other running-copy block on that same build
  // measured 14-16px, so the boundary is not delicate — but it does have to
  // leave a hero phrase and a pull quote alone, because both are legitimate.
  const base = {
    id: 'about',
    route: '/about',
    viewport: 'desktop',
    scheme: 'light',
    status: 200,
    scrollWidth: 1440,
    clientWidth: 1440,
    allowsXOverflow: false,
    consoleErrors: [],
  }
  const copyFindings = (worstCopy) =>
    evaluateMeasurement({ ...base, worstCopy }).filter((f) => f.kind === 'running-copy')

  it('flags the paragraph that shipped', () => {
    const found = copyFindings({ chars: 340, fontSizePx: 110, sample: 'I work at the' })
    expect(found).toHaveLength(1)
    expect(found[0].severity).toBe('error')
    expect(found[0].detail).toContain('340 characters')
    expect(found[0].detail).toContain('110px')
  })

  it('leaves a hero phrase alone however large', () => {
    // Short and enormous is the whole point of the homepage.
    expect(copyFindings({ chars: 20, fontSizePx: 200, sample: '97.7, still summer.' })).toEqual([])
  })

  it('leaves real body copy alone however long', () => {
    expect(copyFindings({ chars: 440, fontSizePx: 16, sample: 'Spaceman is the LLC' })).toEqual([])
  })

  it('leaves a large pull quote at the boundary alone', () => {
    // Long and large is a judgement call until it is clearly neither.
    expect(
      copyFindings({ chars: RUNNING_COPY_MIN_CHARS, fontSizePx: RUNNING_COPY_MAX_PX, sample: 'q' })
    ).toEqual([])
  })

  it('needs both length and size, not either', () => {
    expect(
      copyFindings({ chars: RUNNING_COPY_MIN_CHARS - 1, fontSizePx: 110, sample: 'x' })
    ).toEqual([])
    expect(copyFindings({ chars: 400, fontSizePx: RUNNING_COPY_MAX_PX, sample: 'x' })).toEqual([])
  })

  it('reports nothing when the page had no block long enough to measure', () => {
    expect(copyFindings(null)).toEqual([])
    expect(evaluateMeasurement(base).filter((f) => f.kind === 'running-copy')).toEqual([])
  })
})

describe('tap-target and small-copy findings (#488)', () => {
  // From the 2026-09-07 nightly: 12 tap-target failures on the small-caps nav
  // and running copy at 12.6px, both measured by responsive-scorer.js and
  // read by nothing until this gate carried them.
  const mobile = { ...ok, viewport: 'mobile', width: 360, clientWidth: 360, scrollWidth: 360 }

  it('reports a tap target under 44x44, once per distinct text, with a count', () => {
    const findings = evaluateMeasurement({
      ...mobile,
      tapTargets: [{ text: 'work', count: 3, w: 34, h: 22 }],
    })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('tap-target')
    expect(findings[0].severity).toBe('warning')
    expect(findings[0].detail).toContain("'work'")
    expect(findings[0].detail).toContain('×3')
    expect(findings[0].detail).toContain('34x22px')
    expect(findings[0].detail).toContain('44x44')
  })

  it('says nothing for a target that already clears 44x44', () => {
    // The detector itself would never emit this (it only reports failures),
    // but evaluateMeasurement is not the place that decides that — this
    // proves an empty list, not a threshold, is what keeps it quiet.
    expect(evaluateMeasurement({ ...mobile, tapTargets: [] }).map((f) => f.kind)).not.toContain(
      'tap-target'
    )
  })

  it('caps reported tap-target findings', () => {
    const tapTargets = Array.from({ length: MAX_TAP_TARGET_REPORTED + 4 }, (_, i) => ({
      text: `link ${i}`,
      count: 1,
      w: 20,
      h: 20,
    }))
    const findings = evaluateMeasurement({ ...mobile, tapTargets })
    expect(findings.filter((f) => f.kind === 'tap-target')).toHaveLength(MAX_TAP_TARGET_REPORTED)
  })

  it('reports the worst running-copy block under the reading floor', () => {
    const findings = evaluateMeasurement({
      ...mobile,
      smallCopy: { tag: 'P', fontSizePx: 12.6, sample: 'Design systems, mostly' },
    })
    expect(findings).toHaveLength(1)
    expect(findings[0].kind).toBe('small-copy')
    expect(findings[0].severity).toBe('warning')
    expect(findings[0].detail).toContain('<P>')
    expect(findings[0].detail).toContain('12.6px')
    expect(findings[0].detail).toContain('Design systems, mostly')
  })

  it('says nothing when there is no small-copy block', () => {
    expect(evaluateMeasurement({ ...mobile, smallCopy: null }).map((f) => f.kind)).not.toContain(
      'small-copy'
    )
  })

  it('only fires at the 360 (mobile) rung, never at desktop', () => {
    const desktop = {
      ...ok,
      viewport: 'desktop',
      tapTargets: [{ text: 'work', count: 1, w: 34, h: 22 }],
      smallCopy: { tag: 'P', fontSizePx: 12, sample: 'x' },
    }
    expect(evaluateMeasurement(desktop)).toEqual([])
  })

  it('never forces a revision: faultsForOwner ignores both kinds', () => {
    const findings = [
      { ...mobile, surface: '/', kind: 'tap-target', severity: 'warning', detail: 'x' },
      { ...mobile, surface: '/', kind: 'small-copy', severity: 'warning', detail: 'x' },
    ]
    expect(faultsForOwner(findings, 'react-engineer')).toEqual([])
  })
})

describe('advisoryFaultsForOwner', () => {
  const finding = (surface, kind, severity = 'warning') => ({
    surface,
    viewport: 'mobile',
    width: 360,
    scheme: 'light',
    kind,
    severity,
    detail: 'x',
  })

  it('keeps only tap-target/small-copy findings on the owner’s surfaces', () => {
    const findings = [
      finding('/', 'tap-target'),
      finding('/', 'small-copy'),
      finding('/', 'overflow', 'error'),
      finding('/experiments', 'tap-target'),
    ]
    expect(advisoryFaultsForOwner(findings, 'react-engineer').map((f) => f.kind)).toEqual([
      'tap-target',
      'small-copy',
    ])
    expect(advisoryFaultsForOwner(findings, 'human').map((f) => f.kind)).toEqual(['tap-target'])
  })

  it('is empty for no findings', () => {
    expect(advisoryFaultsForOwner([], 'react-engineer')).toEqual([])
    expect(advisoryFaultsForOwner(undefined, 'react-engineer')).toEqual([])
  })
})

describe('formatAdvisoryForRepairBrief', () => {
  const tapTarget = {
    surface: '/',
    width: 360,
    kind: 'tap-target',
    detail:
      "'work' is a 34x22px target; a thumb needs 44x44. Give it padding or a taller line box.",
  }

  it('says nothing when there is nothing to report', () => {
    expect(formatAdvisoryForRepairBrief([])).toBe('')
    expect(formatAdvisoryForRepairBrief(undefined)).toBe('')
  })

  it('headers the section and lists the finding', () => {
    const out = formatAdvisoryForRepairBrief([tapTarget])
    expect(out).toContain('## Advisory at 360')
    expect(out).toContain(`/ at 360px: ${tapTarget.detail}`)
  })

  it('does not block the build in its own words', () => {
    expect(formatAdvisoryForRepairBrief([tapTarget])).toContain('do not block the build')
  })
})

describe('brand-fold and brand-contrast findings (#503)', () => {
  // 2026-09-08 and 2026-09-12 declared footer-only and shipped with no mark
  // in the first fold at either rung; 2026-09-09 and 09-10 set the
  // single-colour mark on a ground it sank into. Nothing measured any of it.
  const markInFold = {
    x: 40,
    y: 32,
    width: 48,
    height: 40,
    mode: 'single-color',
    ink: { r: 243, g: 247, b: 244 },
    ground: { r: 10, g: 70, b: 47 },
  }
  const brandOk = { count: 1, viewportHeight: 900, nearestY: 32, inFold: markInFold }
  const kinds = (m) => evaluateMeasurement(m).map((f) => f.kind)

  it('passes a mark inside the fold, tall enough, with contrast', () => {
    expect(evaluateMeasurement({ ...ok, brand: brandOk })).toEqual([])
  })

  it('errors when the only mark sits below the fold, naming rung, scheme, y and fold end', () => {
    const findings = evaluateMeasurement({
      ...ok,
      brand: { count: 1, viewportHeight: 900, nearestY: 2140, inFold: null },
    })
    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({ kind: 'brand-fold', severity: 'error' })
    expect(findings[0].detail).toContain('at 1440 (light)')
    expect(findings[0].detail).toContain('nearest mark at y=2140')
    expect(findings[0].detail).toContain('viewport 900 tall')
  })

  it('names the 360 rung on the mobile measurement', () => {
    const [f] = evaluateMeasurement({
      ...ok,
      viewport: 'mobile',
      clientWidth: 360,
      scrollWidth: 360,
      scheme: 'dark',
      brand: { count: 2, viewportHeight: 640, nearestY: 1810, inFold: null },
    })
    expect(f.kind).toBe('brand-fold')
    expect(f.detail).toContain('at 360 (dark)')
    expect(f.detail).toContain('viewport 640 tall')
  })

  it('is the same finding with a different detail when no mark is on the page at all', () => {
    const [f] = evaluateMeasurement({
      ...ok,
      brand: { count: 0, viewportHeight: 900, nearestY: null, inFold: null },
    })
    expect(f.kind).toBe('brand-fold')
    expect(f.detail).toContain('no brand mark rendered')
    expect(f.detail).not.toContain('nearest')
  })

  it('errors on a mark under the 32px floor at 1440, and says how tall it rendered', () => {
    const [f] = evaluateMeasurement({
      ...ok,
      brand: { ...brandOk, inFold: { ...markInFold, height: 24 } },
    })
    expect(f.kind).toBe('brand-fold')
    expect(f.detail).toContain('mark rendered 24px tall')
    expect(f.detail).toContain(`floor ${BRAND_MARK_MIN_PX}`)
  })

  it('does not apply the height floor at 360, where the lockup is meant to shrink', () => {
    expect(
      kinds({
        ...ok,
        viewport: 'mobile',
        clientWidth: 360,
        scrollWidth: 360,
        brand: { ...brandOk, viewportHeight: 640, inFold: { ...markInFold, height: 24 } },
      })
    ).toEqual([])
  })

  it('errors on a single-colour mark under 3:1, naming both colours and the ratio', () => {
    const [f] = evaluateMeasurement({
      ...ok,
      brand: {
        ...brandOk,
        inFold: { ...markInFold, ink: { r: 26, g: 47, b: 26 }, ground: { r: 11, g: 61, b: 46 } },
      },
    })
    expect(f).toMatchObject({ kind: 'brand-contrast', severity: 'error' })
    expect(f.detail).toContain('single-colour mark #1a2f1a on #0b3d2e')
    expect(f.detail).toMatch(/\d\.\d:1 \(floor 3:1\)/)
    expect(f.detail).toContain(`floor ${BRAND_CONTRAST_MIN}:1`)
  })

  it('leaves an original-mode mark alone whatever its ground: it carries its own disc', () => {
    expect(
      kinds({
        ...ok,
        brand: {
          ...brandOk,
          inFold: {
            ...markInFold,
            mode: 'original',
            ink: { r: 26, g: 47, b: 26 },
            ground: { r: 11, g: 61, b: 46 },
          },
        },
      })
    ).toEqual([])
  })

  it('reports the height floor and the contrast floor together when both are missed', () => {
    expect(
      kinds({
        ...ok,
        brand: {
          ...brandOk,
          inFold: {
            ...markInFold,
            height: 20,
            ink: { r: 26, g: 47, b: 26 },
            ground: { r: 11, g: 61, b: 46 },
          },
        },
      })
    ).toEqual(['brand-fold', 'brand-contrast'])
  })

  it('only fires on engineer-owned routes', () => {
    const below = { count: 1, viewportHeight: 900, nearestY: 2140, inFold: null }
    expect(kinds({ ...ok, route: '/experiments', brand: below })).toEqual([])
    expect(kinds({ ...ok, route: '/work', brand: below })).toEqual([])
    expect(kinds({ ...ok, route: '/about', brand: below })).toEqual(['brand-fold'])
    expect(kinds({ ...ok, route: '/work/spaceman', brand: below })).toEqual(['brand-fold'])
  })

  it('says nothing when the measurement carries no brand block', () => {
    expect(evaluateMeasurement(ok)).toEqual([])
  })

  it('forces a revision: faultsForOwner keeps both kinds', () => {
    const findings = [
      { ...ok, surface: '/', kind: 'brand-fold', severity: 'error', detail: 'x' },
      { ...ok, surface: '/', kind: 'brand-contrast', severity: 'error', detail: 'y' },
    ]
    expect(faultsForOwner(findings, 'react-engineer').map((f) => f.kind)).toEqual([
      'brand-fold',
      'brand-contrast',
    ])
  })

  it('reaches the critic and the repair brief with the mark position and the fold end', () => {
    const [f] = evaluateMeasurement({
      ...ok,
      brand: { count: 1, viewportHeight: 900, nearestY: 2140, inFold: null },
    })
    const out = formatFindingsForCritic([
      { ...f, surface: '/', viewport: 'desktop', width: 1440, scheme: 'light' },
    ])
    expect(out).toContain('- [error] / at 1440px (light): no brand mark inside the first fold')
    expect(out).toContain('nearest mark at y=2140, viewport 900 tall')
  })
})
