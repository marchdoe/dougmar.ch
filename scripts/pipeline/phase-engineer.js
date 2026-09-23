/**
 * Phase 2c/3: the React Engineer translates the approved mockup into TSX
 * (#221). Assembles the engineer's two system prompts (full generation and
 * patch), asks once (with one retry on a stall), writes the reply, patches
 * a reply that arrived incomplete, and sweeps unused generated components.
 * Leaves on `state.engineer`: `config` (shared with the repair and the
 * revisions) and `result`, the files on disk.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { pastDeadline } from '../utils/run-budget.js'
import { noteRetry } from '../utils/cost-ledger.js'
import { loadPrompt } from '../utils/prompt-loader.js'
import { formatSemanticContractForPrompt } from '../utils/semantic-contract.js'
import {
  collectGateRules,
  formatGateRulesForPrompt,
  formatRequiredFilesSection,
} from '../utils/gate-rules.js'
import { fillContentGaps } from '../utils/content-gaps.js'
import { modelFor } from '../utils/models.js'
import { budgetFor } from '../utils/budgets.js'
import { formatMaterialContractBlock, materialSeed } from '../utils/material.js'
import { formatHeader } from '../utils/header-grammar.js'
import { formatTypeTreatment } from '../utils/type-grammar.js'
import { formatMobile } from '../utils/mobile-grammar.js'
import { formatMotion, wantsMotionReference } from '../utils/motion-grammar.js'
import { formatTuple } from '../utils/composition-grammar.js'
import { findEngineerOutputProblem } from '../utils/engineer-output-check.js'
import { patchOutputProblem } from '../utils/engineer-output-patch.js'
import { callAgent } from './call-agent.js'
import {
  applyEngineerPatch,
  buildRepairBrief,
  sweepAndTrace,
  writeEngineerFiles,
} from './engineer-tools.js'

/**
 * Throws when `raw` is missing `placeholder`. A tiny standalone check so a
 * new one (like {{REQUIRED_FILES}}, #447) doesn't add another inline branch
 * to the assembly below.
 * @param {string} raw
 * @param {string} placeholder
 * @param {string} promptName for the error message
 */
function assertPromptPlaceholder(raw, placeholder, promptName) {
  if (!raw.includes(placeholder)) {
    throw new Error(`${promptName} is missing its ${placeholder} placeholder`)
  }
}

/**
 * The engineer's system prompts: the full-generation one, and the patch
 * variant every repair and revision call (`patch: true`) uses, so its
 * required-files wording matches the repair brief's "return only what
 * changed" instead of contradicting it (#447).
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<{ prompt: string, patchPrompt: string }>}
 */
async function assembleEngineerPrompts(state) {
  const { root } = state
  const { designSystemReference, brandRegisterDeclaration } = state.prompts
  const reactEngineerPromptRaw = await loadPrompt('react-engineer.md', { root })
  if (!reactEngineerPromptRaw.includes('{{SEMANTIC_COLOR_CONTRACT}}')) {
    throw new Error('react-engineer.md is missing its {{SEMANTIC_COLOR_CONTRACT}} placeholder')
  }
  // The gate list is generated from the validator's own exported constants
  // at assembly time, so `react-engineer.md` cannot state a host allowlist
  // or a forbidden-pattern list that has drifted from what actually fails
  // the build the way it did for #432.
  if (!reactEngineerPromptRaw.includes('{{GATES}}')) {
    throw new Error('react-engineer.md is missing its {{GATES}} placeholder')
  }
  // The required-files section states one contract for a full generation
  // and the opposite one for a patch (a repair or a revision) — #447 found
  // the two calls sharing the full-generation wording, which told a patch
  // reply to resend every required file while the brief in the same call
  // asked for only what changed.
  assertPromptPlaceholder(reactEngineerPromptRaw, '{{REQUIRED_FILES}}', 'react-engineer.md')
  // Which content fields are empty today, read from app/content (#568), so
  // the engineer does not print a separator beside a field that has no text.
  const semanticColorContractBlock = formatSemanticContractForPrompt()
  const buildReactEngineerPrompt = (patch) =>
    fillContentGaps(
      reactEngineerPromptRaw
        .replace('{{SEMANTIC_COLOR_CONTRACT}}', semanticColorContractBlock)
        .replace('{{REQUIRED_FILES}}', formatRequiredFilesSection({ patch }))
        .replace('{{GATES}}', formatGateRulesForPrompt(collectGateRules({ root, patch }))),
      { root }
    )
  const reactEngineerPrompt = await buildReactEngineerPrompt(false)
  const reactEngineerPatchPrompt = await buildReactEngineerPrompt(true)
  return {
    prompt: `${reactEngineerPrompt}\n\n${designSystemReference}${brandRegisterDeclaration}`,
    patchPrompt: `${reactEngineerPatchPrompt}\n\n${designSystemReference}${brandRegisterDeclaration}`,
  }
}

