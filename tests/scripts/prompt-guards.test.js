import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { formatPatternPropsForPrompt, readPatternProps } from '../../scripts/utils/pattern-props.js'
import { collectGateRules, formatGateRulesForPrompt } from '../../scripts/utils/gate-rules.js'

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const promptDir = path.join(repoRoot, 'scripts', 'prompts')
const read = (f) => readFileSync(path.join(promptDir, f), 'utf8')

describe('brand-contract.md load-bearing directives', () => {
  const contract = () => read('brand-contract.md')
  it('declares the geometry untouchable', () => {
    expect(contract()).toMatch(/geometry .*(untouchable|never|must not)/i)
  })
  it('enumerates the lockup variants', () => {
    const c = contract()
    expect(c).toContain('mark-only')
    expect(c).toContain('horizontal')
    expect(c).toContain('stacked')
  })
  it('restricts color to exactly two modes', () => {
    const c = contract()
    expect(c).toContain('original')
    expect(c).toContain('single-color')
    expect(c).toMatch(/two modes|exactly two/i)
  })
})

describe('art-director.md output contract', () => {
  const ad = () => read('art-director.md')
  it('requires the MEASURABLES block', () => {
    expect(ad()).toContain('===MEASURABLES===')
    expect(ad()).toContain('canvas_utilization_min')
  })
  it('requires the SHELL block', () => {
    expect(ad()).toContain('===SHELL===')
    expect(ad()).toContain('brand_color_mode')
  })
  it('requires the MOBILE block and the collapse axis (#452)', () => {
    const text = ad()
    expect(text).toContain('===MOBILE===')
    expect(text).toContain('hero_step_360')
    expect(text).toContain(
      'collapse: stack | reorder | hero-only | rail-to-band | split-to-sequence'
    )
    expect(text).toMatch(/5\. \*\*Phone:\*\*/)
  })
})

describe('mockup-designer.md load-bearing directives', () => {
  const md = () => read('mockup-designer.md')
  it('outputs a single self-contained mockup.html', () => {
    expect(md()).toContain('===FILE:mockup.html===')
    expect(md()).toContain('===INTERIOR_NOTES===')
  })
  it('contains the execution rubric with the dead-background metric', () => {
    expect(md()).toMatch(/30%.*(dead|unused|untreated)/i)
  })
  it('has the seed anchor placeholder', () => {
    expect(md()).toContain('<!-- SEED_ANCHOR -->')
  })
  it('forbids the generic shell', () => {
    expect(md()).toMatch(/logo top-left.*nav top-right/i)
  })
})

describe('mockup-critic.md load-bearing directives', () => {
  it('instructs numeric measurement of utilization and coverage', () => {
    const c = read('mockup-critic.md')
    expect(c).toContain('canvas_utilization_min')
    expect(c).toContain('color_coverage_min')
    expect(c).toMatch(/estimates as numbers/i)
  })
})

describe('react-engineer.md load-bearing directives', () => {
  const re = () => read('react-engineer.md')
  it('defines fidelity as the contract', () => {
    expect(re()).toMatch(/fidelity/i)
    expect(re()).toContain('mockup.html')
  })
  it('requires all six files including og.tsx', () => {
    const c = re()
    for (const f of [
      'app/components/Layout.tsx',
      'app/components/Sidebar.tsx',
      'app/routes/index.tsx',
      'app/routes/about.tsx',
      'app/routes/work.$slug.tsx',
      'app/routes/og.tsx',
    ]) {
      expect(c).toContain(f)
    }
  })
  it('specifies the OG card dimensions', () => {
    expect(re()).toContain('1200')
    expect(re()).toContain('630')
  })
  it('forbids raw hex in TSX', () => {
    expect(re()).toMatch(/raw hex|never.*hex|hex.*(token|never)/i)
  })

  // #432: run 33756500843 failed on dangerouslySetInnerHTML and a disallowed
  // URL host in one attempt each, and the prompt named neither. The gate list
  // is generated from the validator's own constants now (scripts/utils/gate-
  // rules.js) rather than hand-transcribed, so it can't go stale the way the
  // hand-written host list did (missing doug-march.com and www.w3.org).
  it('carries the {{GATES}} placeholder rather than a hand-written gate list', () => {
    expect(re()).toContain('{{GATES}}')
  })

  it('the rendered prompt states the innerHTML rule and the allowed hosts', () => {
    const rendered = re().replace(
      '{{GATES}}',
      formatGateRulesForPrompt(collectGateRules({ root: repoRoot }))
    )
    expect(rendered).toContain('dangerouslySetInnerHTML')
    expect(rendered).toMatch(/hosts?\s*—.*fonts\.googleapis\.com/i)
  })
})

describe('screenshot-critic.md load-bearing directives', () => {
  const sc = () => read('screenshot-critic.md')
  it('gates the BAR calibration line on a reference image being attached', () => {
    const c = sc()
    expect(c).toContain('BAR:')
    expect(c).toMatch(/above\|at\|below/)
    expect(c).toMatch(/Skip this section entirely if no reference image/i)
  })
})

