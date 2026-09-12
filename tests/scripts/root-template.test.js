/**
 * Everything the suite asserts about the root route, in one place.
 *
 * `app/routes/__root.tsx` is regenerated from
 * `scripts/templates/__root.tsx.template` on every build. Three files used to
 * read those two sources for overlapping checks (#229): one for the security
 * gate and archive structure, one for the archive link the template renders,
 * one for the 404 copy. They are one file now, reading each source once.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { renderRootTemplate } from '../../scripts/utils/chassis.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8')

const TEMPLATE_PATH = 'scripts/templates/__root.tsx.template'
const GENERATED_PATH = 'app/routes/__root.tsx'
const template = read(TEMPLATE_PATH)
const generated = read(GENERATED_PATH)
const notFoundPage = read('public/404.html')

// ─── The security gate ───────────────────────────────────────────────────────
//
// The generated file is checked by scripts/utils/build-validator.js like any
// agent-authored file. A pattern that is ordinary in hand-written React — the
// escape hatch for injecting raw HTML — fails that gate outright. This was
// first caught by running the pipeline, after the React Engineer had already
// done its work; the feedback loop for that class of mistake was a day long.
//
// Mirrors the DANGEROUS_PATTERNS list in the validator. Kept as a copy rather
// than an import because the validator reads files from disk and reports on
// the whole generated set; here the subject is these two files specifically,
// including the template, which the validator never sees. The gate matches
// bare words anywhere in a file, comments included, so the banned patterns
// cannot be named in prose here either.
const BANNED = [
  { name: 'raw HTML injection prop', regex: /dangerously{0,1}SetInnerHTML/ },
  { name: 'document write', regex: /document\.write\s*\(/ },
  { name: 'innerHTML assignment', regex: /\.innerHTML\s*=/ },
  { name: 'inline script tag', regex: /<script[\s>]/i },
  { name: 'javascript URL', regex: /javascript:/i },
  { name: 'eval', regex: /\beval\s*\(/ },
  { name: 'dynamic import', regex: /\bimport\s*\(\s*[`'"]/ },
]

describe.each([
  [TEMPLATE_PATH, template],
  [GENERATED_PATH, generated],
])('%s', (_rel, src) => {
  it.each(BANNED.map((b) => [b.name, b.regex]))(
    'carries no %s, which the build validator blocks',
    (_name, regex) => {
      expect(regex.test(src)).toBe(false)
    }
  )

  it('still paints the archive ground, which is why the style element exists', () => {
    expect(src).toContain('body{background:#0e0e10')
    expect(src).toMatch(/<style>\{ARCHIVE_GROUND\}<\/style>/)
  })

  it('still lets the archive out of the nightly shell', () => {
    expect(src).toContain('isArchiveSurface')
    expect(src).toContain('<RootDocument bare>')
  })

  it('still carries the archive link for every other page', () => {
    expect(src).toContain('data-archive-link')
  })
})

describe('the template and the generated file agree', () => {
  it('on the structural pieces, differing only where the build substitutes a value', () => {
    for (const marker of [
      'isArchiveSurface',
      '<RootDocument bare>',
      'ARCHIVE_GROUND',
      'ARCHIVE_FONT',
    ]) {
      expect(template, `template missing ${marker}`).toContain(marker)
      expect(generated, `generated missing ${marker}`).toContain(marker)
    }
  })

  it("on the 404 block — if they drift, tonight's build silently reverts the edit", () => {
    const block = (src) =>
      src.slice(src.indexOf('notFoundComponent'), src.indexOf('component: RootComponent'))
    expect(block(generated)).toBe(block(template))
  })
})

// ─── The default title, and no default canonical (#327) ─────────────────────
//
// Every route used to fall back to whatever the shell's `head()` carried, and
// the shell carried no `<title>` at all — a shared or crawled /archive or
// /how/<date> showed the home page's card. The shell now always carries a
// title (via the {{OG_META}} block — buildOgMetaEntries leads with a plain
// `{ title: ... }` entry, and TanStack dedupes `title` the same way it
// dedupes `meta`, so a child route's own title always overrides it).
//
// The shell does NOT get a default canonical link. A canonical pointing at
// the home page is wrong for every route that still serves the shell
// (/about, /work/<slug>, /panel, …) — there is no single default that is
// right for all of them, so the shell carries none. /archive and
// /how/$date, the two routes that are prerendered into their own HTML,
// declare their own canonical instead.

describe.each([
  [TEMPLATE_PATH, template],
  [GENERATED_PATH, generated],
])('%s (#327)', (_rel, src) => {
  it('carries no canonical link — there is no default that is right for every shell route', () => {
    expect(src).not.toContain('canonical')
  })
})

describe('app/routes/__root.tsx carries a default title (#327)', () => {
  it('emits a title in its head() meta, from the OG_META block', () => {
    expect(generated).toMatch(/head:\s*\(\)\s*=>/)
    expect(generated).toMatch(/\{\s*title:/)
  })
})

// ─── The archive link (#155) ─────────────────────────────────────────────────
//
// The link silently disappeared for sixteen builds when the page shell became
// a declared Art Director choice. It now lives in the root template, outside
// <Layout>, where no agent can delete it.

describe('every import the template declares is one it uses', () => {
  // `import { styled }` sat unused at the top of this template. Nothing caught
  // it: Biome has noUnusedImports at "warn", so `biome --write` leaves it and
  // lint stays green — but `tsc --noEmit` fails TS6133, and the orchestrator
  // regenerates __root.tsx from this template on EVERY run. So first-pass
  // static checks failed every night on an orchestrator typo, and Phase 5
  // spent its single React Engineer retry undoing it before any real agent
  // mistake could be looked at. The retry budget was not one, it was zero.
  //
  // Asserted against the template rather than the generated file because the
  // template is the source; the generated file is only ever as good as this.
  const importedNames = [
    ...template.matchAll(/^import\s+(?:type\s+)?(?:\{([^}]*)\}|(\w+))\s+from/gm),
  ]
    .flatMap(([, braced, bare]) =>
      braced
        ? braced.split(',').map((n) =>
            n
              .trim()
              .split(/\s+as\s+/)
              .pop()
              .trim()
          )
        : [bare]
    )
    .filter(Boolean)

  const body = template
    .split('\n')
    .filter((line) => !line.startsWith('import'))
    .join('\n')

  it('finds the imports it is meant to be checking', () => {
    // Guards the parser itself: a regex that silently matches nothing would
    // make every assertion below vacuously true.
    expect(importedNames).toContain('createRootRoute')
    expect(importedNames).toContain('Layout')
    expect(importedNames.length).toBeGreaterThan(5)
  })

  it.each(importedNames.map((name) => [name]))('uses %s', (name) => {
    expect(new RegExp(`\\b${name}\\b`).test(body)).toBe(true)
  })
})

describe('renderRootTemplate — the archive link', () => {
  it('substitutes the count into the rendered source', () => {
    const src = renderRootTemplate('https://fonts.example/x', '', 123)
    expect(src).toContain('Archive — 123 designs')
    expect(src).not.toContain('{{ARCHIVE_COUNT}}')
  })

  it('renders the link outside <Layout>, where no agent can delete it', () => {
    const src = renderRootTemplate('https://fonts.example/x', '', 7)
    const layoutClose = src.indexOf('</Layout>')
    const link = src.indexOf('data-archive-link')
    expect(layoutClose).toBeGreaterThan(-1)
    expect(link).toBeGreaterThan(layoutClose)
  })

  it('points at /archive', () => {
    expect(renderRootTemplate('u', '', 1)).toContain('href="/archive"')
  })

  it('defaults the count rather than leaving a raw placeholder', () => {
    expect(renderRootTemplate('u')).toContain('Archive — 0 designs')
  })

  it('the template still carries every placeholder the renderer fills', () => {
    // Guards against a future template edit silently dropping one.
    for (const p of ['{{ARCHIVE_COUNT}}', '{{OG_META}}', '{{GOOGLE_FONTS_URL}}']) {
      expect(template).toContain(p)
    }
  })

  it('uses only tokens that survive a nightly preset rewrite', () => {
    // textMuted is absent from ~1 preset in 5; text/bg/accent are near-universal.
    const block = template.slice(
      template.indexOf('const archiveLink'),
      template.indexOf('export const Route')
    )
    expect(block).not.toContain('textMuted')
    expect(block).not.toContain('textSecondary')
    expect(block).toContain("color: 'text'")
    expect(block).toContain("background: 'bg'")
  })
})

// ─── The 404 copy (#199, #200) ───────────────────────────────────────────────
//
// It lives in two places and has to stay identical. `public/404.html` is what
// Vercel serves for a real 404 — a missing file under /og/ or /archive/, which
// #200 took out of the SPA catch-all. The `notFoundComponent` in the root
// route covers a mistyped in-app route, where the shell has already answered
// 200 and only the client knows the route is bogus. Neither can serve the
// other's case, so the duplication is structural — and it already rotted once,
// when elements.tsx carried a styled 404 under a comment claiming it matched
// __root.tsx long after __root.tsx had stopped shipping it.

const COPY = {
  code: '404',
  heading: 'The only page here that never changes.',
  body: 'Nothing lives at this address. Everything else on this site was redesigned last night.',
  link: '/archive',
}

describe('404 copy stays identical across every surface that renders it', () => {
  describe.each([
    ['public/404.html', notFoundPage],
    [GENERATED_PATH, generated],
    [TEMPLATE_PATH, template],
  ])('%s', (_file, src) => {
    it.each(Object.entries(COPY))('carries the %s', (_name, text) => {
      expect(src).toContain(text)
    })

    it('sends people to the archive, not home', () => {
      // "Return home" was the old copy. The archive is the destination now:
      // it is the thing that explains what this site is.
      expect(src).not.toContain('Return home')
    })
  })

  it('the static page reads no design token, so a broken nightly preset cannot take it down', () => {
    expect(notFoundPage).not.toMatch(/var\(--colors-|token\(/)
  })
})
