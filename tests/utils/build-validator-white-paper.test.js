import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { validateGenerated } from '../../scripts/utils/build-validator.js'
import { stripComments } from '../../scripts/utils/token-gate.js'
import { SEMANTIC_COLOR_NAMES } from '../../scripts/utils/semantic-contract.js'
import {
  WHITE_PAPER_OWNER,
  WHITE_PAPER_ROUTE,
  WHITE_PAPER_SLUG,
  checkWhitePaper,
  renderWhitePaperFile,
} from '../../scripts/utils/white-paper.js'
import { projects } from '../../app/content/projects.ts'
import { WhitePaper } from '../../app/components/WhitePaper.tsx'

const TEMPLATE = path.resolve(process.cwd(), 'scripts/templates/WhitePaper.tsx.template')

const GOOD_ROUTE = [
  "import { createFileRoute } from '@tanstack/react-router'",
  "import { projects } from '../content/projects'",
  "import { CaseStudy } from '../components/generated/CaseStudy'",
  "import { WhitePaper } from '../components/WhitePaper'",
  "export const Route = createFileRoute('/work/$slug')({ component: Page })",
  'function Page() {',
  '  const { slug } = Route.useParams()',
  '  const project = projects.find((p) => p.slug === slug) ?? projects[0]',
  "  return project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />",
  '}',
].join('\n')

/**
 * A tree just big enough for the reachability walk: a root that mounts the
 * layout, the route under test, the generated case study it falls back to,
 * and the orchestrator's component.
 */
function seedRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'white-paper-validator-'))
  mkdirSync(path.join(root, 'elements'), { recursive: true })
  mkdirSync(path.join(root, 'app/components/generated'), { recursive: true })
  mkdirSync(path.join(root, 'app/routes'), { recursive: true })
  mkdirSync(path.join(root, 'app/content'), { recursive: true })

  writeFileSync(
    path.join(root, 'elements/preset.ts'),
    'export const elementsPreset = { theme: { tokens: {} } }\n'
  )
  writeFileSync(
    path.join(root, 'app/content/about.ts'),
    "export const identity = { name: 'Doug March', role: 'Product Designer', email: 'hello@dougmar.ch' }\n"
  )
  writeFileSync(
    path.join(root, 'app/content/projects.ts'),
    "export const projects = [{ slug: 'dougmar-ch' }, { slug: 'spaceman' }]\n"
  )
  writeFileSync(
    path.join(root, 'app/routes/__root.tsx'),
    "import { Layout } from '../components/Layout'\nexport const Route = { component: Layout }\n"
  )
  writeFileSync(
    path.join(root, 'app/components/Layout.tsx'),
    'export function Layout({ children }: { children: React.ReactNode }) {\n  return <div>{children}</div>\n}\n'
  )
  writeFileSync(
    path.join(root, 'app/components/generated/CaseStudy.tsx'),
    'export function CaseStudy() {\n  return <section />\n}\n'
  )
  writeFileSync(path.join(root, WHITE_PAPER_OWNER), renderWhitePaperFile())
  writeFileSync(path.join(root, WHITE_PAPER_ROUTE), GOOD_ROUTE)
  return root
}

/** Findings about the white paper, so an unrelated check cannot pass a test. */
function whitePaperErrors(result) {
  if (result.success) return []
  return result.error
    .split('\n')
    .filter((line) => /WhitePaper/.test(line))
    .map((line) => line.trim())
}

