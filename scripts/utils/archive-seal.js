/**
 * Seal an archived page: rewrite the links that escape it, and put a frame on top.
 *
 * Implements #156 (escape vectors) and #158 (frame) as one pass, because both
 * rewrite the same bytes and neither is worth a second traversal of 1,041 pages.
 *
 * Two rules govern everything here:
 *
 * 1. Rewrite attribute values, never document text. Some snapshots print the
 *    site's own URL as the visible text of a link. A string replace would edit
 *    what the design says, not where it points.
 *
 *    (The corpus was scrubbed of the old `doug-march.com` host on 2026-08-29 at
 *    Doug's direction — visible text included — so archived pages now render
 *    `dougmar.ch` on days that predate it. That was a deliberate choice of
 *    consistency over fidelity; this rule still governs how the seal behaves.)
 *
 * 2. A sealed page cannot run script. `/assets/*.js` is 404 in every snapshot
 *    and the theme-init script does not survive capture, so the frame is HTML
 *    and CSS or it is nothing.
 */

import { CANONICAL_ORIGIN, matchOrigin } from './site-origin.js'

/** Marks an injected frame so a second run replaces it instead of stacking one on top. */
export const FRAME_MARKER = 'data-archive-frame'

/**
 * Absolute paths a sealed page is allowed to keep. Both are deliberate exits.
 *
 * `/archive` is the calendar, and 93 snapshots already link to it — it is where
 * a visitor is meant to go. `/how` is introduced by the frame.
 */
export const ESCAPE_ALLOWLIST = ['/archive', '/how']

/**
 * Absolute site paths mapped to their in-snapshot equivalent.
 *
 * `/work` is the interesting one. No snapshot contains `work.html`, and none of
 * the six dates carrying the link define an `id="work"` anchor, so the nav item
 * has no destination inside the capture. `index.html` is the least-wrong answer:
 * it keeps the visitor in the day they are reading.
 */
const PATH_MAP = new Map([
  ['/', 'index.html'],
  ['/work', 'index.html'],
  ['/about', 'about.html'],
  ['/contact', 'index.html'],
  ['/experiments', 'index.html'],
])

/** `work/politweets.html` sits one level down and needs `../` on everything. */
export function depthOf(relPath) {
  return relPath.split('/').length - 1
}

function isAllowed(path) {
  return ESCAPE_ALLOWLIST.some((ok) => path === ok || path.startsWith(`${ok}/`))
}

/**
 * Map one absolute URL onto its in-snapshot target.
 * Returns null to leave the value untouched.
 */
export function resolveHref(value, { prefix }) {
  let path = value

  const origin = matchOrigin(path)
  if (origin) {
    path = path.slice(origin.length) || '/'
  } else if (!path.startsWith('/')) {
    // Already document-relative, a fragment, a mailto:, or another origin.
    return null
  }

  if (isAllowed(path)) return null

  const hash = path.indexOf('#')
  const bare = hash === -1 ? path : path.slice(0, hash)
  const frag = hash === -1 ? '' : path.slice(hash)

  // /work/<slug> is the one absolute path with a real file behind it.
  const workMatch = /^\/work\/([A-Za-z0-9_-]+)\/?$/.exec(bare)
  if (workMatch) return `${prefix}work/${workMatch[1]}.html${frag}`

  const mapped = PATH_MAP.get(bare.replace(/\/$/, '') || '/')
  if (mapped) return `${prefix}${mapped}${frag}`

  // An absolute path nothing claims. Send it home rather than to the live site.
  return `${prefix}index.html${frag}`
}

/**
 * Rewrite every href that would walk the visitor out of the snapshot.
 *
 * Scoped to the attribute so document text is never touched.
 */
export function rewriteLinks(html, { prefix }) {
  return html.replace(/href="([^"]*)"/g, (whole, value) => {
    const next = resolveHref(value, { prefix })
    return next === null ? whole : `href="${next}"`
  })
}

