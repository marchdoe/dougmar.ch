/**
 * The one way the swarm calls a CLI agent that answers in files or a
 * verdict: the React Engineer's generation, repairs and revisions (#221).
 */
import { callClaudeCLI } from '../utils/claude-cli.js'
import { parseDelimiterResponse } from '../utils/delimiter-parser.js'
import { budgetFor } from '../utils/budgets.js'

/**
 * The delimiter-format reminder appended to every call's user prompt. A
 * patch reply sends only the files that changed — "write complete file
 * contents after each delimiter" reads as "regenerate everything" and
 * contradicted the brief's "return ONLY the files that must change" (#447)
 * — so a patch call drops that sentence.
 * @param {boolean} patch
 * @returns {string}
 */
function formatFileDelimiterReminder(patch) {
  return patch
    ? `\n\n---\n\nIMPORTANT: Use the ===FILE:path=== delimiter format described in your instructions. No JSON, no markdown code fences, no explanation — just the delimiters and raw file content.`
    : `\n\n---\n\nIMPORTANT: Use the ===FILE:path=== delimiter format described in your instructions. Write complete file contents after each delimiter. No JSON, no markdown code fences, no explanation — just the delimiters and raw file content.`
}

/**
 * Spawn a `claude` CLI process for one agent.
 *
 * The build error used to be appended here, after the agent's whole original
 * task, and the reply was a regeneration of everything (#432). A repair or
 * revision now sends a repair brief as `userPrompt` instead, with
 * `options.patch` set so an empty `===FILE:path===` block survives parsing
 * as the instruction to delete that file.
 *
 * @param {string} agentName
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {{ timeoutMs?: number, stallTimeoutMs?: number, model?: string, patch?: boolean, purpose?: string, effort?: string }} [options]
 * @returns {Promise<{ files: Array<{path: string, content: string}>, rationale?: string, design_brief?: string }>}
 */
export async function callAgent(agentName, systemPrompt, userPrompt, options = {}) {
  let fullPrompt = userPrompt

  fullPrompt += formatFileDelimiterReminder(options.patch === true)

  // Explicit IDs only — the 'sonnet' alias this used to fall back to is what
  // models.js exists to prevent (a pinned CLI freezes what the alias means).
  if (!options.model) throw new Error(`[${agentName}] callAgent requires an explicit model ID`)
  const budget = budgetFor(agentName)
  const result = await callClaudeCLI(agentName, systemPrompt, fullPrompt, {
    timeoutMs: options.timeoutMs ?? budget.timeoutMs,
    stallTimeoutMs: options.stallTimeoutMs ?? budget.stallTimeoutMs,
    model: options.model,
    purpose: options.purpose,
    effort: options.effort,
  })

  // Two response shapes remain: a critic verdict, or delimited files. The
  // ===VISUAL_SPEC=== branch served the Design Director (retired 2026-04-29)
  // and the three-stage JSON fallback served the Unified Designer (also
  // retired); neither agent exists, so neither shape can arrive.
  let parsed

  if (result.includes('===VERDICT===')) {
    // Critic response (mockup-critic, screenshot-critic) — extract verdict and feedback.
    // _fullResponse keeps the undelimited text: parseCriticVerdict anchors on the
    // ===VERDICT=== block, so it must see the full response, not the stripped body.
    const verdictMatch = result.match(/===VERDICT===([\s\S]*?)===END===/)
    const verdictBody = verdictMatch ? verdictMatch[1].trim() : result.trim()
    parsed = {
      files: [],
      rationale: verdictBody,
      design_brief: '',
      _rawResponse: verdictBody,
      _fullResponse: result,
    }
  } else if (result.match(/^===FILE:/m)) {
    parsed = parseDelimiterResponse(result, { keepEmptyFiles: options.patch === true })
  } else {
    throw new Error(
      `[${agentName}] response is neither a ===VERDICT=== block nor ===FILE:=== delimited\nFirst 300 chars: ${result.slice(0, 300)}`
    )
  }

  // A critic verdict carries no files; that is fine.
  if (!parsed.files) parsed.files = []
  if (!Array.isArray(parsed.files)) {
    throw new Error(
      `[${agentName}] response missing files array. Got keys: ${Object.keys(parsed).join(', ')}`
    )
  }

  console.log(
    `  [${agentName}] responded with ${parsed.files.length} files${parsed._rawResponse ? ' + visual spec' : ''}`
  )

  return parsed
}