describe('validateGenerated, the white paper (#533)', () => {
  let root
  beforeEach(() => {
    root = seedRepo()
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  const run = () => whitePaperErrors(validateGenerated({ root, shell: null }))

  it('passes a route that hands the slug to the component', () => {
    expect(run()).toEqual([])
  })

  it('rejects a route that renders its own case study for every slug', () => {
    writeFileSync(
      path.join(root, WHITE_PAPER_ROUTE),
      GOOD_ROUTE.replace("import { WhitePaper } from '../components/WhitePaper'\n", '').replace(
        "project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />",
        '<CaseStudy project={project} />'
      )
    )
    expect(run().join('\n')).toMatch(
      /work\.\$slug\.tsx: does not render <WhitePaper \/> for the 'dougmar-ch' slug/
    )
  })

  it('rejects an import that is never rendered', () => {
    writeFileSync(
      path.join(root, WHITE_PAPER_ROUTE),
      GOOD_ROUTE.replace('<WhitePaper />', '<CaseStudy project={project} />')
    )
    expect(run().join('\n')).toMatch(/does not render <WhitePaper \/>/)
  })

  it('rejects a render that never names the slug', () => {
    writeFileSync(
      path.join(root, WHITE_PAPER_ROUTE),
      GOOD_ROUTE.replace("project.slug === 'dougmar-ch'", 'project.featured')
    )
    expect(run().join('\n')).toMatch(/does not render <WhitePaper \/>/)
  })

  it('is not satisfied by a comment', () => {
    writeFileSync(
      path.join(root, WHITE_PAPER_ROUTE),
      [
        "// import { WhitePaper } from '../components/WhitePaper'",
        "// slug === 'dougmar-ch' ? <WhitePaper /> : null",
        "import { CaseStudy } from '../components/generated/CaseStudy'",
        'export const Route = { component: CaseStudy }',
      ].join('\n')
    )
    expect(run().join('\n')).toMatch(/does not render <WhitePaper \/>/)
  })

  it('rejects a generated component that wraps it', () => {
    writeFileSync(
      path.join(root, 'app/components/generated/CaseStudy.tsx'),
      [
        "import { WhitePaper } from '../WhitePaper'",
        'export function CaseStudy() {',
        '  return <section><WhitePaper /></section>',
        '}',
      ].join('\n')
    )
    expect(run().join('\n')).toMatch(
      /generated\/CaseStudy\.tsx: imports app\/components\/WhitePaper\.tsx/
    )
  })

  it('does not mistake a generated WhitePaperSection import for the owner', () => {
    // The name the engineer used before #533. Dead weight, but not this finding.
    writeFileSync(
      path.join(root, 'app/components/generated/CaseStudy.tsx'),
      "import { X } from './WhitePaperSection'\nexport function CaseStudy() {\n  return <X />\n}\n"
    )
    writeFileSync(
      path.join(root, 'app/components/generated/WhitePaperSection.tsx'),
      'export function X() {\n  return null\n}\n'
    )
    expect(run()).toEqual([])
  })

  it('rejects an owner file that is no longer the template', () => {
    writeFileSync(
      path.join(root, WHITE_PAPER_OWNER),
      'export function WhitePaper() {\n  return <article>tonight</article>\n}\n'
    )
    expect(run().join('\n')).toMatch(
      /app\/components\/WhitePaper\.tsx: differs from scripts\/templates\/WhitePaper\.tsx\.template/
    )
  })

  it('rejects a missing owner file', () => {
    rmSync(path.join(root, WHITE_PAPER_OWNER))
    expect(run().join('\n')).toMatch(/app\/components\/WhitePaper\.tsx: missing/)
  })

  it('says nothing when the route itself is absent, which is another check', () => {
    rmSync(path.join(root, WHITE_PAPER_ROUTE))
    expect(checkWhitePaper({ root, sources: [] })).toEqual([])
  })
})

describe('renderWhitePaperFile', () => {
  const source = renderWhitePaperFile()
  const code = stripComments(source)

  it('renders the template verbatim, and the tracked component is that render', () => {
    expect(source).toBe(readFileSync(TEMPLATE, 'utf8'))
    expect(readFileSync(path.resolve(process.cwd(), WHITE_PAPER_OWNER), 'utf8')).toBe(source)
  })

  it('names a slug that app/content/projects.ts still has', () => {
    expect(projects.map((p) => p.slug)).toContain(WHITE_PAPER_SLUG)
  })

  it('takes its colours from the frozen semantic set and nowhere else', () => {
    const colourProps = /\b(?:color|bg|borderColor|outlineColor|textDecorationColor):\s*'([^']+)'/g
    const used = [...code.matchAll(colourProps)].map((m) => m[1])
    expect(used.length).toBeGreaterThan(10)
    for (const name of used) expect(SEMANTIC_COLOR_NAMES, name).toContain(name)
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })

  it('names only the two font tokens every chassis defines', () => {
    const faces = new Set([...code.matchAll(/fontFamily:\s*'([^']+)'/g)].map((m) => m[1]))
    expect([...faces].sort()).toEqual(['body', 'display'])
  })

  it('sets every size as a literal, so the chassis ramp cannot move the hierarchy', () => {
    const sizes = [...code.matchAll(/(?:fontSize|base|md|lg):\s*'([^']+)'/g)].map((m) => m[1])
    for (const step of [
      '2xs',
      'xs',
      'sm',
      'lede',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      'hero',
    ]) {
      expect(sizes, step).not.toContain(step)
    }
    expect(code).not.toContain('textStyle')
  })

  it('keeps every css() call at module scope, where Panda can extract it', () => {
    const body = code.slice(
      code.indexOf('export function WhitePaper'),
      code.indexOf('const articleClass')
    )
    expect(body).not.toContain('css(')
    expect(code).not.toMatch(/style=\{/)
  })
})

describe('<WhitePaper>', () => {
  const html = renderToStaticMarkup(createElement(WhitePaper))
  const paper = projects.find((p) => p.slug === WHITE_PAPER_SLUG)
  const asHtml = (s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')

  it('renders every field of the project, as written', () => {
    for (const text of [paper.context, paper.problem, paper.approach, paper.outcome]) {
      expect(html).toContain(asHtml(text))
    }
    for (const c of paper.constraints) expect(html).toContain(asHtml(c))
    for (const d of paper.decisions) {
      expect(html).toContain(asHtml(d.decision))
      expect(html).toContain(asHtml(d.why))
    }
    for (const s of paper.stack) expect(html).toContain(asHtml(s))
  })

  it('numbers the phases in order inside one ordered list', () => {
    const list = html.slice(html.indexOf('<ol'), html.indexOf('</ol>'))
    expect(list.match(/<li/g)).toHaveLength(paper.process.length)
    const positions = paper.process.map((step) => list.indexOf(`>${asHtml(step.phase)}</h3>`))
    expect(positions.every((p) => p > 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    expect(list).toContain('>01<')
    expect(list).toContain(`>${String(paper.process.length).padStart(2, '0')}<`)
  })

  it('links every reference, and leaves the h1 to the route', () => {
    for (const ref of paper.references) expect(html).toContain(`href="${ref.url}"`)
    expect(html).not.toContain('<h1')
    expect(html.match(/<h2/g)).toHaveLength(8)
  })
})
