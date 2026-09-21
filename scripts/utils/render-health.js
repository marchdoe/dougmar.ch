/**
 * Render health in the surface gate (#574).
 *
 * Three checks judged the engineer's work only after the paid run had ended:
 * `pnpm test:e2e:site` ran after `node scripts/daily-redesign.js`, and a
 * failure there kept the `publish` job from running. The night shipped
 * nothing, cost $4 to $5, and the engineer never heard why. A patch reply
 * that would have fixed it costs $0.03 to $0.20. The word-break check failed
 * three of the last five archived designs.
 *
 * - `word-break`: a word whose glyphs sit on more than one line (#530, #534).
 *   Measured at the phone and desktop rungs, at the viewport the rung names.
 * - `invisible-text`: text on screen that is painted in nothing (#525).
 *   Measured on the page after the scroll reveal, in the same state as the
 *   contrast walk.
 * - `stranded-text`: text left at `opacity: 0` once the reveal is taken away.
 *   The reveal is the failure, so this one needs a page loaded with reduced
 *   motion on. One extra visit per route, at the desktop rung in the light
 *   scheme, which is where the e2e spec runs it.
 *
 * The probes are `render-health-page.js`, called by this module and by
 * `tests/e2e/site-health.spec.ts`, which stays as the post-run backstop. This
 * module is the other half: the options, the wording, the owner of each
 * finding and the fold that keeps a bad night to a short brief. It runs in
 * Node and touches no page except through the probes.
 *
 * Text inside a part the orchestrator writes (see `ORCHESTRATOR_PARTS` in
 * `text-contrast.js`) is owned by 'human', so it is reported and never forces
 * a revision the engineer cannot make.
 *
 * @module
 */

import { WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  collectBrokenWords,
  collectInvisibleText,
  collectStrandedText,
} from './render-health-page.js'
import { collectTextContrast, REVEAL_SETTLE_MS, withRevealedPage } from './text-contrast-page.js'
import { ownerNote } from './text-contrast.js'

/**
 * Designs the owner chose to leave up with shredded words, keyed by the date
 * in the page's og:image, with the routes it shows on. The e2e spec marks
 * those routes `test.fail`, so CI keeps proving the check catches the day,
 * and the gate reports them as warnings, so the night does not revise a
 * design that was kept on purpose. An entry stops applying the night a new
 * design replaces it: delete entries once they are history.
 *
 * @type {Record<string, string[]>}
 */
export const KNOWN_SHREDS = {}

/**
 * Whether a design's shredded words were left up on purpose.
 *
 * @param {string} designDate the date in the page's og:image, or empty
 * @param {string} route
 * @param {Record<string, string[]>} [known]
 * @returns {boolean}
 */
export function isKnownShred(designDate, route, known = KNOWN_SHREDS) {
  return known[designDate]?.includes(route) ?? false
}

/** The rung and scheme the reduced-motion visit is made at: where the e2e spec runs it. */
export const STRANDED_RUNG = 'desktop'
export const STRANDED_SCHEME = 'light'

/**
 * Findings of each kind one owner sees from a whole run, after
 * deduplication. Six names the shape of a bad night; the rest are counted in
 * one closing line, as with contrast and the type-size floors.
 */
export const MAX_RENDER_HEALTH_REPORTED = 6

const KINDS = ['word-break', 'invisible-text', 'stranded-text']

export const WORD_BREAK_FIX =
  'Size the type to the column, or stack words with <br> or writing-mode. Drop to a ramp step ' +
  'that fits or give the type a wider track: overflow-wrap: anywhere and word-break: break-all ' +
  'only turn the overflow into a cut word.'

export const INVISIBLE_FIX =
  'Set the colour in a token, add a WebkitTextStroke, or clip a background to the text. A value ' +
  'passed to css() from a variable extracts to no rule (self-check 8).'

export const STRANDED_FIX =
  'Take opacity: 0 out of the base rule. The resting state is visible, and only the animation ' +
  "inside '@supports (animation-timeline: view())' starts an element hidden. A menu or panel " +
  'that starts closed hides with visibility: hidden or display: none, which this check skips.'

const times = (r) => (r.count > 1 ? ` (x${r.count})` : '')

/**
 * The words for one broken word, in the form the e2e failure lists it.
 *
 * @param {{ selector: string, word: string, sizePx: number, needsPx: number,
 *   boxPx: number, lines: number }} w
 * @returns {string}
 */
