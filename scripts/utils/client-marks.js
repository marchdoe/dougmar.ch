/**
 * The client marks, as the Mockup Designer receives them (#505).
 *
 * `app/content/projects.ts` points each client at a file under
 * `public/clients/`, and the built site renders that path as
 * `<img src="/clients/rolex.svg">`. The mockup is captured from a `file://`
 * URL (snapshot.js captureHtmlFileScreenshot), where a root-relative path
 * resolves to nothing, so the SVG marks are read here and handed to the
 * designer as inline source, the way the brand mark already is. A raster
 * mark (Framebridge's PNG) has no source to inline and is listed by name.
 *
 * @module
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { ROOT } from './file-manager.js'

/**
 * Every `{ name, logo }` pair in projects.ts, in file order.
 *
 * Regex over the source rather than an import, the same idiom
 * site-context.js uses: the content file is TypeScript and this is a plain
 * script.
 *
 * @param {string} source contents of app/content/projects.ts
 * @returns {Array<{ name: string, logo: string }>}
 */
export function parseClientLogos(source) {
  const out = []
  const re = /name:\s*'([^']+)'\s*,\s*logo:\s*'(\/clients\/[^']+)'/g
  for (const [, name, logo] of source.matchAll(re)) out.push({ name, logo })
  return out
}

/**
 * The marks with inlinable source.
 *
 * @param {{ root?: string }} [opts]
 * @returns {Array<{ name: string, logo: string, svg: string|null }>} svg is
 *   null for a mark that is not an SVG or whose file is missing
 */
export function readClientMarkSources({ root = ROOT } = {}) {
  const projectsPath = path.join(root, 'app/content/projects.ts')
  if (!existsSync(projectsPath)) return []
  const logos = parseClientLogos(readFileSync(projectsPath, 'utf8'))
  return logos.map(({ name, logo }) => {
    const file = path.join(root, 'public', logo)
    const svg = logo.endsWith('.svg') && existsSync(file) ? readFileSync(file, 'utf8').trim() : null
    return { name, logo, svg }
  })
}

/**
 * The "Client Marks" section of the Mockup Designer's user prompt. Empty
 * when there is nothing to inline.
 *
 * @param {Array<{ name: string, logo: string, svg: string|null }>} marks
 * @returns {string}
 */
export function formatClientMarksForPrompt(marks) {
  if (!marks?.length) return ''
  const lines = [
    '## Client Marks (inline SVG source; paste, never redraw)',
    '',
    'The built site renders these as `<img src={client.logo}>` from `public/clients/`. The mockup is captured from a file:// URL where that path resolves to nothing, so paste each mark below as an inline `<svg>` where the design shows it, strip its `width` and `height` attributes and size it with CSS. A client listed without source has no SVG; set it as its name.',
    '',
  ]
  for (const { name, logo, svg } of marks) {
    if (svg) {
      lines.push(`### ${name} (\`${logo}\`)`, '', '```html', svg, '```', '')
    } else {
      lines.push(`### ${name} (\`${logo}\`, no SVG source; render the name)`, '')
    }
  }
  return lines.join('\n').trimEnd()
}
