/**
 * Mockup Critic — blocking vision gate over the mockup screenshot.
 * Fail-closed: malformed responses count as REVISE.
 */
import { budgetFor } from '../utils/budgets.js'
import { imageBlock, textBlock } from '../utils/claude-sdk.js'
import { parseCriticVerdict } from '../utils/critic-verdict.js'
import { callVisionAgent } from '../utils/vision-router.js'

export function parseMockupCriticResponse(raw) {
  const { verdict, malformed } = parseCriticVerdict(raw, 'APPROVE')
  // Feedback tolerates a missing ===END=== (truncated responses) so a
  // REVISE round never goes back to the designer with empty feedback.
  // Last occurrence wins, mirroring the verdict rule.
  const feedbackMatches = [
    ...String(raw ?? '').matchAll(/===FEEDBACK===\s*\n([\s\S]*?)(?:===END===|$)/g),
  ]
  if (malformed) {
    return {
      verdict: 'REVISE',
      feedback: `malformed critic response: ${String(raw).slice(0, 300)}`,
    }
  }
  return {
    verdict,
    feedback: feedbackMatches.length ? feedbackMatches[feedbackMatches.length - 1][1].trim() : '',
  }
}

/**
 * @param {{ systemPrompt: string, screenshotBuffer: Buffer, mobileScreenshot?: Buffer|null, headerCrop?: Buffer|null, enrichedBrief: string, measurables: string, shell: string, header?: string, mobile?: string, collapse?: string|null }} ctx
 * @returns {Promise<{ verdict: 'APPROVE'|'REVISE', feedback: string }>}
 */
export async function runMockupCritic(ctx) {
  // Record which channel answered. A verdict reached without pixels is a
  // different thing from one reached with them, and verdicts.json is where
  // that has to be visible after the fact.
  let channel = 'unknown'
  const raw = await callVisionAgent({
    agentName: 'mockup-critic',
    systemPrompt: ctx.systemPrompt,
    contentBlocks: buildMockupCriticBlocks(ctx),
    ...budgetFor('mockup-critic'),
    onChannel: (c) => {
      channel = c
    },
  })
  return { ...parseMockupCriticResponse(raw), channel }
}

/**
 * Assemble the critic's user turn: the declared intent as text, then the
 * rendered mockup at 1440 and at 360, then a 2x crop of the header region.
 * Exported for tests.
 *
 * The phone render is the second image because it is judged against the first.
 * Until 2026-09-04 every image any critic received was 1440 wide, so a
 * composition that has no idea left at one column — a question facing an
 * answer, with the split gone and the answer facing nothing — was approved by
 * a gate that had never seen a phone.
 *
 * The crop is the point of the second image. At 1024px for a 1440px page,
 * an 11px mark and a 44px mark are both a few grey pixels, which is how a
 * quarter-size lockup passed this gate (#254). The crop arrives near 1:1, so
 * `mark_px` becomes something the critic can actually measure. It is optional:
 * a capture failure costs the critic one image, never the run.
 *
 * The mobile declaration (#452) is what check 6 measures the phone image
 * against: the declared carrier, first fold and order, not a general sense
 * of whether the phone "looks fine".
 *
 * @param {{ screenshotBuffer: Buffer, mobileScreenshot?: Buffer|null, headerCrop?: Buffer|null, enrichedBrief: string, measurables: string, shell: string, header?: string, mobile?: string, collapse?: string|null }} ctx
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
export function buildMockupCriticBlocks(ctx) {
  return [
    textBlock(`## Brief + Visual Specification\n\n${ctx.enrichedBrief}`),
    textBlock(`## Measurables (declared floors)\n\n${ctx.measurables}`),
    textBlock(`## Shell Declaration\n\n${ctx.shell}`),
    ctx.header ? textBlock(`## Header Declaration\n\n${ctx.header}`) : null,
    ctx.mobile
      ? textBlock(
          `## Mobile Declaration (check 6 is judged against this)\n\ncollapse: ${ctx.collapse ?? '?'}\n${ctx.mobile}`
        )
      : null,
    textBlock('The screenshot of the rendered mockup at 1440×900 (DESKTOP) follows:'),
    imageBlock(ctx.screenshotBuffer),
    // The same mockup on a phone, adjacent to its desktop counterpart so the
    // two are compared rather than judged apart. Optional for the same reason
    // the crop is: a capture failure costs an image, never the run.
    ctx.mobileScreenshot
      ? textBlock(
          'The SAME mockup at 360×640 (PHONE) follows. Check 6 is judged here. It is one column ' +
            'of the same design, not a different design — judge whether the idea survived the ' +
            'width, not only whether anything broke:'
        )
      : null,
    ctx.mobileScreenshot ? imageBlock(ctx.mobileScreenshot) : null,
    ctx.headerCrop
      ? textBlock(
          'A 2x crop of the header region of that same mockup follows. Measure the mark against the declared mark_px here, not in the full-page shot:'
        )
      : null,
    ctx.headerCrop ? imageBlock(ctx.headerCrop) : null,
  ].filter(Boolean)
}