/**
 * The engineer's user prompt: the approved mockup, its interior notes, the
 * tokens and every declaration it executes.
 *
 * The motion-design reference (#506) rides in it on a night with an
 * entrance or a scroll reveal to time. The engineer prompt has no size cap
 * (only the mockup designer's is budgeted, see
 * utils/mockup-designer-prompt.js), so the whole reference goes in.
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<() => string>}
 */
async function prepareEngineerUserPrompt(state) {
  const { root, today } = state
  const { result: artDirectorResult, chosenComposition, shellDecl } = state.ad
  const { headerDecl, typeDecl, mobileDecl, motionDecl } = state.ad
  const { mockup, tokenContext, lessonsBlock } = state.design
  const refMotion = wantsMotionReference(motionDecl)
    ? await loadPrompt('impeccable/reference/motion-design.md', { root })
    : ''
  return () =>
    [
      '## Approved Mockup (mockup.html — your fidelity target)\n\n```html\n' +
        mockup.mockupHtml +
        '\n```',
      `## Interior Notes (how About/Work adapt the system)\n\n${mockup.interiorNotes}`,
      `## Design Tokens (elements/preset.ts)\n\n\`\`\`typescript\n${tokenContext}\n\`\`\``,
      `## Hero Copy\n\n${artDirectorResult.heroCopy}`,
      `## Composition\n\n${formatTuple(chosenComposition)}`,
      `## Shell Declaration\n\n${artDirectorResult.shell}`,
      // The declared material as the exact JSX line to place (#505). The
      // seed is the day's, so a re-run draws the same grain.
      formatMaterialContractBlock(shellDecl.ground_material, materialSeed(today)),
      `## Header Declaration (execute these numbers exactly)\n\n${formatHeader(headerDecl)}`,
      `## Type Treatment (execute exactly)\n\n${formatTypeTreatment(typeDecl)}`,
      `## Mobile Declaration (the design at base; the mockup already renders it, keep it)\n\n${formatMobile(mobileDecl)}`,
      `## Motion (execute exactly; see the Motion section of your instructions)\n\n${formatMotion(motionDecl)}`,
      '## One-line Design Brief (for og:description context)\n\n' +
        (artDirectorResult.designBrief || ''),
      // The engineer previously received zero historical feedback despite
      // being the agent screenshot-critic failures usually blame — same
      // capped block the mockup designer sees.
      lessonsBlock,
      refMotion &&
        `## Motion Design Reference (timing, easing, stagger, reduced motion)\n\n${refMotion}`,
    ]
      .filter(Boolean)
      .join('\n\n---\n\n')
}

/**
 * The first generation, retried once on a stall.
 * @param {{ prompt: string, options: object }} config
 * @param {string} engineerUserPrompt
 */
async function generate(config, engineerUserPrompt) {
  try {
    return await callAgent('react-engineer', config.prompt, engineerUserPrompt, {
      ...config.options,
      purpose: 'first',
    })
  } catch (err) {
    // A 0KB stall is usually transient (a throttled account, a flaky CLI
    // turn) rather than a bad prompt — it shouldn't throw away the whole
    // run (AD + 3 mockup rounds) when one more attempt often succeeds.
    // Retry ONCE on a stall, unless we're already past the run deadline.
    const isStall = /stalled|0KB|no output/i.test(err.message)
    if (!isStall || err.transport || pastDeadline()) {
      console.error(`  React Engineer failed: ${err.message}`)
      throw new Error(`React Engineer failed: ${err.message}`)
    }
    console.warn(`  React Engineer stalled (${err.message}) — retrying once`)
    noteRetry()
    try {
      return await callAgent('react-engineer', config.prompt, engineerUserPrompt, {
        ...config.options,
        purpose: 'retry',
      })
    } catch (retryErr) {
      console.error(`  React Engineer failed after stall retry: ${retryErr.message}`)
      throw new Error(`React Engineer failed after stall retry: ${retryErr.message}`)
    }
  }
}