export function describeBrokenWord(w) {
  return (
    `<${w.selector}> "${w.word}" at ${w.sizePx}px needs ${w.needsPx}px, ` +
    `its box is ${w.boxPx}px, broken over ${w.lines} lines`
  )
}

/**
 * @param {{ selector: string, text: string, color: string, sizePx: number, count?: number }} t
 * @returns {string}
 */
export function describeInvisibleText(t) {
  return `<${t.selector}> "${t.text}"${times(t)} at ${t.sizePx}px is set in ${t.color}`
}

/**
 * @param {{ selector: string, text: string, widthPx: number, heightPx: number,
 *   animationName: string, count?: number }} t
 * @returns {string}
 */
export function describeStrandedText(t) {
  return (
    `<${t.selector}> "${t.text}"${times(t)} is ${t.widthPx}x${t.heightPx}px at opacity 0, ` +
    `animation-name ${t.animationName}`
  )
}

/** The farthest a word is from fitting: what it needs over what it has. */
const overshoot = (w) => w.needsPx / Math.max(w.boxPx, 1)

function wordBreakFindings(seen, route, owner) {
  const known = isKnownShred(seen.designDate, route)
  const bySelector = new Map()
  for (const w of seen.words ?? []) {
    bySelector.set(w.selector, [...(bySelector.get(w.selector) ?? []), w])
  }
  return [...bySelector.entries()].map(([selector, words]) => {
    const worst = words.reduce((a, b) => (overshoot(b) > overshoot(a) ? b : a))
    const more = words.length > 1 ? words.filter((w) => w !== worst) : []
    const alsoWords = more.length
      ? `; ${more.length} more in the same element: ${more.map((w) => `"${w.word}"`).join(', ')}`
      : ''
    const advice = known
      ? `${seen.designDate} is listed in KNOWN_SHREDS, so this is reported and does not fail the gate.`
      : WORD_BREAK_FIX
    return {
      kind: 'word-break',
      severity: known ? 'warning' : 'error',
      owner: worst.part ? 'human' : owner,
      rank: overshoot(worst),
      key: `word-break|${selector}`,
      detail: `${describeBrokenWord(worst)}${times(worst)}${alsoWords}. ${worst.part ? ownerNote(worst).trim() : advice}`,
    }
  })
}

function invisibleFindings(records, owner) {
  return records.map((t) => ({
    kind: 'invisible-text',
    severity: 'error',
    owner: t.part ? 'human' : owner,
    rank: t.sizePx,
    key: `invisible-text|${t.selector}|${t.color}`,
    detail:
      `${describeInvisibleText(t)}, with no text stroke and no background clipped to the text, ` +
      `so it paints nothing. ${t.part ? ownerNote(t).trim() : INVISIBLE_FIX}`,
  }))
}

function strandedFindings(records, owner) {
  return records.map((t) => ({
    kind: 'stranded-text',
    severity: 'error',
    owner: t.part ? 'human' : owner,
    rank: t.widthPx * t.heightPx,
    key: `stranded-text|${t.selector}`,
    detail:
      `${describeStrandedText(t)} with prefers-reduced-motion: reduce on, so nothing brings it ` +
      `back. ${t.part ? ownerNote(t).trim() : STRANDED_FIX}`,
  }))
}

/**
 * The render-health findings for one measurement. Distinct by kind and
 * element chain; the run-wide fold and cap are {@link collapseRenderHealth}'s.
 *
 * @param {{ route: string, renderHealth?: { designDate: string, words: Array<object>,
 *   invisible: Array<object>, stranded: Array<object>|null } }} m raw measurement
 * @param {'react-engineer'|'human'} surfaceOwner
 * @returns {Array<object>}
 */
export function renderHealthFindings(m, surfaceOwner) {
  const seen = m.renderHealth
  if (!seen) return []
  return [
    ...wordBreakFindings(seen, m.route, surfaceOwner),
    ...invisibleFindings(seen.invisible ?? [], surfaceOwner),
    ...strandedFindings(seen.stranded ?? [], surfaceOwner),
  ]
}

const WHAT = {
  'word-break': 'words broken across lines',
  'invisible-text': 'texts painted in nothing',
  'stranded-text': 'elements left at opacity 0 with the reveal off',
}

const isRenderHealth = (f) => KINDS.includes(f.kind)

