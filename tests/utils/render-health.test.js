/**
 * The findings half of the render-health checks (#574): what a measurement
 * becomes, who owns it, how a run's worth folds into a short brief, and that
 * the e2e spec and the gate read one probe. The probes against a real page are
 * in render-health-dom.test.js.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  KNOWN_SHREDS,
  MAX_RENDER_HEALTH_REPORTED,
  WORD_BREAK_FIX,
  collapseRenderHealth,
  describeBrokenWord,
  describeInvisibleText,
  describeStrandedText,
  isKnownShred,
  renderHealthFindings,
} from '../../scripts/utils/render-health.js'
import { faultsForOwner } from '../../scripts/utils/surface-gate.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (file) => readFileSync(path.join(ROOT, file), 'utf8')

const word = (over = {}) => ({
  word: 'Spaceman',
  selector: 'section.hero > h2.title',
  tag: 'h2',
  sizePx: 273,
  needsPx: 929,
  boxPx: 550,
  lines: 2,
  part: null,
  count: 1,
  ...over,
})

const ghost = (over = {}) => ({
  selector: 'div.band > p.kicker',
  tag: 'p',
  text: 'Founder',
  color: 'rgba(0, 0, 0, 0)',
  sizePx: 20,
  part: null,
  count: 1,
  ...over,
})

const lost = (over = {}) => ({
  selector: 'section.rise',
  tag: 'section',
  text: 'Below the hero',
  widthPx: 800,
  heightPx: 400,
  animationName: 'none',
  part: null,
  count: 1,
  ...over,
})

const measurement = (renderHealth, route = '/') => ({ route, renderHealth })
const seen = (over = {}) => ({
  designDate: '2026-09-20',
  words: [],
  invisible: [],
  stranded: null,
  ...over,
})

describe('a word broken across lines', () => {
  it('is an error for the engineer, with the numbers and the fix', () => {
    const [f] = renderHealthFindings(measurement(seen({ words: [word()] })), 'react-engineer')
    expect(f).toMatchObject({ kind: 'word-break', severity: 'error', owner: 'react-engineer' })
    expect(f.detail).toContain('<section.hero > h2.title> "Spaceman" at 273px needs 929px')
    expect(f.detail).toContain('its box is 550px, broken over 2 lines')
    expect(f.detail).toContain(WORD_BREAK_FIX)
    expect(f.detail).toContain('<br> or writing-mode')
  })

  it('is one finding for an element with several broken words, the worst named first', () => {
    const findings = renderHealthFindings(
      measurement(
        seen({
          words: [
            word({ word: 'Fishsticks', needsPx: 600 }),
            word({ word: 'Twittertale', needsPx: 1800 }),
            word({ word: 'Politweets', needsPx: 700 }),
          ],
        })
      ),
      'react-engineer'
    )
    expect(findings).toHaveLength(1)
    expect(findings[0].detail).toContain('"Twittertale"')
    expect(findings[0].detail).toContain('2 more in the same element: "Fishsticks", "Politweets"')
  })

  it('is one finding per element chain', () => {
    const findings = renderHealthFindings(
      measurement(seen({ words: [word(), word({ selector: 'footer > p' })] })),
      'react-engineer'
    )
    expect(findings.map((f) => f.key)).toEqual([
      'word-break|section.hero > h2.title',
      'word-break|footer > p',
    ])
  })

  it('goes to a person when the word is in a part the orchestrator writes', () => {
    const [f] = renderHealthFindings(
      measurement(seen({ words: [word({ part: 'SiteCallout' })] })),
      'react-engineer'
    )
    expect(f).toMatchObject({ severity: 'error', owner: 'human' })
    expect(f.detail).toContain('SiteCallout is written by the orchestrator')
    expect(faultsForOwner([{ ...f, surface: '/' }], 'react-engineer')).toEqual([])
    expect(faultsForOwner([{ ...f, surface: '/' }], 'human')).toHaveLength(1)
  })

  it('follows the route for who owns it, as every other finding does', () => {
    const [f] = renderHealthFindings(
      measurement(seen({ words: [word()] }), '/experiments'),
      'human'
    )
    expect(f.owner).toBe('human')
  })

  it('is a warning for a design the owner left up, and only for the routes listed', () => {
    KNOWN_SHREDS['2026-09-20'] = ['/']
    try {
      const [home] = renderHealthFindings(measurement(seen({ words: [word()] })), 'react-engineer')
      expect(home.severity).toBe('warning')
      expect(home.detail).toContain('2026-09-20 is listed in KNOWN_SHREDS')
      const [about] = renderHealthFindings(
        measurement(seen({ words: [word()] }), '/about'),
        'react-engineer'
      )
      expect(about.severity).toBe('error')
      // A different design on the same route is not covered.
      const [other] = renderHealthFindings(
        measurement(seen({ designDate: '2026-09-21', words: [word()] })),
        'react-engineer'
      )
      expect(other.severity).toBe('error')
    } finally {
      delete KNOWN_SHREDS['2026-09-20']
    }
  })

  it('ships with no design left up', () => {
    expect(KNOWN_SHREDS).toEqual({})
    expect(isKnownShred('2026-09-20', '/')).toBe(false)
    expect(isKnownShred('', '/')).toBe(false)
    expect(isKnownShred('2026-09-20', '/about', { '2026-09-20': ['/', '/about'] })).toBe(true)
  })
})

describe('text painted in nothing', () => {
  it('is an error for the engineer, with the colour and the fix', () => {
    const [f] = renderHealthFindings(measurement(seen({ invisible: [ghost()] })), 'react-engineer')
    expect(f).toMatchObject({ kind: 'invisible-text', severity: 'error', owner: 'react-engineer' })
    expect(f.detail).toContain('<div.band > p.kicker> "Founder" at 20px is set in rgba(0, 0, 0, 0)')
    expect(f.detail).toContain('no text stroke and no background clipped to the text')
    expect(f.detail).toContain('WebkitTextStroke')
  })

  it('goes to a person inside an orchestrator part', () => {
    const [f] = renderHealthFindings(
      measurement(seen({ invisible: [ghost({ part: 'WhitePaper' })] })),
      'react-engineer'
    )
    expect(f.owner).toBe('human')
    expect(f.detail).toContain('WhitePaper is written by the orchestrator')
  })
})

describe('text left at opacity 0', () => {
  it('is an error for the engineer, with the box and what is still animating', () => {
    const [f] = renderHealthFindings(measurement(seen({ stranded: [lost()] })), 'react-engineer')
    expect(f).toMatchObject({ kind: 'stranded-text', severity: 'error', owner: 'react-engineer' })
    expect(f.detail).toContain('<section.rise> "Below the hero" is 800x400px at opacity 0')
    expect(f.detail).toContain('animation-name none')
    expect(f.detail).toContain('prefers-reduced-motion: reduce')
    expect(f.detail).toContain('Take opacity: 0 out of the base rule')
  })

  it('reports nothing for a page the reduced-motion visit did not cover', () => {
    expect(renderHealthFindings(measurement(seen({ stranded: null })), 'react-engineer')).toEqual(
      []
    )
  })

  it('goes to a person inside an orchestrator part', () => {
    const [f] = renderHealthFindings(
      measurement(seen({ stranded: [lost({ part: 'Material' })] })),
      'react-engineer'
    )
    expect(f.owner).toBe('human')
  })
})

describe('a measurement that read nothing', () => {
  it('has no findings: a tablet visit, or a gate that never ran the probes', () => {
    expect(renderHealthFindings({ route: '/' }, 'react-engineer')).toEqual([])
    expect(renderHealthFindings(measurement(undefined), 'react-engineer')).toEqual([])
  })
})

describe('the wording the e2e failure shares', () => {
  it('names the element chain, not only the tag', () => {
    expect(describeBrokenWord(word())).toBe(
      '<section.hero > h2.title> "Spaceman" at 273px needs 929px, its box is 550px, broken over 2 lines'
    )
    expect(describeInvisibleText(ghost({ count: 3 }))).toBe(
      '<div.band > p.kicker> "Founder" (x3) at 20px is set in rgba(0, 0, 0, 0)'
    )
    expect(describeStrandedText(lost())).toBe(
      '<section.rise> "Below the hero" is 800x400px at opacity 0, animation-name none'
    )
  })
})

/** A finding as `runSurfaceGate` hands it to the fold: with its place. */
const placed = (f, surface, width) => ({ ...f, surface, width, viewport: 'x', scheme: 'light' })
const one = (recordHealth, surfaceOwner = 'react-engineer') =>
  renderHealthFindings(measurement(recordHealth), surfaceOwner)[0]

