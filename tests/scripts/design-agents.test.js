import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import {
  FILE_OWNERSHIP,
  identifyFailingAgent,
  parseDelimiterResponse,
  buildCompositionContractBlock,
  archiveArtifacts,
  describeRiskTier,
  resolveRiskWeight,
} from '../../scripts/design-agents.js'

describe('FILE_OWNERSHIP', () => {
  it('maps every file to a known agent', () => {
    // An object key can only hold one value, so "exactly one agent" is true
    // by construction. What can actually go wrong is a typo in an agent name,
    // which identifyFailingAgent would then route nowhere.
    const known = new Set(['art-director', 'react-engineer'])
    for (const [file, agent] of Object.entries(FILE_OWNERSHIP)) {
      expect(known, `${file} is owned by unknown agent "${agent}"`).toContain(agent)
    }
  })

  it('tripwire: 7 owned files', () => {
    // Fails on purpose when a file is added to or removed from the mutable
    // set, so the change is a decision rather than a side effect. Was 16
    // until #216 dropped the six components no route had imported since March,
    // then 10 until #448 took the three hand-written /elements components off.
    expect(Object.keys(FILE_OWNERSHIP)).toHaveLength(7)
  })

  it('maps preset.ts to art-director', () => {
    expect(FILE_OWNERSHIP['elements/preset.ts']).toBe('art-director')
  })

  it('does not map __root.tsx to any agent (orchestrator owns it via the chassis template)', () => {
    expect(FILE_OWNERSHIP['app/routes/__root.tsx']).toBeUndefined()
  })

  it('maps layout, route and sidebar files to react-engineer', () => {
    expect(FILE_OWNERSHIP['app/components/Layout.tsx']).toBe('react-engineer')
    expect(FILE_OWNERSHIP['app/routes/index.tsx']).toBe('react-engineer')
    expect(FILE_OWNERSHIP['app/components/Sidebar.tsx']).toBe('react-engineer')
  })

  it('the hand-written /elements components belong to no agent (#448)', () => {
    expect(FILE_OWNERSHIP['app/components/SectionHead.tsx']).toBeUndefined()
    expect(FILE_OWNERSHIP['app/components/ProjectRow.tsx']).toBeUndefined()
    expect(FILE_OWNERSHIP['app/components/FeaturedProject.tsx']).toBeUndefined()
  })

  it('maps og.tsx to react-engineer (share card is engineer-authored)', () => {
    expect(FILE_OWNERSHIP['app/routes/og.tsx']).toBe('react-engineer')
  })

  it('MobileFooter.tsx is not in FILE_OWNERSHIP (removed from mutable files)', () => {
    expect(FILE_OWNERSHIP['app/components/MobileFooter.tsx']).toBeUndefined()
  })
})

describe('identifyFailingAgent', () => {
  it('identifies react-engineer from a build error mentioning Layout.tsx', () => {
    const error = 'app/components/Layout.tsx(15,7): error TS2322'
    expect(identifyFailingAgent(error)).toBe('react-engineer')
  })

  it('identifies react-engineer from a build error mentioning Sidebar.tsx', () => {
    const error = 'app/components/Sidebar.tsx(8,3): error TS2304'
    expect(identifyFailingAgent(error)).toBe('react-engineer')
  })

  it('identifies art-director from error mentioning preset', () => {
    const error = 'Error in elements/preset.ts: invalid token'
    expect(identifyFailingAgent(error)).toBe('art-director')
  })

  it('returns react-engineer when errors span multiple react-engineer files', () => {
    const error = 'app/components/Layout.tsx(15,7): error\napp/components/Sidebar.tsx(8,3): error'
    expect(identifyFailingAgent(error)).toBe('react-engineer')
  })

  it('returns "both" when no file can be identified', () => {
    const error = 'Unknown build error'
    expect(identifyFailingAgent(error)).toBe('both')
  })
})

