/**
 * The home page callout (#532).
 *
 * The site may not talk about itself: the Art Director prompt says so and
 * SELF_REFERENCE in copy-tells.js fails the build over it. One element is
 * allowed to, because no agent writes it. The copy is hand-written in
 * app/content/callout.ts, the component is rendered from a frozen template on
 * every run the way BrandLockup.tsx and Material.tsx are, and the engineer's
 * whole part is placing `<SiteCallout />` on the home page.
 *
 * The callout also carries home's link into the archive. __root.tsx renders
 * that link on every other page and skips it on `/`, so home says the idea
 * once. That puts home's archive link back in a file the engineer writes,
 * which is the arrangement #155 removed after the link went missing for
 * sixteen builds. `checkCalloutPlacement` is what makes the difference: a home
 * page without the callout fails the build gate and costs a repair round, where
 * in July it shipped.
 *
 * What lives here:
 *
 *   SITE_CALLOUT_OWNER      app/components/SiteCallout.tsx
 *   SITE_CALLOUT_CONTENT    app/content/callout.ts, the one content file the
 *                           copy gate does not report on
 *   renderSiteCalloutFile   the component, with the run's date and the archive
 *                           count written in
 *   checkCalloutPlacement   the build-validator rule for app/routes/index.tsx
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { stripComments } from './token-gate.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = resolve(__dirname, '../templates/SiteCallout.tsx.template')

export const SITE_CALLOUT_OWNER = 'app/components/SiteCallout.tsx'
export const SITE_CALLOUT_CONTENT = 'app/content/callout.ts'
export const HOME_ROUTE = 'app/routes/index.tsx'

const DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Render `app/components/SiteCallout.tsx` for a run.
 *
 * The date is the run's (`runDate(signals)`), not the wall clock: the line is
 * picked from it, and a rollback restores yesterday's file along with
 * yesterday's design, so the line and the design never disagree.
 *
 * @param {{ date: string, archiveCount?: number }} args
 * @returns {string} TSX source
 */
export function renderSiteCalloutFile({ date, archiveCount = 0 }) {
  if (!DATE.test(String(date))) {
    throw new Error(`SiteCallout needs a YYYY-MM-DD date, got: ${date}`)
  }
  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  for (const placeholder of ['{{DESIGN_DATE}}', '{{ARCHIVE_COUNT}}']) {
    if (!template.includes(placeholder)) {
      throw new Error(`SiteCallout.tsx.template missing ${placeholder} placeholder`)
    }
  }
  const count = Number.isInteger(archiveCount) && archiveCount >= 0 ? archiveCount : 0
  return template.replaceAll('{{DESIGN_DATE}}', date).replaceAll('{{ARCHIVE_COUNT}}', String(count))
}

/**
 * Whether the home route places the callout.
 *
 * Two things, both read off app/routes/index.tsx with comments stripped: the
 * import names the orchestrator's file, and the JSX renders it. The import is
 * checked because a `SiteCallout` the engineer wrote under
 * app/components/generated/ would satisfy the render test and carry copy no
 * one approved.
 *
 * The message is handed to the React Engineer's repair round verbatim, so it
 * says what to type and where.
 *
 * @param {string|null} indexSource contents of app/routes/index.tsx
 * @returns {string[]} errors, empty when the callout is placed
 */
export function checkCalloutPlacement(indexSource) {
  const source = stripComments(indexSource ?? '')
  const imported =
    /import\s*\{[^}]*\bSiteCallout\b[^}]*\}\s*from\s*['"]\.\.\/components\/SiteCallout['"]/.test(
      source
    )
  const rendered = /<SiteCallout[\s/>]/.test(source)
  if (imported && rendered) return []
  return [
    `${HOME_ROUTE}: does not render <SiteCallout />. It is the home page's only link to the ` +
      `white paper and to /archive, and ${SITE_CALLOUT_OWNER} is written by the orchestrator. ` +
      `Add \`import { SiteCallout } from '../components/SiteCallout'\` and render ` +
      `<SiteCallout /> in ${HOME_ROUTE} between the hero and the footer, never inside the hero. ` +
      'It takes no props. Do not write your own component of that name.',
  ]
}
