/**
 * Build the OG/twitter meta entries injected into the {{OG_META}}
 * placeholder of scripts/templates/__root.tsx.template. Returns TSX
 * source — object literals joined by newlines, each ending in a comma —
 * shaped for TanStack's head() meta array.
 *
 * The first entry is a plain `{ title: ... }` tag, not just `og:title` —
 * this is the one place the day's title is written, and it is also the
 * shell's default `<title>` (#327). A route that wants its own title (the
 * archive, an explainer page) declares one in its own head(); TanStack
 * dedupes `title` tags the same way it dedupes `meta`, last match wins, so
 * the child's title overrides this one without either file knowing about
 * the other.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { CANONICAL_ORIGIN } from '../../shared/site-origin.js'

/**
 * @param {object} args
 * @param {string} args.date
 * @param {string} [args.heroCopy]
 * @param {string} [args.designBrief]
 * @param {string} [args.siteUrl]
 * @param {string} [args.root] repo root. When given, the entry names
 *   default.png unless `public/og/<date>.png` is actually on disk — the
 *   capture that produces it is best-effort and can fail (#399). Omitted by
 *   the two calls that write __root.tsx before that capture has run, since
 *   the file can't exist yet; the call after capture passes it.
 */
export function buildOgMetaEntries({
  date,
  heroCopy,
  designBrief,
  siteUrl = CANONICAL_ORIGIN,
  root,
}) {
  const title = JSON.stringify(heroCopy || 'Doug March')
  const description = JSON.stringify(
    designBrief || 'A multi-agent pipeline redesigns this site every morning.'
  )
  const hasImage = !root || existsSync(path.join(root, 'public', 'og', `${date}.png`))
  const image = JSON.stringify(`${siteUrl}/og/${hasImage ? `${date}.png` : 'default.png'}`)
  const url = JSON.stringify(siteUrl)
  return [
    `{ title: ${title} },`,
    `{ property: 'og:title', content: ${title} },`,
    `{ property: 'og:description', content: ${description} },`,
    `{ property: 'og:image', content: ${image} },`,
    `{ property: 'og:image:width', content: '1200' },`,
    `{ property: 'og:image:height', content: '630' },`,
    `{ property: 'og:url', content: ${url} },`,
    `{ property: 'og:type', content: 'website' },`,
    `{ name: 'twitter:card', content: 'summary_large_image' },`,
    `{ name: 'twitter:title', content: ${title} },`,
    `{ name: 'twitter:image', content: ${image} },`,
  ].join('\n        ')
}
