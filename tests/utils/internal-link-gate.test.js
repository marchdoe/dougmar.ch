/**
 * A link to a route that does not exist is invisible to every other gate.
 *
 * 2026-09-01 shipped a nav reading WORK / ABOUT / NOW. There is no `/now`
 * route, and because the nav lives in the shell, every page on the site
 * carried a link straight to the 404. The route rendered, the build compiled,
 * the token gate is about colour and spacing, and the surface gate only walks
 * routes it already knows exist — so nothing looked.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  internalHrefs,
  routeExists,
  knownRoutes,
  checkInternalLinks,
} from '../../scripts/utils/build-validator.js'

const routes = {
  static: ['/', '/about', '/archive', '/work', '/work/spaceman'],
  dynamic: ['/how/:date'],
}

describe('finding the links in a source file', () => {
  it('reads both spellings the tree uses', () => {
    const src = `<a href="/about">a</a><Link to="/work">w</Link>`
    expect(internalHrefs(src).sort()).toEqual(['/about', '/work'])
  })

  it('ignores links that are not ours to check', () => {
    const src = `
      <a href="https://dougmar.ch/x">ext</a>
      <a href="mailto:hello@dougmar.ch">mail</a>
      <a href="#contact">anchor</a>
    `
    expect(internalHrefs(src)).toEqual([])
  })

  it('skips template expressions rather than guessing at them', () => {
    // `/work/${slug}` is not a literal and cannot be resolved here. Reporting
    // it would be a false positive on correct code, and this gate blocks.
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal interpolation is the input under test.
    expect(internalHrefs('<a href={`/work/${slug}`}>d</a>')).toEqual([])
  })

  it('normalises a query, a hash and a trailing slash to the path', () => {
    expect(internalHrefs(`<a href="/about/?x=1#top">a</a>`)).toEqual(['/about'])
  })

  it('keeps the root as the root', () => {
    expect(internalHrefs(`<a href="/">home</a>`)).toEqual(['/'])
  })
})

describe('resolving a link against the routes that exist', () => {
  it('accepts a real route', () => {
    expect(routeExists('/about', routes)).toBe(true)
    expect(routeExists('/work/spaceman', routes)).toBe(true)
  })

  it('rejects the nav item that shipped', () => {
    expect(routeExists('/now', routes)).toBe(false)
  })

  it('accepts a pattern it cannot enumerate', () => {
    // One /how page per archived build; the dates are not a fixed list.
    expect(routeExists('/how/2026-09-01', routes)).toBe(true)
  })

  it('rejects an invented project even though a slug pattern could match it', () => {
    // The real slugs are enumerated, so `/work/:slug` is dropped from the
    // patterns. Without that, a link to a project that does not exist passes —
    // the same bug as /now wearing a different name.
    expect(routeExists('/work/invented', routes)).toBe(false)
  })

  it('does not match a pattern of the wrong depth', () => {
    expect(routeExists('/how/2026-09-01/extra', routes)).toBe(false)
    expect(routeExists('/how', routes)).toBe(false)
  })

  it('accepts /archive/… and /og/… as static passthroughs, not routes', () => {
    // vercel.json excludes both prefixes from the SPA rewrite and serves them
    // as literal files (sealed archive builds, OG images) — no route file
    // will ever match them, and none should have to.
    expect(routeExists('/archive/2026-08-30', routes)).toBe(true)
    expect(routeExists('/og/2026-08-30.png', routes)).toBe(true)
  })
})

/**
 * Seeds a minimal route tree on disk so `knownRoutes` and `checkInternalLinks`
 * read real files rather than a hand-built `routes` object.
 */
function seedRoutes() {
  const root = mkdtempSync(path.join(tmpdir(), 'internal-link-gate-'))
  const routesDir = path.join(root, 'app', 'routes')
  const contentDir = path.join(root, 'app', 'content')
  const componentsDir = path.join(root, 'app', 'components')
  mkdirSync(routesDir, { recursive: true })
  mkdirSync(contentDir, { recursive: true })
  mkdirSync(componentsDir, { recursive: true })

  writeFileSync(path.join(routesDir, '__root.tsx'), 'export function Root() { return null }\n')
  writeFileSync(path.join(routesDir, 'index.tsx'), 'export function Index() { return null }\n')
  writeFileSync(path.join(routesDir, 'about.tsx'), 'export function About() { return null }\n')
  writeFileSync(path.join(routesDir, 'archive.tsx'), 'export function Archive() { return null }\n')
  writeFileSync(path.join(routesDir, 'how.$date.tsx'), 'export function How() { return null }\n')
  writeFileSync(path.join(routesDir, 'work.$slug.tsx'), 'export function Work() { return null }\n')
  writeFileSync(
    path.join(contentDir, 'projects.ts'),
    "export const projects = [{ slug: 'spaceman' }, { slug: 'fishsticks' }]\n"
  )

  return { root, componentsDir }
}

describe('knownRoutes reads app/routes and app/content/projects.ts', () => {
  it('maps file routes and enumerates project slugs', () => {
    const { root } = seedRoutes()
    try {
      const result = knownRoutes(root)
      expect(result.static.sort()).toEqual(
        ['/', '/about', '/archive', '/work/spaceman', '/work/fishsticks'].sort()
      )
      // The real slugs are known, so the pattern is dropped.
      expect(result.dynamic).toEqual(['/how/:date'])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe('checkInternalLinks (#291/#398)', () => {
  let root
  let componentsDir

  beforeEach(() => {
    ;({ root, componentsDir } = seedRoutes())
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('catches a nav item pointing at a route that does not exist', () => {
    writeFileSync(
      path.join(componentsDir, 'Sidebar.tsx'),
      `export function Sidebar() {
        return (
          <nav>
            <a href="/work">Work</a>
            <a href="/about">About</a>
            <a href="/now">Now</a>
          </nav>
        )
      }\n`
    )
    const errors = checkInternalLinks({
      root,
      files: ['app/components/Sidebar.tsx'],
    })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('app/components/Sidebar.tsx -> /now')
  })

  it('does not flag a real slug, an enumerable-pattern date, /archive, an external URL, or a template literal', () => {
    writeFileSync(
      path.join(componentsDir, 'Sidebar.tsx'),
      `export function Sidebar({ slug }) {
        return (
          <nav>
            <a href="/work/spaceman">Spaceman</a>
            <a href="/how/2026-08-30">How</a>
            <a href="/archive">Archive</a>
            <a href="https://dougmar.ch/about">Mirror</a>
            <a href={\`/work/\${slug}\`}>Dynamic</a>
          </nav>
        )
      }\n`
    )
    const errors = checkInternalLinks({
      root,
      files: ['app/components/Sidebar.tsx'],
    })
    expect(errors).toEqual([])
  })
})