describe('archiveArtifacts', () => {
  const base = {
    finalScreenshot: null,
    mockup: null,
    mockupScreenshot: null,
    verdicts: [{ critic: 'surface-gate', verdict: 'SHIP' }],
    shellDecl: { posture: 'standard' },
    headerDecl: { placement: 'top' },
    mobileDecl: { carrier: 'the hero', hero_step_360: 'hero' },
    heroSource: undefined,
    chosenComposition: { hero: 'poster' },
    chosenLane: { id: 'quiet', register: 'plain' },
  }

  it('writes nothing, not an empty file, for captures that did not happen', () => {
    const out = archiveArtifacts(base)
    for (const name of [
      'screenshot.png',
      'screenshot-dark.png',
      'mockup.html',
      'mockup-screenshot.png',
      'fingerprint.json',
    ]) {
      expect(out[name], name).toBeNull()
    }
    expect(out['hero-source.json']).toBe(JSON.stringify({ source: null }, null, 2))
  })

  it('carries every capture through when it happened', () => {
    const png = Buffer.from([1])
    const out = archiveArtifacts({
      ...base,
      finalScreenshot: { png, darkPng: png, fingerprint: { elements: [1] } },
      mockup: { mockupHtml: '<html>' },
      mockupScreenshot: { png },
      heroSource: 'weather',
    })
    expect(out['screenshot.png']).toBe(png)
    expect(out['screenshot-dark.png']).toBe(png)
    expect(out['mockup.html']).toBe('<html>')
    expect(out['mockup-screenshot.png']).toBe(png)
    expect(JSON.parse(out['fingerprint.json'])).toEqual({ elements: [1] })
    expect(JSON.parse(out['hero-source.json'])).toEqual({ source: 'weather' })
    expect(JSON.parse(out['lane.json'])).toEqual({ laneId: 'quiet', register: 'plain' })
    expect(JSON.parse(out['verdicts.json'])).toEqual(base.verdicts)
    // The phone declaration lands beside the tuple it explains (#452).
    expect(JSON.parse(out['mobile.json'])).toEqual(base.mobileDecl)
  })
})

describe('one run date', () => {
  // #302: run-date.js unified six derivations of "today"; five raw reads of
  // signals.date survived, and they disagreed on a missing date (path.join
  // threw, archive() stringified undefined into archive/undefined/).
  it('never reads signals.date directly after runDate() has answered', () => {
    const SOURCE = readFileSync(new URL('../../scripts/design-agents.js', import.meta.url), 'utf8')
    const after = SOURCE.slice(SOURCE.indexOf('const today = runDate(signals)'))
    expect(after).not.toMatch(/signals\.date/)
  })
})