describe('folding a whole run', () => {
  it('turns one chain at two rungs and two routes into one finding with the places named', () => {
    const f = one(seen({ words: [word()] }))
    const folded = collapseRenderHealth([
      placed(f, '/', 360),
      placed(f, '/', 1440),
      placed(f, '/about', 360),
      placed(f, '/', 360),
    ])
    expect(folded).toHaveLength(1)
    expect(folded[0].detail).toMatch(/Also on \/ at 1440px, \/about at 360px\.$/)
  })

  it('keeps the worst reading of a chain', () => {
    const narrow = placed(one(seen({ words: [word({ needsPx: 700 })] })), '/', 360)
    const wide = placed(one(seen({ words: [word({ needsPx: 1200 })] })), '/', 1440)
    const [folded] = collapseRenderHealth([narrow, wide])
    expect(folded.detail).toContain('needs 1200px')
    expect(folded.width).toBe(1440)
  })

  it('caps a kind at six per owner, worst first, and counts the rest in an error', () => {
    const many = Array.from({ length: 9 }, (_, i) =>
      placed(one(seen({ words: [word({ selector: `h${i}`, needsPx: 600 + i * 100 })] })), '/', 360)
    )
    const folded = collapseRenderHealth(many)
    expect(folded).toHaveLength(MAX_RENDER_HEALTH_REPORTED + 1)
    expect(folded[0].detail).toContain('needs 1400px')
    const last = folded.at(-1)
    expect(last.detail).toBe('3 more distinct words broken across lines are not listed.')
    expect(last.severity).toBe('error')
    expect(faultsForOwner(folded, 'react-engineer')).toHaveLength(MAX_RENDER_HEALTH_REPORTED + 1)
  })

  it('caps each owner and each kind on its own', () => {
    const mine = Array.from({ length: 7 }, (_, i) =>
      placed(one(seen({ invisible: [ghost({ selector: `p${i}` })] })), '/', 360)
    )
    const theirs = placed(
      one(seen({ invisible: [ghost({ selector: 'aside', part: 'SiteCallout' })] })),
      '/',
      360
    )
    const other = placed(one(seen({ words: [word()] })), '/', 360)
    const folded = collapseRenderHealth([...mine, theirs, other])
    expect(folded.filter((f) => f.kind === 'invisible-text' && f.owner === 'human')).toHaveLength(1)
    expect(
      folded.filter((f) => f.kind === 'invisible-text' && f.owner === 'react-engineer')
    ).toHaveLength(MAX_RENDER_HEALTH_REPORTED + 1)
    expect(folded.filter((f) => f.kind === 'word-break')).toHaveLength(1)
  })

  it('puts warnings after errors and gives the closing line the severity it stands for', () => {
    KNOWN_SHREDS['2026-09-20'] = ['/']
    try {
      const warned = Array.from({ length: 8 }, (_, i) =>
        placed(one(seen({ words: [word({ selector: `w${i}` })] })), '/', 360)
      )
      const err = placed(
        one(seen({ designDate: '2026-09-21', words: [word({ selector: 'e' })] })),
        '/',
        360
      )
      const folded = collapseRenderHealth([...warned, err])
      expect(folded[0].severity).toBe('error')
      expect(folded.at(-1).severity).toBe('warning')
      expect(folded.at(-1).detail).toContain('more distinct words broken across lines')
    } finally {
      delete KNOWN_SHREDS['2026-09-20']
    }
  })

  it('passes other findings through, ahead of these', () => {
    const other = { kind: 'overflow', severity: 'error', surface: '/', width: 360, detail: 'x' }
    const f = placed(one(seen({ words: [word()] })), '/', 360)
    expect(collapseRenderHealth([f, other])[0]).toBe(other)
  })
})