/**
 * Phase 2c and 3: generate, write, patch what arrived incomplete, sweep.
 * @param {import('./run-state.js').RunState} state
 */
export async function runEngineerPhase(state) {
  const { root, trace } = state
  const { tokenContext, enrichedBrief, mockup } = state.design
  console.log('\n[phase-2c] React Engineer')
  const prompts = await assembleEngineerPrompts(state)
  const buildEngineerUserPrompt = await prepareEngineerUserPrompt(state)

  // Single source of truth for invoking the React Engineer. The
  // screenshot-critic retry and the Phase 5 retry both reference this, so
  // model/timeout choices can't drift out of sync with each other.
  const config = {
    prompt: prompts.prompt,
    // Every repair and revision call (`patch: true`) uses this instead (#447).
    patchPrompt: prompts.patchPrompt,
    user: buildEngineerUserPrompt,
    options: { model: modelFor('react-engineer'), ...budgetFor('react-engineer') },
  }
  state.engineer.config = config

  const engineerUserPrompt = buildEngineerUserPrompt()

  if (pastDeadline()) {
    throw new Error('run budget exhausted before the React Engineer could start — nothing to ship')
  }
  const t0Engineer = Date.now()
  let engineerResult = await generate(config, engineerUserPrompt)

  // The response must be complete (every required file) and respect the
  // declared shell posture. Judged as it arrived, before the write drops
  // anything: the write discards a path the engineer may not write, and
  // that is the problem to report. It is fixed below, once the reply is on
  // disk, by a patch (#577).
  const arrivedProblem = findEngineerOutputProblem(
    engineerResult.files,
    state.ad.chosenComposition.shell_posture
  )

  // Write all files. Orchestrator-owned paths are dropped first — the
  // engineer is told not to emit them and nothing used to check.
  for (const p of await writeEngineerFiles(engineerResult, 'React Engineer', {
    root,
    backup: state.originalBackup,
  }))
    state.writtenPaths.add(p)

  // A problem with what arrived is a repair brief and a patch reply, merged
  // over the files just written (#577); only a reply that left nothing of the
  // engineer's on disk is asked for again in full. `engineerResult` keeps
  // its rationale and takes the merged files, so the archive records what
  // shipped.
  const { reply: outputPatch } = await patchOutputProblem({
    problem: arrivedProblem,
    taskPrompt: engineerUserPrompt,
    buildBrief: (errors) => buildRepairBrief(state, errors),
    askEngineer: (prompt) =>
      callAgent('react-engineer', config.patchPrompt, prompt, {
        ...config.options,
        patch: true,
        purpose: 'output-patch',
      }),
    applyPatch: (owned, reply) =>
      applyEngineerPatch(state, owned, reply, 'React Engineer output patch', 3),
    pastDeadline,
    noteRetry,
    trace,
  })
  if (outputPatch) engineerResult = { ...engineerResult, files: outputPatch.files }
  state.engineer.result = engineerResult

  trace.addStep({
    name: 'react-engineer',
    phase: 3,
    input: {
      tokenContext: tokenContext.length,
      briefLength: enrichedBrief.length,
      mockupLength: mockup.mockupHtml.length,
    },
    output: {
      files: engineerResult.files.map((f) => f.path),
      rationale: (engineerResult.rationale || '').slice(0, 500),
    },
    durationMs: Date.now() - t0Engineer,
  })

  // Verify Layout.tsx was written (critical for the site to function)
  if (!existsSync(path.join(root, 'app/components/Layout.tsx'))) {
    throw new Error('React Engineer did not produce Layout.tsx — site cannot function without it')
  }

  await sweepAndTrace(state, 3, 'react-engineer')
}