describe('parseDelimiterResponse', () => {
  it('parses a single file', () => {
    const input = ['===FILE:app/components/Foo.tsx===', 'export const x = 42', ''].join('\n')
    const { files } = parseDelimiterResponse(input)
    expect(files).toHaveLength(1)
    expect(files[0].path).toBe('app/components/Foo.tsx')
    expect(files[0].content).toBe('export const x = 42')
  })

  it('parses multiple files', () => {
    const input = [
      '===FILE:app/components/Foo.tsx===',
      'const foo = 1',
      '===FILE:app/components/Bar.tsx===',
      'const bar = 2',
      '',
    ].join('\n')
    const { files } = parseDelimiterResponse(input)
    expect(files).toHaveLength(2)
    expect(files[0].path).toBe('app/components/Foo.tsx')
    expect(files[1].path).toBe('app/components/Bar.tsx')
  })

  it('preserves === in file content (not line-anchored)', () => {
    // This is the regression we are guarding against. The old parser
    // would split Foo.tsx in two when the content contained === anywhere.
    const input = [
      '===FILE:app/components/Foo.tsx===',
      "const x = 'border: 3px solid === separator ==='",
      'const y = 42',
      '===FILE:app/components/Bar.tsx===',
      'const bar = 1',
      '',
    ].join('\n')
    const { files } = parseDelimiterResponse(input)
    expect(files).toHaveLength(2)
    expect(files[0].content).toContain('=== separator ===')
    expect(files[1].path).toBe('app/components/Bar.tsx')
  })

  it('preserves ===FILE: inside file content when not at start of line', () => {
    // Even if a file has "===FILE:path===" in a comment or string,
    // it should not be treated as a delimiter.
    const input = [
      '===FILE:app/components/Foo.tsx===',
      '// Example: ===FILE:path=== was the old format',
      'const x = 42',
      '===FILE:app/components/Bar.tsx===',
      'const bar = 1',
      '',
    ].join('\n')
    const { files } = parseDelimiterResponse(input)
    expect(files).toHaveLength(2)
    expect(files[0].content).toContain('// Example: ===FILE:path===')
    expect(files[1].path).toBe('app/components/Bar.tsx')
  })

  it('extracts rationale after ===RATIONALE===', () => {
    const input = [
      '===FILE:app/components/Foo.tsx===',
      'const x = 42',
      '===RATIONALE===',
      'This is the rationale.',
      '',
    ].join('\n')
    const { rationale } = parseDelimiterResponse(input)
    expect(rationale).toBe('This is the rationale.')
  })

  it('extracts design_brief after ===DESIGN_BRIEF===', () => {
    const input = [
      '===FILE:app/components/Foo.tsx===',
      'const x = 42',
      '===DESIGN_BRIEF===',
      'Post-blizzard brutalism.',
      '',
    ].join('\n')
    const { design_brief } = parseDelimiterResponse(input)
    expect(design_brief).toBe('Post-blizzard brutalism.')
  })

  it('extracts both rationale and design_brief', () => {
    const input = [
      '===FILE:app/components/Foo.tsx===',
      'content',
      '===RATIONALE===',
      'Why I did this.',
      '===DESIGN_BRIEF===',
      'Spring morning.',
      '',
    ].join('\n')
    const result = parseDelimiterResponse(input)
    expect(result.rationale).toBe('Why I did this.')
    expect(result.design_brief).toBe('Spring morning.')
    expect(result.files).toHaveLength(1)
  })

  it('ignores files with empty paths or content', () => {
    const input = ['===FILE: ===', 'content', '===FILE:valid.tsx===', 'const x = 1', ''].join('\n')
    const { files } = parseDelimiterResponse(input)
    expect(files).toHaveLength(1)
    expect(files[0].path).toBe('valid.tsx')
  })

  it('parses Art Director hero copy, archetype, chassis, visual spec, and self-check blocks', () => {
    const input = [
      '===HERO_COPY===',
      'There is no limit to what a man can do',
      '===HERO_RATIONALE===',
      'Reagan quote anchors the day.',
      '===ARCHETYPE===',
      'Specimen',
      '===CHASSIS_ID===',
      'big-shoulders-atkinson',
      '===VISUAL_SPEC===',
      '## Color Specification\n- Primary hue: 18°',
      '===SELF_CHECK===',
      '1. Hero quotability: Yes — universally quotable',
      '===FILE:elements/preset.ts===',
      "export const elementsPreset = 'stub'",
      '===RATIONALE===',
      'Phrase → Specimen → big-shoulders → terracotta.',
      '===DESIGN_BRIEF===',
      'Terracotta marquee.',
      '',
    ].join('\n')
    const r = parseDelimiterResponse(input)
    expect(r.hero_copy).toBe('There is no limit to what a man can do')
    expect(r.hero_rationale).toBe('Reagan quote anchors the day.')
    expect(r.archetype).toBe('Specimen')
    expect(r.chassis_id).toBe('big-shoulders-atkinson')
    expect(r.visual_spec).toContain('Primary hue: 18°')
    expect(r.self_check).toContain('Hero quotability: Yes')
    expect(r.files).toHaveLength(1)
    expect(r.files[0].path).toBe('elements/preset.ts')
    expect(r.rationale).toBe('Phrase → Specimen → big-shoulders → terracotta.')
    expect(r.design_brief).toBe('Terracotta marquee.')
  })

  it('strips outer markdown code fence so last block before closing fence is not contaminated', () => {
    // If the model wraps its entire response in ```markdown...```, the lazy
    // captureBlock regex extends past the closing fence into the sentinel,
    // appending backtick chars to the last block before the fence.
    const input = [
      '```markdown',
      '===HERO_COPY===',
      'STAND UP TO YOUR FRIENDS.',
      '===CHASSIS_ID===',
      'big-shoulders-atkinson',
      '```',
      '',
    ].join('\n')
    const r = parseDelimiterResponse(input)
    expect(r.hero_copy).toBe('STAND UP TO YOUR FRIENDS.')
    expect(r.chassis_id).toBe('big-shoulders-atkinson')
  })

  it('strips outer plain code fence', () => {
    const input = [
      '```',
      '===HERO_COPY===',
      'No enemies, only rivals.',
      '===ARCHETYPE===',
      'Poster',
      '```',
      '',
    ].join('\n')
    const r = parseDelimiterResponse(input)
    expect(r.hero_copy).toBe('No enemies, only rivals.')
    expect(r.archetype).toBe('Poster')
  })
})

