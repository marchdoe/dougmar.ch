import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { calloutLineFor, siteCallout } from '../../app/content/callout'
import { dropOrchestratorFiles, identifyFailingAgent } from '../../scripts/design-agents.js'
import { ARCHIVE_LINK_INKS } from '../../scripts/utils/archive-link-ink.js'
import { listScannedFiles, runCopyGate } from '../../scripts/utils/copy-gate.js'
import { findTells } from '../../scripts/utils/copy-tells.js'
import { findUnwritablePaths } from '../../scripts/utils/engineer-output-check.js'
import { ROOT } from '../../scripts/utils/file-manager.js'
import {
  SEMANTIC_COLOR_NAMES,
  findOffContractColorValues,
} from '../../scripts/utils/semantic-contract.js'
import {
  HOME_ROUTE,
  SITE_CALLOUT_CONTENT,
  SITE_CALLOUT_OWNER,
  checkCalloutPlacement,
  renderSiteCalloutFile,
} from '../../scripts/utils/site-callout.js'
import { MUTABLE_FILES, ORCHESTRATOR_FILES } from '../../scripts/utils/site-context.js'

const template = readFileSync(path.join(ROOT, 'scripts/templates/SiteCallout.tsx.template'), 'utf8')
const generated = readFileSync(path.join(ROOT, SITE_CALLOUT_OWNER), 'utf8')

// ─── The rotation ────────────────────────────────────────────────────────────

describe('calloutLineFor', () => {
  it('gives a date the same line every time it is asked', () => {
    expect(calloutLineFor('2026-09-20')).toBe(calloutLineFor('2026-09-20'))
  })

  it('moves to the next line the next day, and wraps', () => {
    const lines = ['a', 'b', 'c']
    const week = ['2026-09-20', '2026-09-21', '2026-09-22', '2026-09-23'].map((d) =>
      calloutLineFor(d, lines)
    )
    expect(new Set(week.slice(0, 3)).size).toBe(3)
    expect(week[3]).toBe(week[0])
  })

  it('crosses a month and a year without repeating a day', () => {
    const lines = ['a', 'b', 'c', 'd', 'e']
    expect(calloutLineFor('2026-09-30', lines)).not.toBe(calloutLineFor('2026-10-01', lines))
    expect(calloutLineFor('2026-12-31', lines)).not.toBe(calloutLineFor('2027-01-01', lines))
  })

  it('shows every line over one cycle', () => {
    const shown = new Set()
    for (let day = 1; day <= siteCallout.lines.length; day++) {
      shown.add(calloutLineFor(`2026-10-${String(day).padStart(2, '0')}`))
    }
    expect(shown.size).toBe(siteCallout.lines.length)
  })

  it('falls back to the first line on a date it cannot read', () => {
    expect(calloutLineFor('not-a-date', ['a', 'b'])).toBe('a')
  })
})

// ─── The copy ────────────────────────────────────────────────────────────────

describe('the callout lines', () => {
  it('pass every copy rule except the one they exist to break', () => {
    const copy = [
      ...siteCallout.lines,
      siteCallout.label,
      siteCallout.whitePaper.label,
      siteCallout.archive.label,
    ]
    for (const text of copy) {
      const tells = findTells(text).filter((t) => t.tell !== 'self-reference')
      expect(tells, text).toEqual([])
    }
  })

  it('point at the white paper and the archive', () => {
    expect(siteCallout.whitePaper.href).toBe('/work/dougmar-ch')
    expect(siteCallout.archive.href).toBe('/archive')
  })
})

// ─── The component ───────────────────────────────────────────────────────────

