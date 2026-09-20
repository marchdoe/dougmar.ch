/**
 * The white paper's fixed page, as code (#533).
 *
 * /work/dougmar-ch is the argument the site rests on and the page most likely
 * to be linked from outside, and it was redesigned every night with the rest.
 * The owner's decision: the layout holds still and the colours and typefaces
 * follow the day. So unlike /archive it has no token scale of its own. The
 * component is built from the fifteen frozen semantic colours and the two
 * font tokens every chassis defines, and everything else in it is a literal.
 *
 *   WHITE_PAPER_OWNER     app/components/WhitePaper.tsx, which no agent writes
 *   WHITE_PAPER_ROUTE     the one file that renders it
 *   WHITE_PAPER_SLUG      the project it renders
 *   renderWhitePaperFile  the component source, written by the orchestrator
 *                         every run the way Material.tsx is
 *   checkWhitePaper       the validator's half: the route renders it for the
 *                         slug, nothing else imports it, and the file on disk
 *                         is still the template
 *
 * The route is the engineer's and is rewritten nightly, which is why the
 * check exists: a fixed component nobody renders is not a fixed page.
 *
 * @module
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { stripComments } from './token-gate.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = resolve(__dirname, '../templates/WhitePaper.tsx.template')

/** The one file that lays out the white paper. */
export const WHITE_PAPER_OWNER = 'app/components/WhitePaper.tsx'

/** The one file that renders it. */
export const WHITE_PAPER_ROUTE = 'app/routes/work.$slug.tsx'

/** The project it renders, from app/content/projects.ts. */
export const WHITE_PAPER_SLUG = 'dougmar-ch'

/**
 * Render `app/components/WhitePaper.tsx`.
 *
 * Same pattern as `renderMaterialFile`: the template takes no inputs, the
 * orchestrator writes it every run, and it is read fresh on each call so a
 * dev loop sees edits without a node restart. The slug is checked here so the
 * template and this module cannot drift apart.
 *
 * @returns {string} TSX source
 */
export function renderWhitePaperFile() {
  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  if (!template.includes(`'${WHITE_PAPER_SLUG}'`)) {
    throw new Error(`WhitePaper.tsx.template does not name the slug '${WHITE_PAPER_SLUG}'`)
  }
  return template
}

const IMPORTS_OWNER = /from\s+['"][^'"]*\/WhitePaper['"]/
const RENDERS_OWNER = /<WhitePaper[\s/>]/

/**
 * The three ways the fixed page stops being fixed.
 *
 * `sources` is the reachable tree as `[repo-relative path, source]` pairs, the
 * same shape the lockup rules scan. A route absent from it is not reported:
 * a missing required file is Check 1's finding, and saying it twice would
 * hand the engineer's retry two messages about one fault.
 *
 * @param {{ root: string, sources: Array<[string, string]> }} input
 * @returns {string[]} one message per finding
 */
export function checkWhitePaper({ root, sources }) {
  const errors = []
  const route = sources.find(([rel]) => rel === WHITE_PAPER_ROUTE)
  if (!route) return errors

  const routeSource = stripComments(route[1])
  const namesSlug =
    routeSource.includes(`'${WHITE_PAPER_SLUG}'`) || routeSource.includes(`"${WHITE_PAPER_SLUG}"`)
  if (!IMPORTS_OWNER.test(routeSource) || !RENDERS_OWNER.test(routeSource) || !namesSlug) {
    errors.push(
      `${WHITE_PAPER_ROUTE}: does not render <WhitePaper /> for the '${WHITE_PAPER_SLUG}' slug. ` +
        `That page's layout is owned by ${WHITE_PAPER_OWNER}. Import it with ` +
        "`import { WhitePaper } from '../components/WhitePaper'` and return it in place of the " +
        `case study body when \`slug === '${WHITE_PAPER_SLUG}'\`.`
    )
  }

  for (const [rel, source] of sources) {
    if (rel === WHITE_PAPER_ROUTE || rel === WHITE_PAPER_OWNER) continue
    if (IMPORTS_OWNER.test(stripComments(source))) {
      errors.push(
        `${rel}: imports ${WHITE_PAPER_OWNER}. Only ${WHITE_PAPER_ROUTE} renders the white paper, ` +
          'directly and unwrapped. Remove the import.'
      )
    }
  }

  let onDisk = null
  try {
    onDisk = readFileSync(resolve(root, WHITE_PAPER_OWNER), 'utf8')
  } catch {}
  if (onDisk === null) {
    errors.push(`${WHITE_PAPER_OWNER}: missing. The orchestrator writes it from its template.`)
  } else if (onDisk.trim() !== renderWhitePaperFile().trim()) {
    errors.push(
      `${WHITE_PAPER_OWNER}: differs from scripts/templates/WhitePaper.tsx.template. ` +
        'No agent writes this file. Do not emit it.'
    )
  }

  return errors
}