describe('buildCompositionContractBlock', () => {
  it('returns the override block when density is sparse', () => {
    const block = buildCompositionContractBlock({ density: 'sparse' })
    expect(block).toContain('COMPOSITION CONTRACT — SPARSE')
    expect(block).toContain('hero phrase + navigation ONLY')
    expect(block).toContain('Do NOT render project cards')
  })

  it('fires regardless of which other axis values accompany sparse density', () => {
    const block = buildCompositionContractBlock({
      density: 'sparse',
      field_ratio: 'type-dominant',
      hero_zone: 'full-bleed',
    })
    expect(block).toContain('COMPOSITION CONTRACT — SPARSE')
  })

  it('returns empty string for every other density value', () => {
    expect(buildCompositionContractBlock({ density: 'measured' })).toBe('')
    expect(buildCompositionContractBlock({ density: 'dense' })).toBe('')
    expect(buildCompositionContractBlock({ density: 'crowded' })).toBe('')
  })

  it('returns empty string for a missing or empty tuple', () => {
    expect(buildCompositionContractBlock(undefined)).toBe('')
    expect(buildCompositionContractBlock(null)).toBe('')
    expect(buildCompositionContractBlock({})).toBe('')
  })
})

describe('describeRiskTier', () => {
  it('produces four distinct sentences across the 3-4 / 5-6 / 7-8 / 9-10 buckets', () => {
    const sentences = new Set([3, 4, 5, 6, 7, 8, 9, 10].map(describeRiskTier))
    // 8 risk values, 4 buckets → exactly 4 distinct sentences.
    expect(sentences.size).toBe(4)
  })

  it('risk 3 and 4 share the SAFE bucket', () => {
    expect(describeRiskTier(3)).toBe(describeRiskTier(4))
    expect(describeRiskTier(3)).toMatch(/SAFE/)
  })

  it('risk 5 and 6 share the Balanced bucket', () => {
    expect(describeRiskTier(5)).toBe(describeRiskTier(6))
    expect(describeRiskTier(5)).toMatch(/Balanced/)
  })

  it('risk 7 and 8 share the BOLD bucket, distinct from 9-10', () => {
    expect(describeRiskTier(7)).toBe(describeRiskTier(8))
    expect(describeRiskTier(7)).toMatch(/^BOLD/)
    expect(describeRiskTier(7)).not.toBe(describeRiskTier(9))
  })

  it('risk 9 and 10 share the MAXIMUM RISK bucket and mention the Max-Risk License', () => {
    expect(describeRiskTier(9)).toBe(describeRiskTier(10))
    expect(describeRiskTier(9)).toMatch(/MAXIMUM RISK/)
    expect(describeRiskTier(9)).toMatch(/Max-Risk License/)
  })

  it('the old risk=8 default no longer produces the >=7 sentence used for 9-10', () => {
    // Regression guard: risk=8 was the constant default before this change,
    // and previously shared the ">=7" sentence with every value through 10.
    expect(describeRiskTier(8)).not.toBe(describeRiskTier(10))
  })
})