/**
 * The e2e spec is the backstop and the gate is the early warning. They agree
 * because they call one probe. This is the guard that keeps it so: the spec
 * imports the probes rather than carrying copies, and the gate takes its
 * readings from the same module.
 */
describe('one probe for the e2e spec and the gate', () => {
  const spec = read('tests/e2e/site-health.spec.ts')
  const probes = ['collectBrokenWords', 'collectInvisibleText', 'collectStrandedText']

  it('has the e2e spec import every probe from the shared module', () => {
    const imported =
      /import \{([^}]+)\} from '\.\.\/\.\.\/scripts\/utils\/render-health-page\.js'/.exec(spec)
    expect(imported).not.toBeNull()
    for (const name of probes) expect(imported[1]).toContain(name)
  })

  it('has the e2e spec call each probe, and carry none of its own', () => {
    // The three describe blocks, which used to hold the probes inline. The
    // work-index test further down measures its own words and is not one of them.
    const start = spec.indexOf("test.describe('site health — nothing renders invisible'")
    const end = spec.indexOf("test.describe('site health — archive'")
    expect(start).toBeGreaterThan(-1)
    expect(end).toBeGreaterThan(start)
    const blocks = spec.slice(start, end)
    for (const name of probes) expect(blocks).toContain(`await ${name}(page)`)
    // A copy here is a probe the gate cannot see.
    expect(blocks).not.toContain('getComputedStyle')
    expect(blocks).not.toContain('matchAll(')
    expect(blocks).not.toContain('webkitTextStrokeWidth')
    expect(spec).not.toMatch(/KNOWN_SHREDS\s*[:=]/)
  })

  it('has the gate take the same three probes from the same module', () => {
    const gate = read('scripts/utils/render-health.js')
    const imported = /import \{([^}]+)\} from '\.\/render-health-page\.js'/.exec(gate)
    expect(imported).not.toBeNull()
    for (const name of probes) expect(imported[1]).toContain(name)
  })

  it('has the surface gate run them through measureRenderHealth and fold the findings', () => {
    const surfaceGate = read('scripts/utils/surface-gate.js')
    expect(surfaceGate).toContain('await measureRenderHealth(')
    expect(surfaceGate).toContain('renderHealthFindings(m, ownerForSurface(m.route))')
    expect(surfaceGate).toContain('collapseRenderHealth(')
  })

  it('has both ends share the same known-shred map and the same wording', () => {
    expect(spec).toContain("from '../../scripts/utils/render-health.js'")
    for (const name of ['isKnownShred', 'describeBrokenWord', 'WORD_BREAK_FIX']) {
      expect(spec).toContain(name)
    }
  })
})