/**
 * Drop `<link rel="modulepreload">`.
 *
 * All 3,611 of them point at `/assets/*.js` that 404s in every snapshot — the
 * bundles were never captured. They are unreachable by a visitor and cannot be
 * made to work, so they are dead weight and the last thing standing between the
 * corpus and a literal "no absolute paths" seal test.
 */
export function stripDeadPreloads(html) {
  return html.replace(/<link\b[^>]*\brel="modulepreload"[^>]*>/g, '')
}

/**
 * Point `og:url` at the snapshot's own archive URL, and drop the image meta.
 *
 * 123 of 135 `og:image` URLs already 404. A share card that resolves to a
 * missing image on today's domain is worse than no card.
 */
export function rewriteMeta(html, { date }) {
  return html
    .replace(
      /<meta\b[^>]*\b(?:property|name)="og:url"[^>]*>/g,
      `<meta property="og:url" content="${CANONICAL_ORIGIN}/archive/${date}/">`
    )
    .replace(/<meta\b[^>]*\b(?:property|name)="(?:og:image|twitter:image)(?::[a-z]+)?"[^>]*>/g, '')
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function longDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** "Sep 19": the phone rail has no room for the month spelled out or the year. */
function shortDate(date) {
  const [, m, d] = date.split('-').map(Number)
  return `${MONTHS[m - 1].slice(0, 3)} ${d}`
}

/**
 * The rail.
 *
 * Full-width and top-anchored because it is the only variant that never covers
 * content: a bottom pill sits on the footer, a hover-reveal sits on the masthead.
 * The ground is opaque enough to read on all 18 light and 100 dark snapshots.
 *
 * Every property is stated outright. The page's own CSS styles bare `a` and
 * `nav` and cannot be allowed to reach in.
 *
 * Phones (#562). Up to 640px every control is at least 44px square and fills
 * the rail's height; the hairline moves from a border to an inset shadow so
 * the rail's content box is the full 44px. Under 480px the date and the
 * explainer link each carry a short form ("Sep 19", "How") next to the long
 * one, and CSS picks. With the short forms the rail needs about 300px. The
 * long forms needed 413px before the targets grew, so "How it was made" ran off
 * the right edge of a 320 to 390px screen. The link keeps its full accessible
 * name through `aria-label`. The rail has no script, so both forms are always
 * in the markup.
 */
export function buildFrame({ date, prev, next }) {
  const arrow = (target, label, glyph) =>
    target
      ? `<a class="af-x" href="/archive/${target}/" rel="nofollow" title="${escapeHtml(label)} — ${escapeHtml(target)}">${glyph}</a>`
      : `<span class="af-x af-off" aria-hidden="true">${glyph}</span>`

  return `<div ${FRAME_MARKER}="${escapeHtml(date)}" role="banner">
<style>
[${FRAME_MARKER}]{position:fixed;top:0;left:0;right:0;z-index:2147483647;height:44px;box-sizing:border-box;display:flex;align-items:center;gap:16px;padding:0 16px;background:rgba(14,14,16,.92);-webkit-backdrop-filter:saturate(140%) blur(8px);backdrop-filter:saturate(140%) blur(8px);border-bottom:1px solid rgba(255,255,255,.14);font:500 13px/1 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#f4f4f5;letter-spacing:.01em;text-rendering:optimizeLegibility}
[${FRAME_MARKER}] *{box-sizing:border-box;margin:0;padding:0;font:inherit;color:inherit;letter-spacing:inherit;text-transform:none;text-shadow:none;background:none;border:0;float:none;position:static}
[${FRAME_MARKER}] a{text-decoration:none;color:#f4f4f5;border-radius:5px;transition:background 120ms ease,color 120ms ease}
[${FRAME_MARKER}] a:hover{background:rgba(255,255,255,.14);color:#fff}
[${FRAME_MARKER}] .af-home{font-weight:600;padding:5px 9px;margin-left:-9px;white-space:nowrap}
[${FRAME_MARKER}] .af-nav{display:flex;align-items:center;gap:2px}
[${FRAME_MARKER}] .af-x{display:flex;align-items:center;justify-content:center;width:26px;height:26px;font-size:15px;line-height:1}
[${FRAME_MARKER}] .af-off{opacity:.28}
[${FRAME_MARKER}] .af-date{font-variant-numeric:tabular-nums;white-space:nowrap}
[${FRAME_MARKER}] .af-note{color:rgba(244,244,245,.62);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[${FRAME_MARKER}] .af-how{margin-left:auto;padding:5px 10px;white-space:nowrap;border:1px solid rgba(255,255,255,.24)}
[${FRAME_MARKER}] .af-short{display:none}
@media (max-width:640px){[${FRAME_MARKER}]{gap:10px;padding:0 8px;font-size:12px;border-bottom:0;box-shadow:inset 0 -1px 0 rgba(255,255,255,.14)}[${FRAME_MARKER}] .af-note{display:none}[${FRAME_MARKER}] .af-home{display:flex;align-items:center;align-self:stretch;min-width:44px;margin-left:0;padding:0 10px}[${FRAME_MARKER}] .af-x{width:44px;height:44px}[${FRAME_MARKER}] .af-how{position:relative;display:flex;align-items:center;justify-content:center;align-self:stretch;min-width:44px;padding:0 10px;border:0}[${FRAME_MARKER}] .af-how::before{content:"";position:absolute;top:8px;right:0;bottom:8px;left:0;border:1px solid rgba(255,255,255,.24);border-radius:5px}}
@media (max-width:479px){[${FRAME_MARKER}] .af-long{display:none}[${FRAME_MARKER}] .af-short{display:inline}}
html{scroll-padding-top:52px}
body{padding-top:44px!important}
</style>
<a class="af-home" href="/archive" rel="nofollow">&larr; Archive</a>
<span class="af-nav">${arrow(prev, 'Previous build', '&lsaquo;')}${arrow(next, 'Next build', '&rsaquo;')}</span>
<span class="af-date"><span class="af-long">${escapeHtml(longDate(date))}</span><span class="af-short">${escapeHtml(shortDate(date))}</span></span>
<span class="af-note">Archived design &mdash; not the current site</span>
<a class="af-how" href="/how/${escapeHtml(date)}" rel="nofollow" aria-label="How it was made"><span class="af-long">How it was made</span><span class="af-short">How</span></a>
</div>`
}

/**
 * Remove a previously injected frame, so sealing twice is the same as sealing once.
 *
 * The frame is generated here and contains no nested `<div>`, so the first
 * closing tag after the marker is its own. Repeated in a loop because an
 * earlier buggy run could have stacked more than one.
 */
export function stripFrame(html) {
  let out = html
  for (;;) {
    const open = out.indexOf(`<div ${FRAME_MARKER}=`)
    if (open === -1) return out
    const close = out.indexOf('</div>', open)
    if (close === -1) return out
    out = out.slice(0, open) + out.slice(close + '</div>'.length)
  }
}

/**
 * Seal one page. Idempotent: running it on already-sealed HTML is a no-op.
 *
 * @param {string} html   the captured page
 * @param {object} ctx
 * @param {string} ctx.date     the date this snapshot belongs to
 * @param {string} ctx.relPath  path within the snapshot, e.g. `work/spaceman.html`
 * @param {string|null} ctx.prev  previous built date, or null at the far end
 * @param {string|null} ctx.next  next built date, or null at the near end
 */
export function sealPage(html, { date, relPath, prev = null, next = null }) {
  const prefix = '../'.repeat(depthOf(relPath))

  let out = stripFrame(html)
  out = stripDeadPreloads(out)
  out = rewriteMeta(out, { date })
  out = rewriteLinks(out, { prefix })

  const frame = buildFrame({ date, prev, next })
  const bodyOpen = /<body\b[^>]*>/i.exec(out)
  if (bodyOpen) {
    const at = bodyOpen.index + bodyOpen[0].length
    out = out.slice(0, at) + frame + out.slice(at)
  } else {
    out = frame + out
  }
  return out
}
