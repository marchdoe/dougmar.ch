/**
 * Mockup Designer — Opus agent that turns the Art Director's spec into one
 * self-contained mockup.html. The orchestrator screenshots it, the Mockup
 * Critic gates it, and only then does the React Engineer translate it.
 */
import { writeFile } from 'node:fs/promises'
import { callClaudeCLI } from '../utils/claude-cli.js'
import { parseDelimiterResponse } from '../utils/delimiter-parser.js'
import { modelFor } from '../utils/models.js'
import { budgetFor } from '../utils/budgets.js'

export function buildMockupDesignerUserPrompt({
  enrichedBrief,
  tokenContext,
  contentSummary,
  measurables,
  shell,
  header,
  mobile,
  collapse,
  brandSvg,
  brandMonoSvg,
  googleFontsUrl,
  lessonsBlock,
  calibrationNote,
  compositionContractBlock,
  polishRef,
  revisionFeedback,
  tasteMemoryBlock,
  retryContext,
}) {
  const sections = []
  if (compositionContractBlock) sections.push(compositionContractBlock)
  sections.push(enrichedBrief)
  sections.push(`## Measurables (the critic will measure these)\n\n${measurables}`)
  sections.push(`## Shell Declaration (execute exactly)\n\n${shell}`)
  if (header) sections.push(`## Header Declaration (execute these numbers exactly)\n\n${header}`)
  // The phone declaration (#452): the collapse strategy from the composition
  // tuple and the MOBILE block that says what it means today. The mockup's
  // unqueried CSS is the 360 design, so this is the design at base.
  if (mobile) {
    sections.push(
      [
        '## Mobile Declaration (render exactly; the 360 image is judged against this)',
        '',
        `collapse: ${collapse ?? '?'}`,
        mobile,
        '',
        'The carrier is what holds the idea at 360; first_fold is what sits inside the first 640px; order is the zones top to bottom; hero_step_360 is the ramp step the hero is set at on the phone; nav_360 is what the header and nav become. The critic reads the 360 image against each line: a `hero-only` first fold that shows a nav row and signal cards, a hero set above `hero_step_360` and cut mid-word, an `order` the page does not follow: each is a REVISE.',
      ].join('\n')
    )
  }
  sections.push(
    `## Design Tokens (elements/preset.ts — use ONLY these colors)\n\n\`\`\`typescript\n${tokenContext}\n\`\`\``
  )
  sections.push(`## Google Fonts URL (load these exact families)\n\n${googleFontsUrl}`)
  sections.push(
    `## Brand Mark SVG (original colors)\n\n\`\`\`html\n${brandSvg}\n\`\`\`\n\n## Brand Mark SVG (single-color / currentColor)\n\n\`\`\`html\n${brandMonoSvg}\n\`\`\``
  )
  sections.push(
    `## Site Content (real content — render this, never placeholders)\n\n${contentSummary}`
  )
  if (lessonsBlock) sections.push(lessonsBlock)
  if (calibrationNote) sections.push(calibrationNote)
  if (tasteMemoryBlock) sections.push(tasteMemoryBlock)
  // polish.md rides in the user prompt — the system prompt is at its
  // size budget (CLI 2.1.92 fails on ~56KB+ system prompts).
  if (polishRef) sections.push(`## Execution Polish Reference (apply throughout)\n\n${polishRef}`)
  if (revisionFeedback)
    sections.push(
      `## CRITIC REVISION FEEDBACK — fix these before anything else\n\n${revisionFeedback}`
    )
  if (retryContext) sections.push(retryContext)
  return sections.join('\n\n---\n\n')
}

export function validateMockupResult(parsed) {
  const mockup = (parsed.files || []).find((f) => f.path === 'mockup.html')
  if (!mockup?.content) {
    throw new Error('Mockup Designer response missing ===FILE:mockup.html===')
  }
  if (/<script\b/i.test(mockup.content)) {
    throw new Error('mockup.html contains a <script> tag — the mockup must be JS-free')
  }
  if (!parsed.interior_notes) {
    throw new Error('Mockup Designer response missing ===INTERIOR_NOTES===')
  }
}

/**
 * @returns {Promise<{ mockupHtml: string, interiorNotes: string, rationale: string }>}
 */
export async function runMockupDesigner(ctx) {
  const userPrompt = buildMockupDesignerUserPrompt(ctx)
  const result = await callClaudeCLI('mockup-designer', ctx.systemPrompt, userPrompt, {
    ...budgetFor('mockup-designer'),
    model: modelFor('mockup-designer'), // opus in prod, sonnet in dev
  })
  let parsed
  try {
    parsed = parseDelimiterResponse(result)
    validateMockupResult(parsed)
  } catch (err) {
    console.error(`  [mockup-designer] rejected: ${err.message}`)
    console.error(`  [mockup-designer] response head: ${result.slice(0, 300).replace(/\n/g, '↵')}`)
    if (ctx.failureDumpPath) {
      try {
        await writeFile(ctx.failureDumpPath, result, 'utf8')
      } catch {}
    }
    throw err
  }
  return {
    mockupHtml: parsed.files.find((f) => f.path === 'mockup.html').content,
    interiorNotes: parsed.interior_notes,
    rationale: parsed.rationale || '',
  }
}
