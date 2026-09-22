import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  collectGateRules,
  collectSurfaceRules,
  formatGateRulesForPrompt,
} from '../../scripts/utils/gate-rules.js'
import { ORPHAN_SEPARATOR_FIX, TELLS } from '../../scripts/utils/copy-tells.js'
import { LINE_LENGTH_FIX } from '../../scripts/utils/line-length.js'
import { INVISIBLE_FIX, STRANDED_FIX, WORD_BREAK_FIX } from '../../scripts/utils/render-health.js'
import {
  SMALL_COPY_FLOOR_PX,
  SMALL_TEXT_FLOOR_PX,
} from '../../scripts/utils/responsive-thresholds.js'
import { SMALL_COPY_FIX, SMALL_TEXT_FIX } from '../../scripts/utils/small-text.js'
import {
  BOX_PAST_VIEWPORT_FIX,
  RUNNING_COPY_FIX,
  TEXT_WIDER_THAN_BOX_FIX,
  VIEWPORT_RUNGS,
} from '../../scripts/utils/surface-gate.js'
import { CONTRAST_FIX, UNRESOLVED_FIX } from '../../scripts/utils/text-contrast.js'
import { SPACED_SPACING_WHY } from '../../scripts/utils/token-gate.js'
import { ALLOWED_URL_HOSTS, DANGEROUS_PATTERNS } from '../../scripts/utils/build-validator.js'
import { REQUIRED_FILES } from '../../scripts/utils/engineer-output-check.js'
import {
  ALLOWED_WRITE_PREFIXES,
  ENGINEER_COMPONENT_FILES,
} from '../../scripts/utils/file-manager.js'
import { SEMANTIC_COLOR_NAMES } from '../../scripts/utils/semantic-contract.js'

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const buildValidatorSource = readFileSync(
  path.join(repoRoot, 'scripts', 'utils', 'build-validator.js'),
  'utf8'
)

const rules = collectGateRules({ root: repoRoot })
const rendered = formatGateRulesForPrompt(rules)

describe('collectGateRules', () => {
  it('names every host in ALLOWED_URL_HOSTS', () => {
    for (const host of ALLOWED_URL_HOSTS) {
      expect(rendered, `missing host ${host}`).toContain(host)
    }
  })

  it('names every required file', () => {
    for (const file of REQUIRED_FILES) {
      expect(rendered, `missing required file ${file}`).toContain(file)
    }
  })

  it('names every allowed write prefix', () => {
    for (const prefix of ALLOWED_WRITE_PREFIXES) {
      expect(rendered, `missing write prefix ${prefix}`).toContain(prefix)
    }
  })

  it('sends invented components to app/components/generated/ and names the two shell files (#448)', () => {
    const rule = rules.find((r) => r.gate === 'write-locations').rule
    expect(rule).toContain('app/components/generated/')
    for (const file of ENGINEER_COMPONENT_FILES) {
      expect(rule, `missing exact path ${file}`).toContain(file)
    }
    expect(rule).toContain('any other path under app/components/ is rejected')
    // The presets are still named, and still not the engineer's to write.
    expect(rule).toMatch(
      /elements\/chassis-preset\.ts and elements\/preset\.ts are the Art Director's/
    )
  })

  it('names the frozen semantic set', () => {
    for (const name of SEMANTIC_COLOR_NAMES) {
      expect(rendered, `missing semantic name ${name}`).toContain(name)
    }
  })

  it('states the innerHTML rule', () => {
    expect(rendered).toContain('dangerouslySetInnerHTML')
    expect(rendered).toContain('innerHTML assignment')
  })

  it('names every forbidden pattern by the name the scan reports it under', () => {
    for (const { name } of DANGEROUS_PATTERNS) {
      expect(rendered, `missing pattern ${name}`).toContain(name)
    }
  })

  it('produces one rule per gate, each with a gate id, rule text and source', () => {
    expect(rules.length).toBeGreaterThan(0)
    for (const rule of rules) {
      expect(rule.gate).toEqual(expect.any(String))
      expect(rule.rule.length).toBeGreaterThan(0)
      expect(rule.source.length).toBeGreaterThan(0)
    }
  })

  // The drift test: every constant build-validator.js exports as a gate — its
  // doc comment says so by naming gate-rules.js, the same way DANGEROUS_PATTERNS
  // and ALLOWED_URL_HOSTS do above their own declarations — must have a rule in
  // collectGateRules(). Add a constant, tag its doc comment, forget the rule:
  // this fails. Add a constant and never tag it as a gate: nothing here can
  // catch that, the same way an unlabeled export never claimed to be a gate.
  it('has a rule for every constant build-validator.js documents as a gate source', () => {
    const taggedNames = [
      ...buildValidatorSource.matchAll(
        /\/\*\*[\s\S]*?gate-rules\.js[\s\S]*?\*\/\s*export const (\w+)/g
      ),
    ].map((m) => m[1])

    // The fixture itself must not go stale — if nobody tags a constant this
    // way any more, the test below would vacuously pass.
    expect(taggedNames).toEqual(expect.arrayContaining(['DANGEROUS_PATTERNS', 'ALLOWED_URL_HOSTS']))

    const sources = rules.map((r) => r.source).join('\n')
    for (const name of taggedNames) {
      expect(
        sources,
        `build-validator.js's ${name} is tagged as a gate source but no rule in collectGateRules cites it`
      ).toContain(name)
    }
  })
})