describe('design-system-reference.md pattern-prop block', () => {
  // #432: the React Engineer wrote `wrap` on `HStack`, `align` on `VStack`,
  // and `href` on `<Box as="a">` — none of which the generated pattern types
  // allow. The hand-written line the prompt used to carry ("Stack/VStack/
  // HStack: gap, align, justify") is exactly what told it `align` was fair
  // game on HStack. It's a placeholder now, rendered from the real types at
  // load time (scripts/design-agents.js), so the prompt can't drift from
  // what actually compiles the way that line did.
  it('carries the {{PATTERN_PROPS}} placeholder rather than a hand-written prop list', () => {
    const source = read('design-system-reference.md')
    expect(source).toContain('{{PATTERN_PROPS}}')
  })

  it('no longer hand-lists Stack/VStack/HStack props next to each other', () => {
    const source = read('design-system-reference.md')
    expect(source).not.toMatch(/Stack\/VStack\/HStack/)
  })

  it('the rendered block names HStack with gap and justify, and attributes align to neither HStack nor VStack', () => {
    const rendered = formatPatternPropsForPrompt(readPatternProps(repoRoot))
    const lines = rendered.split('\n')
    const hstackLine = lines.find((l) => l.startsWith('- `HStack`'))
    const vstackLine = lines.find((l) => l.startsWith('- `VStack`'))
    expect(hstackLine).toBeDefined()
    expect(vstackLine).toBeDefined()
    expect(hstackLine).toContain('`gap`')
    expect(hstackLine).toContain('`justify`')
    expect(hstackLine).not.toContain('align')
    expect(vstackLine).not.toContain('align')
  })
})

describe('lane permission overrides', () => {
  // Successor to the old seed-era check (composition-grammar arc, Task 4):
  // seeds/ welded a "not the law" disclaimer to an archetype name that no
  // longer exists. Lanes carry the equivalent guard as inline prose instead
  // — every lane is an anchor to reinterpret, not a template to copy.
  const laneDir = path.join(promptDir, 'lanes')
  const lanes = readdirSync(laneDir).filter((f) => f.endsWith('.md') && f !== 'README.md')
  it('every lane declares itself an anchor, not a copy target', () => {
    expect(lanes.length).toBeGreaterThanOrEqual(15)
    for (const f of lanes) {
      const content = readFileSync(path.join(laneDir, f), 'utf8')
      expect(content, `${f} missing anchor-not-copy-target guard`).toContain('not copy target')
    }
  })

  // lanes/README.md: a lane "says nothing about page structure (columns, axis,
  // symmetry, hero placement, density, rhythm, shell posture, field ratio)".
  // It said plenty. #254 took out the `Nav:` lines; #255 found seventeen more
  // placements hiding in component cues and mobile strategies — grid cells, a
  // thumbnail at the left, a kicker in the top-left corner, six instructions to
  // stack or collapse at a given width. Between them they were asserting four
  // of the eight axes the Art Director is supposed to own.
  //
  // Front matter is exempt: `affinity` names composition-axis values on
  // purpose, and it is advisory.
  const STRUCTURE_PRESCRIPTIONS = [
    [/^\s*Nav:/m, 'a Nav: line'],
    [/\bsidebar\b/i, 'a sidebar'],
    [/\bgrid cells?\b/i, 'grid cells'],
    [/\btop bar\b/i, 'a top bar'],
    [/\bmasthead bar\b/i, 'a masthead bar'],
    [/\bhero zone\b/i, 'a hero zone'],
    [/\bstacked? (?:section|card|column)/i, 'stacking'],
    [/\bstacks? (?:into|below|above|beneath|under|normally)/i, 'stacking'],
    [/\bcollapses? to\b/i, 'a collapse'],
    [/\bre-?cent(?:er|re)\b/i, 're-centring'],
    [/\badjacent columns?\b/i, 'adjacent columns'],
    [/\btwo columns?\b/i, 'a column count'],
    [/\bsingle column\b/i, 'a column count'],
    [
      /\b(?:above|below|beside|beneath|underneath) the (?:glyph|hero|image|title|tile|fold|text)\b/i,
      'a placement',
    ],
    [/\b(?:top|bottom)-(?:left|right) corner\b/i, 'a corner'],
    [/\bin one corner\b/i, 'a corner'],
    [/\bat the (?:left|right|top|bottom)\b/i, 'an edge placement'],
    [/\banchored to (?:its|the) edge\b/i, 'an edge placement'],
    [/\bend to end\b/i, 'a sequence'],
  ]

  it.each(lanes)('%s prescribes register, never placement', (f) => {
    const body = readFileSync(path.join(laneDir, f), 'utf8').replace(/^---[\s\S]*?\n---\n/, '')
    for (const [pattern, what] of STRUCTURE_PRESCRIPTIONS) {
      const hit = pattern.exec(body)
      expect(
        hit,
        `${f} prescribes ${what} (${JSON.stringify(hit?.[0])}) — that belongs to the composition tuple`
      ).toBeNull()
    }
  })
})

describe('logo-mono.svg', () => {
  it('exists and uses currentColor exclusively (no hardcoded colors)', () => {
    const svg = readFileSync(
      path.join(promptDir, '..', '..', 'app', 'assets', 'logo-mono.svg'),
      'utf8'
    )
    expect(svg).toContain('currentColor')
    // Allowlist: every paint value must be none or currentColor — catches
    // named colors (fill="white") that a hex/rgb blocklist would miss.
    const paints = [...svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1])
    expect(paints.length).toBeGreaterThan(0)
    expect(paints.every((p) => p === 'none' || p === 'currentColor')).toBe(true)
  })
})
