/**
 * Which mockup round ships when the critic never approves one (#573).
 *
 * The loop in design-agents.js runs the designer up to three times. When the
 * last critic verdict is still REVISE it used to ship the last round, and on
 * five of the eighteen nights in September that round measured worse than an
 * earlier one. On 2026-09-16 round 0 measured canvas 100 and colour 100 and was
 * revised for a missing mark; the round that shipped measured canvas 38.6.
 *
 * The choice is made from the numbers `mockupMeasurableRounds` already holds,
 * against the floors the Art Director declared, so it is only as good as the
 * measurement (#572).
 */
import { writeFile } from 'node:fs/promises'

/** The width the mockup is measured at, and so the width `hero_scale` resolves at. */
export const HERO_RESOLVE_WIDTH = 1440

const REM_PX = 16

/** A CSS length in px, resolved at `viewportWidth`, or null when it is not one this reads. */
function lengthPx(term, viewportWidth) {
  const m = /^(-?\d*\.?\d+)(px|vw|rem)?$/i.exec(term.trim())
  if (!m) return null
  const n = Number.parseFloat(m[1])
  const unit = (m[2] ?? 'px').toLowerCase()
  if (unit === 'vw') return (n * viewportWidth) / 100
  if (unit === 'rem') return n * REM_PX
  return n
}

/**
 * The size a declared `hero_scale` resolves to at 1440px, in px. Reads
 * `clamp(min, preferred, max)` and a bare length in px, vw or rem, which is
 * every form the Art Director has declared. Anything else (calc, min, max)
 * returns null and the hero drops out of the shortfall.
 *
 * @param {string|null|undefined} heroScale
 * @param {number} [viewportWidth]
 * @returns {number|null}
 */
export function heroPxAt(heroScale, viewportWidth = HERO_RESOLVE_WIDTH) {
  if (typeof heroScale !== 'string') return null
  const clamp = /^clamp\((.+)\)$/i.exec(heroScale.trim())
  const terms = (clamp ? clamp[1] : heroScale).split(',').map((t) => lengthPx(t, viewportWidth))
  if (terms.some((t) => t === null)) return null
  if (!clamp) return terms.length === 1 ? terms[0] : null
  if (terms.length !== 3) return null
  const [min, preferred, max] = terms
  return Math.min(Math.max(preferred, min), max)
}

const round1 = (n) => Math.round(n * 10) / 10

/**
 * How far one round misses what was declared, as one number of points.
 *
 * - `canvas`: percentage points under `canvas_utilization_min`, or 0.
 * - `colour`: percentage points under `color_coverage_min`, or 0.
 * - `hero`: percent the measured hero misses the declared size, in either
 *   direction, since the critic treats a hero that overshoots as a fault too.
 *   Dropped to 0 when the declared size is not one `heroPxAt` reads.
 *
 * A floor that was not declared contributes 0. The total is their sum.
 *
 * @param {{canvas_utilization: number, color_coverage: number, hero_px: number}} measured
 * @param {{canvas_utilization_min?: number|null, color_coverage_min?: number|null, hero_scale?: string|null}|null|undefined} declared
 * @returns {{ canvas: number, colour: number, hero: number, total: number }}
 */
export function roundShortfall(measured, declared) {
  const under = (floor, actual) =>
    typeof floor === 'number' && typeof actual === 'number' ? Math.max(0, floor - actual) : 0
  const target = heroPxAt(declared?.hero_scale)
  const hero =
    target && typeof measured?.hero_px === 'number'
      ? (Math.abs(measured.hero_px - target) / target) * 100
      : 0
  const canvas = under(declared?.canvas_utilization_min, measured?.canvas_utilization)
  const colour = under(declared?.color_coverage_min, measured?.color_coverage)
  return {
    canvas: round1(canvas),
    colour: round1(colour),
    hero: round1(hero),
    total: round1(canvas + colour + hero),
  }
}

/**
 * The round to ship when the critic stopped on REVISE: the one with the
 * smallest total shortfall, the later round on a tie. A tie is usual when
 * every round clears its floors and the critic faulted something a number
 * cannot see, and the later round is the one that answered the earlier
 * feedback.
 *
 * @param {Array<{round: number, measured: {canvas_utilization: number, color_coverage: number, hero_px: number}}>|null|undefined} rounds
 *   the entries of `mockupMeasurableRounds`, oldest first
 * @param {object|null|undefined} declared the run's `measurablesDecl`
 * @returns {{ round: number, latest: number, shortfalls: Array<{round: number, canvas: number, colour: number, hero: number, total: number}>, reason: string }|null}
 *   null when there is nothing measured to choose between
 */