describe('renderSiteCalloutFile', () => {
  it('writes the date and the count into the source', () => {
    const src = renderSiteCalloutFile({ date: '2026-09-20', archiveCount: 141 })
    expect(src).toContain("const DESIGN_DATE = '2026-09-20'")
    expect(src).toContain('const ARCHIVE_COUNT = 141')
    expect(src).not.toMatch(/\{\{[A-Z_]+\}\}/)
  })

  it('refuses a date that is not a calendar day', () => {
    expect(() => renderSiteCalloutFile({ date: 'today' })).toThrow(/YYYY-MM-DD/)
    expect(() => renderSiteCalloutFile({})).toThrow(/YYYY-MM-DD/)
  })

  it('defaults the count rather than leaving a raw placeholder', () => {
    expect(renderSiteCalloutFile({ date: '2026-09-20' })).toContain('const ARCHIVE_COUNT = 0')
  })

  it('writes the archive link ink, and only one of the three it may choose between', () => {
    for (const ink of ARCHIVE_LINK_INKS) {
      const src = renderSiteCalloutFile({ date: '2026-09-20', archiveLinkInk: ink })
      expect(src).toMatch(new RegExp(`const secondary = css\\(\\{\\n  color: '${ink}'`))
      expect(src).not.toContain('{{ARCHIVE_LINK_INK}}')
    }
    expect(() => renderSiteCalloutFile({ date: '2026-09-20', archiveLinkInk: 'accent' })).toThrow(
      /archive link ink/
    )
  })

  it('keeps textMuted for the link when nobody says otherwise', () => {
    expect(renderSiteCalloutFile({ date: '2026-09-20' })).toMatch(
      /const secondary = css\(\{\n {2}color: 'textMuted'/
    )
  })

  it('the committed component is the template with three values filled in', () => {
    const date = generated.match(/const DESIGN_DATE = '(\d{4}-\d{2}-\d{2})'/)?.[1]
    const archiveCount = Number(generated.match(/const ARCHIVE_COUNT = (\d+)/)?.[1])
    const archiveLinkInk = generated.match(/const secondary = css\(\{\n {2}color: '(\w+)'/)?.[1]
    expect(date).toBeTruthy()
    expect(ARCHIVE_LINK_INKS).toContain(archiveLinkInk)
    expect(generated).toBe(renderSiteCalloutFile({ date, archiveCount, archiveLinkInk }))
  })

  it("names only colours every night's preset defines", () => {
    expect(findOffContractColorValues(template)).toEqual([])
    const named = [...template.matchAll(/(?:bg|color|\w+Color): '([A-Za-z]+)'/g)].map((m) => m[1])
    expect(named.length).toBeGreaterThan(4)
    for (const name of named) expect(SEMANTIC_COLOR_NAMES, name).toContain(name)
  })

  it('takes its faces from the chassis and sets no inline style', () => {
    const faces = [...template.matchAll(/fontFamily: '(\w+)'/g)].map((m) => m[1])
    expect(new Set(faces)).toEqual(new Set(['body', 'display']))
    expect(template).not.toMatch(/\bstyle=/)
  })

  it('is a labelled aside holding both links, the archive one on its old hook', () => {
    expect(template).toMatch(/<aside aria-label=\{siteCallout\.label\}/)
    expect(template).toContain('data-site-callout')
    expect(template).toContain('href={siteCallout.whitePaper.href}')
    expect(template).toMatch(/href=\{siteCallout\.archive\.href\}[^>]*data-archive-link/)
    // shell_posture: none allows no <nav> anywhere on the page.
    expect(template).not.toMatch(/<nav[\s>]/)
  })
})

// ─── Who may write it ────────────────────────────────────────────────────────

describe('the callout is the orchestrator’s', () => {
  it('is on ORCHESTRATOR_FILES, and on MUTABLE_FILES so a rollback restores it', () => {
    expect(ORCHESTRATOR_FILES).toContain(SITE_CALLOUT_OWNER)
    expect(MUTABLE_FILES).toContain(SITE_CALLOUT_OWNER)
  })

  it('an engineer block naming the component or its copy never reaches disk', () => {
    const emitted = [
      { path: SITE_CALLOUT_OWNER, content: 'export const SiteCallout = () => null' },
      { path: SITE_CALLOUT_CONTENT, content: 'export const siteCallout = {}' },
      { path: HOME_ROUTE, content: '' },
    ]
    expect(findUnwritablePaths(emitted)).toEqual([SITE_CALLOUT_OWNER, SITE_CALLOUT_CONTENT])
    expect(dropOrchestratorFiles(emitted, 'test').map((f) => f.path)).not.toContain(
      SITE_CALLOUT_OWNER
    )
  })
})

// ─── Placement ───────────────────────────────────────────────────────────────

const PLACED = [
  "import { Masthead } from '../components/generated/Masthead'",
  "import { SiteCallout } from '../components/SiteCallout'",
  'export function Home() {',
  '  return (<><Masthead /><SiteCallout /></>)',
  '}',
].join('\n')

describe('checkCalloutPlacement', () => {
  it('passes the home route on main', () => {
    expect(checkCalloutPlacement(readFileSync(path.join(ROOT, HOME_ROUTE), 'utf8'))).toEqual([])
  })

  it('passes a route that imports and renders it', () => {
    expect(checkCalloutPlacement(PLACED)).toEqual([])
  })

  it('fails a route that never renders it', () => {
    expect(checkCalloutPlacement(PLACED.replace('<SiteCallout />', ''))).toHaveLength(1)
  })

  it('fails a route that only mentions it in a comment', () => {
    const commented = PLACED.replace('<SiteCallout />', '{/* <SiteCallout /> */}')
    expect(checkCalloutPlacement(commented)).toHaveLength(1)
  })

  it('fails a look-alike the engineer wrote under generated/', () => {
    const fake = PLACED.replace('../components/SiteCallout', '../components/generated/SiteCallout')
    expect(checkCalloutPlacement(fake)).toHaveLength(1)
  })

  it('says what to add and where, and routes to the engineer', () => {
    const [error] = checkCalloutPlacement('')
    expect(error).toContain("import { SiteCallout } from '../components/SiteCallout'")
    expect(error).toContain('between the hero and the footer')
    expect(identifyFailingAgent(error)).toBe('react-engineer')
  })
})

// ─── The copy gate ───────────────────────────────────────────────────────────

describe('the copy gate and the callout', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'callout-copy-gate-'))
    mkdirSync(path.join(root, 'app/content'), { recursive: true })
    mkdirSync(path.join(root, 'app/components/generated'), { recursive: true })
    writeFileSync(
      path.join(root, SITE_CALLOUT_CONTENT),
      readFileSync(path.join(ROOT, SITE_CALLOUT_CONTENT), 'utf8')
    )
    writeFileSync(path.join(root, SITE_CALLOUT_OWNER), generated)
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('reads neither callout file', async () => {
    expect(listScannedFiles(root)).not.toContain(SITE_CALLOUT_CONTENT)
    expect(listScannedFiles(root)).not.toContain(SITE_CALLOUT_OWNER)
    expect((await runCopyGate({ root })).findings).toEqual([])
  })

  it('exempts that one content file and no other', async () => {
    writeFileSync(
      path.join(root, 'app/content/other.ts'),
      "export const deck = 'A rebuild log, kept by hand.'\n"
    )
    const { findings } = await runCopyGate({ root })
    expect(findings.map((f) => [f.surface, f.tell])).toEqual([
      ['app/content/other.ts', 'self-reference'],
    ])
  })

  it('still fails the same sentence in a component the engineer wrote', async () => {
    writeFileSync(
      path.join(root, 'app/components/generated/Deck.tsx'),
      'export const Deck = () => <p>A pipeline rebuilds this site every night.</p>\n'
    )
    const { findings, errorCount } = await runCopyGate({ root })
    expect(errorCount).toBeGreaterThan(0)
    expect(findings[0]).toMatchObject({
      surface: 'app/components/generated/Deck.tsx',
      owner: 'react-engineer',
      tell: 'self-reference',
      severity: 'error',
    })
  })

  it('masks a callout line like any content sentence, and nothing written around it', async () => {
    // Content sentences that carry a tell are blanked out of engineer files
    // and rendered text, which is how the rendered home page passes. The
    // blanking is exact, so the engineer's own sentence beside one still fails.
    const pasted = siteCallout.lines.find((l) => findTells(l).length > 0)
    const deck = (text) =>
      writeFileSync(
        path.join(root, 'app/components/generated/Deck.tsx'),
        `export const Deck = () => <p>{${JSON.stringify(text)}}</p>\n`
      )
    deck(pasted)
    expect((await runCopyGate({ root })).errorCount).toBe(0)
    deck(`${pasted} Come back and watch this site change.`)
    expect((await runCopyGate({ root })).errorCount).toBeGreaterThan(0)
  })
})