// #634: the engineer's first pass measured 21 to 127 surface-gate errors
// against rules it learned only from repair briefs. The checklist is
// generated from the gate's own constants and fix lines, so these tests hold
// the two together.
describe('collectSurfaceRules', () => {
  const surfaceRules = collectSurfaceRules()
  const checklist = rendered.slice(rendered.indexOf('## Surface gate checklist'))

  it('renders after the build gates, one bullet per rule', () => {
    expect(rendered.indexOf('## Gates the build enforces')).toBeLessThan(
      rendered.indexOf('## Surface gate checklist')
    )
    const bullets = checklist.split('\n').filter((l) => l.startsWith('- '))
    expect(bullets).toHaveLength(surfaceRules.length)
  })

  // Every error kind the gate can raise against the engineer's pages. The
  // kinds are read off the modules' source, so a new finding kind with no
  // checklist line fails here. Exempt: a page that did not load, a bad HTTP
  // status, a console message and a small tap target, which are either not
  // the engineer's to prevent in the prompt or warnings only.
  const EXEMPT = new Set(['unreachable', 'status', 'console', 'tap-target'])
  const GATE_MODULES = [
    'surface-gate',
    'render-health',
    'text-contrast',
    'small-text',
    'line-length',
    'copy-gate',
  ]

  it('has a line for every finding kind the surface gate raises', () => {
    const kinds = new Set()
    for (const mod of GATE_MODULES) {
      const src = readFileSync(path.join(repoRoot, 'scripts', 'utils', `${mod}.js`), 'utf8')
      for (const m of src.matchAll(/kind: '([a-z-]+)'/g)) kinds.add(m[1])
    }
    expect(kinds.size).toBeGreaterThan(10)
    const covered = new Set(surfaceRules.flatMap((r) => r.kinds))
    const missing = [...kinds].filter((k) => !EXEMPT.has(k) && !covered.has(k))
    expect(missing, `no checklist line for: ${missing.join(', ')}`).toEqual([])
  })

  it('quotes each fix line the findings end with', () => {
    for (const fix of [
      BOX_PAST_VIEWPORT_FIX,
      TEXT_WIDER_THAN_BOX_FIX,
      WORD_BREAK_FIX,
      RUNNING_COPY_FIX,
      LINE_LENGTH_FIX,
      SMALL_COPY_FIX,
      SMALL_TEXT_FIX,
      CONTRAST_FIX,
      UNRESOLVED_FIX,
      INVISIBLE_FIX,
      STRANDED_FIX,
      ORPHAN_SEPARATOR_FIX,
      SPACED_SPACING_WHY,
    ]) {
      expect(checklist, fix).toContain(fix)
    }
    for (const { tell, fix } of TELLS) {
      expect(checklist, `copy tell ${tell}`).toContain(fix)
    }
  })

  it('names every rung and both type floors as numbers', () => {
    for (const { width } of VIEWPORT_RUNGS) expect(checklist).toContain(`${width}`)
    expect(checklist).toContain(`${SMALL_COPY_FLOOR_PX}px or larger`)
    expect(checklist).toContain(`${SMALL_TEXT_FLOOR_PX}px or larger`)
    expect(checklist).not.toMatch(/\{\{/)
  })

  it('writes the connective tells as phrases, not regex source', () => {
    const line = surfaceRules.find((r) => r.gate === 'copy-tells').rule
    expect(line).toContain('in order to')
    expect(line).toContain('not just X, but Y')
    expect(line).not.toMatch(/\\|\{0,/)
  })

  it('carries no em dash', () => {
    expect(checklist).not.toContain('—')
  })
})