/** Errors before warnings, then the worst by rank, then by key so a run's brief reads the same each time. */
const worstFirst = (a, b) =>
  (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1) ||
  b.rank - a.rank ||
  (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)

const placeOf = (f) => `${f.surface} at ${f.width}px`

/** The same chain at other routes and rungs is one fault, kept at its worst reading with the places named. */
function foldGroup(group) {
  const first = group.reduce((a, b) => (b.rank > a.rank ? b : a))
  const rest = [...new Set(group.map(placeOf))].filter((p) => p !== placeOf(first))
  return rest.length ? { ...first, detail: `${first.detail} Also on ${rest.join(', ')}.` } : first
}

function capOwnerKind(group, kind) {
  const ordered = [...group].sort(worstFirst)
  if (ordered.length <= MAX_RENDER_HEALTH_REPORTED) return ordered
  const omitted = ordered.slice(MAX_RENDER_HEALTH_REPORTED)
  return [
    ...ordered.slice(0, MAX_RENDER_HEALTH_REPORTED),
    {
      ...omitted[0],
      key: `${kind}|summary|${omitted[0].owner}`,
      detail: `${omitted.length} more distinct ${WHAT[kind]} are not listed.`,
    },
  ]
}

/**
 * Fold the render-health findings of a whole run into one list. The same
 * element chain turns up on every rung and scheme that renders it, and on
 * every route that shares a component; that is one fault, with the other
 * places named. What is left is capped per owner and kind, worst first, and
 * a closing line counts the rest. The closing line keeps the severity of the
 * findings it stands for, so beside six errors it is an error and reaches the
 * repair brief.
 *
 * Other findings pass through untouched, ahead of these.
 *
 * @param {Array<object>} findings gate findings, each with `surface` and `width`
 * @returns {Array<object>}
 */
export function collapseRenderHealth(findings) {
  const groups = new Map()
  for (const f of findings.filter(isRenderHealth)) {
    const key = `${f.owner}|${f.key}`
    groups.set(key, [...(groups.get(key) ?? []), f])
  }
  const folded = [...groups.values()].map(foldGroup)
  const capped = []
  for (const owner of new Set(folded.map((f) => f.owner))) {
    for (const kind of KINDS) {
      capped.push(
        ...capOwnerKind(
          folded.filter((f) => f.owner === owner && f.kind === kind),
          kind
        )
      )
    }
  }
  return [...findings.filter((f) => !isRenderHealth(f)), ...capped]
}

/**
 * Load a route with reduced motion on and list what is left at opacity 0.
 * Emulated when the page is created, not after: a reveal that is switched on
 * at load by reading `matchMedia` has to see the preference at load.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} url
 * @returns {Promise<Array<object>>}
 */
export async function measureStranded(browser, url) {
  const page = await browser.newPage({
    viewport: { width: WIDE_VIEWPORT.width, height: WIDE_VIEWPORT.height },
    colorScheme: STRANDED_SCHEME,
    reducedMotion: 'reduce',
  })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(REVEAL_SETTLE_MS)
    return await collectStrandedText(page)
  } finally {
    await page.close()
  }
}

/**
 * Everything the gate reads off a page after it has settled, in the order
 * that keeps each reading honest: broken words at the rung's own viewport,
 * the reduced-motion visit on its own page, then the text-contrast walk and
 * the invisible-text probe with the viewport sized to the document, so both
 * see the page after the scroll reveal. Last, because that resize changes
 * the height `vh` resolves against.
 *
 * @param {{ browser: import('playwright').Browser, page: import('playwright').Page,
 *   viewport: { name: string }, scheme: string }} args
 * @returns {Promise<{ textContrast: object, renderHealth: object }>}
 */
export async function measureRenderHealth({ browser, page, viewport, scheme }) {
  const seen = await collectBrokenWords(page)
  const visit = viewport.name === STRANDED_RUNG && scheme === STRANDED_SCHEME
  const stranded = visit ? await measureStranded(browser, page.url()) : null
  const revealed = await withRevealedPage(page, async () => ({
    textContrast: await collectTextContrast(page),
    invisible: await collectInvisibleText(page),
  }))
  return {
    textContrast: revealed.textContrast,
    renderHealth: {
      designDate: seen.designDate,
      words: seen.words,
      invisible: revealed.invisible,
      stranded,
    },
  }
}