export function pickShippedRound(rounds, declared) {
  const measured = (rounds ?? []).filter((r) => r?.measured)
  if (measured.length === 0) return null
  const shortfalls = measured.map((r) => ({
    round: r.round,
    ...roundShortfall(r.measured, declared),
  }))
  let best = shortfalls[0]
  for (const s of shortfalls) if (s.total <= best.total) best = s
  const latest = shortfalls[shortfalls.length - 1]
  const table = shortfalls.map((s) => `round ${s.round} ${s.total}`).join(', ')
  const reason =
    best.round === latest.round
      ? `the critic never approved; the latest round has the smallest shortfall (${table})`
      : `the critic never approved; round ${best.round} misses its floors by ${best.total} points against ${latest.total} for round ${latest.round} (${table})`
  return { round: best.round, latest: latest.round, shortfalls, reason }
}

/**
 * Applies the choice at the end of the loop. Ships the round
 * `pickShippedRound` names when the critic's last verdict was a real REVISE
 * and the last round produced was also measured, and records the choice as a
 * `mockup-round-shipped` trace step. Anything else leaves the last round in
 * place: an APPROVE, a malformed critic reply (which carries no verdict on the
 * page), a round whose screenshot failed, or a night with no measurements.
 *
 * @param {object} run
 * @param {Array<{critic: string, verdict: string, feedback: string}>} run.verdicts
 * @param {Array<{round: number, measured: object}>} run.rounds `mockupMeasurableRounds`
 * @param {object|null|undefined} run.declared the run's `measurablesDecl`
 * @param {number} run.producedRound the last round the designer produced
 * @param {Map<number, {mockup: object, mockupScreenshot: object}>} run.kept every round's mockup and screenshot
 * @param {{mockup: object, mockupScreenshot: object|null}} run.current what the loop ended holding
 * @param {string} run.mockupPath where `signals/today.mockup.html` lives
 * @param {{addStep: (step: object) => void}} run.trace
 * @returns {Promise<{mockup: object, mockupScreenshot: object|null}>} what ships
 */
export async function settleMockupRound({
  verdicts,
  rounds,
  declared,
  producedRound,
  kept,
  current,
  mockupPath,
  trace,
}) {
  const last = verdicts.filter((v) => v.critic === 'mockup-critic').at(-1)
  // The pre-check's measured faults are a REVISE too (mockup-precheck.js),
  // when they are about the round the loop ended on.
  const lastPrecheck = verdicts.filter((v) => v.critic === 'mockup-precheck').at(-1)
  const stoppedOnRevise =
    (last?.verdict === 'REVISE' && !last.feedback.startsWith('malformed critic response')) ||
    (lastPrecheck?.verdict === 'REVISE' && lastPrecheck.round === producedRound)
  const shipped = stoppedOnRevise ? pickShippedRound(rounds, declared) : null
  if (!shipped || shipped.latest !== producedRound) return current

  const chosen = shipped.round === shipped.latest ? current : kept.get(shipped.round)
  if (chosen !== current) {
    console.warn(
      `  [mockup-critic] shipping round ${shipped.round}, not round ${shipped.latest}: ${shipped.reason}`
    )
    await writeFile(mockupPath, chosen.mockup.mockupHtml, 'utf8')
  }
  trace.addStep({
    name: 'mockup-round-shipped',
    phase: 2,
    input: { rounds: shipped.shortfalls.map((s) => s.round) },
    output: {
      round: shipped.round,
      latest: shipped.latest,
      shortfalls: shipped.shortfalls,
      reason: shipped.reason,
    },
    durationMs: 0,
  })
  return chosen
}

/**
 * Why the designer is called in a round: round 0 is the task, every later
 * round answers the critic's feedback. Named here so the loop in
 * design-agents.js stays free of the branch.
 * @param {number} round
 * @returns {'first'|'revision'}
 */
export const designerPurpose = (round) => (round === 0 ? 'first' : 'revision')

/**
 * Why the mockup critic is called in a round: round 0 is its first look, every
 * later round judges a page it already judged once.
 * @param {number} round
 * @returns {'first'|'rejudge'}
 */
export const criticPurpose = (round) => (round === 0 ? 'first' : 'rejudge')