describe('resolveRiskWeight', () => {
  it('an explicitly-set env value always wins over the derived value', () => {
    expect(resolveRiskWeight('5', '2026-08-23')).toEqual({ risk: 5, explicitlySet: true })
    expect(resolveRiskWeight('10', '2026-01-01')).toEqual({ risk: 10, explicitlySet: true })
  })

  it('"0" counts as explicitly set (falsy in JS, but not unset)', () => {
    expect(resolveRiskWeight('0', '2026-08-23')).toEqual({ risk: 0, explicitlySet: true })
  })

  it('a non-number derives from the date, like the other three dials (#301)', () => {
    // parseInt('high') is NaN; describeRiskTier(NaN) read as SAFE and
    // build.json stored null.
    const fromBad = resolveRiskWeight('high', '2026-08-23')
    const fromUnset = resolveRiskWeight(undefined, '2026-08-23')
    expect(fromBad).toEqual(fromUnset)
    expect(fromBad.explicitlySet).toBe(false)
    expect(Number.isNaN(fromBad.risk)).toBe(false)
  })

  it('undefined and empty string both derive risk from the date instead', () => {
    const fromUndefined = resolveRiskWeight(undefined, '2026-08-23')
    const fromEmpty = resolveRiskWeight('', '2026-08-23')
    expect(fromUndefined.explicitlySet).toBe(false)
    expect(fromEmpty.explicitlySet).toBe(false)
    expect(fromUndefined.risk).toBe(fromEmpty.risk)
  })

  it('derived risk is always in range 3-10', () => {
    const dates = [
      '2026-01-01',
      '2026-02-14',
      '2026-03-30',
      '2026-04-17',
      '2026-05-05',
      '2026-06-21',
      '2026-07-04',
      '2026-08-23',
      '2026-09-09',
      '2026-10-31',
      '2026-11-11',
      '2026-12-25',
    ]
    for (const date of dates) {
      const { risk } = resolveRiskWeight(undefined, date)
      expect(risk).toBeGreaterThanOrEqual(3)
      expect(risk).toBeLessThanOrEqual(10)
    }
  })

  it('same date always derives the same risk (reproducible re-runs)', () => {
    const a = resolveRiskWeight(undefined, '2026-08-23')
    const b = resolveRiskWeight(undefined, '2026-08-23')
    expect(a).toEqual(b)
  })

  it('different dates derive different risk values across a run (not a constant)', () => {
    const dates = [
      '2026-01-01',
      '2026-02-14',
      '2026-03-30',
      '2026-04-17',
      '2026-05-05',
      '2026-06-21',
      '2026-07-04',
      '2026-08-23',
      '2026-09-09',
      '2026-10-31',
      '2026-11-11',
      '2026-12-25',
    ]
    const risks = new Set(dates.map((d) => resolveRiskWeight(undefined, d).risk))
    expect(risks.size).toBeGreaterThan(1)
  })
})

describe('a mockup revision round is counted as a retry', () => {
  // #303: every other retry path calls noteRetry(), but the MAX_MOCKUP_REVISIONS
  // loop started another Mockup Designer call without telling the ledger, so
  // cost.json's retries undercounted whether the critic loop earned its keep.
  const SOURCE = readFileSync(new URL('../../scripts/design-agents.js', import.meta.url), 'utf8')
  const loopStart = SOURCE.indexOf('const MAX_MOCKUP_REVISIONS = 2')
  const loop = SOURCE.slice(loopStart, SOURCE.indexOf('Phase 2c: React Engineer', loopStart))

  it('calls noteRetry() before feeding critique back into another revision round', () => {
    expect(loop).toMatch(/noteRetry\(\)\s*\n\s*revisionFeedback = critique\.feedback/)
  })
})

describe('the mockup critic verdict keeps its channel', () => {
  // #304: the screenshot critic's push already records channel: visionChannel,
  // so verdicts.json shows whether that verdict was reached with or without
  // pixels. The mockup critic's push dropped critique.channel on the way in,
  // so the same distinction was invisible for every mockup revision round.
  const SOURCE = readFileSync(new URL('../../scripts/design-agents.js', import.meta.url), 'utf8')
  const loopStart = SOURCE.indexOf('const MAX_MOCKUP_REVISIONS = 2')
  const loop = SOURCE.slice(loopStart, SOURCE.indexOf('Phase 2c: React Engineer', loopStart))

  it('records channel: critique.channel on the mockup-critic verdicts.push', () => {
    expect(loop).toMatch(/critic: 'mockup-critic',[\s\S]*?channel: critique\.channel,/)
  })
})

describe('the swarm takes a root', () => {
  // #221: every path the swarm reads or writes derives from the `root`
  // option, so a test can run the real function against a temp checkout.
  // The one `ROOT` left is the option's default in the signature.
  const SOURCE = readFileSync(new URL('../../scripts/design-agents.js', import.meta.url), 'utf8')
  const start = SOURCE.indexOf('export async function runAgentSwarm')
  const bodyStart = SOURCE.indexOf('{\n', start)
  const end = SOURCE.indexOf('\nif (isMain(', bodyStart)

  it('defaults the root option to the module constant', () => {
    expect(SOURCE.slice(start, bodyStart)).toMatch(/\{ onTraceStep, root = ROOT \} = \{\}/)
  })

  it('never reads the module constant inside the body', () => {
    expect(bodyStart).toBeGreaterThan(-1)
    expect(end).toBeGreaterThan(bodyStart)
    expect(SOURCE.slice(bodyStart, end)).not.toMatch(/\bROOT\b/)
  })
})
