/**
 * Every timeout the pipeline reasons with, keyed by what it bounds.
 *
 * These were literals spread across seven files (#221): the same 480000ms
 * stall window typed in three of them, 600000/300000 for the critics in
 * two, and three separate readiness waits for the preview server. Named and
 * gathered so a change is one edit, and so the relationships — the stall
 * window must sit inside the hard timeout, or it can never fire — are
 * visible in one place. Every value is unchanged from where it was.
 *
 * Milliseconds throughout.
 */

/**
 * Per-agent hard timeout and stall window for a model call. `timeoutMs` is
 * the cap on the whole call; `stallTimeoutMs` is how long the CLI may emit
 * nothing at all before it is presumed dead. A stall window longer than the
 * timeout is dead code, which is how claude-cli.js's old 900000 default sat
 * against a 600000 timeout.
 *
 * The two vision critics also carry `maxTokens`, spread by callVisionAgent
 * into the SDK call. Their prompts were rewritten to a capped issues list
 * (#486) after a first pass wrote 11k output tokens and a re-judge truncated
 * at the 16k SDK default, and both were capped at 6000. That is enough for the
 * mockup critic (Haiku, no thinking, replies of 230 to 2,092 tokens) and not
 * for the screenshot critic: Sonnet 5 runs adaptive thinking, thinking counts
 * against `max_tokens` and bills as output, and 28 of 50 recorded screenshot
 * critic calls stopped at exactly 6000 with no verdict (#570). The screenshot
 * critic goes back to 16000, the SDK default. `output_config.effort` would be
 * the lever for bounding thinking on this model (`budget_tokens` is rejected
 * on Sonnet 5), and it is an owner call on judgment quality, so it is not set
 * here.
 *
 * react-engineer instead carries `effort` (2026-09-22, one-week Opus 5.5
 * trial — see models.js). It does not reach callVisionAgent: the engineer
 * runs the CLI path, and callAgent() in design-agents.js spreads this whole
 * object into callClaudeCLI's options, which turns `effort` into a plain
 * `--effort <level>` CLI flag. No other agent carries this key.
 */
export const AGENT_BUDGETS = {
  // 25 min hard cap — the AD has run 8-17 min of extended thinking.
  'art-director': { timeoutMs: 1_500_000, stallTimeoutMs: 480_000 },
  // 30 min hard cap — bounds long extended-thinking phases.
  'mockup-designer': { timeoutMs: 1_800_000, stallTimeoutMs: 480_000 },
  'react-engineer': { timeoutMs: 1_800_000, stallTimeoutMs: 480_000, effort: 'high' },
  'mockup-critic': { timeoutMs: 600_000, stallTimeoutMs: 300_000, maxTokens: 6000 },
  'screenshot-critic': { timeoutMs: 600_000, stallTimeoutMs: 300_000, maxTokens: 16_000 },
}

/** The call defaults when an agent is not in the table above. */
export const DEFAULT_AGENT_BUDGET = { timeoutMs: 600_000, stallTimeoutMs: 300_000 }

/**
 * @param {string} agentName
 * @returns {{ timeoutMs: number, stallTimeoutMs: number }}
 */
export function budgetFor(agentName) {
  return AGENT_BUDGETS[agentName] ?? DEFAULT_AGENT_BUDGET
}

/** Non-model steps. */
export const STEP_BUDGETS = {
  /** `pnpm build` inside validateBuild. */
  buildMs: 120_000,
  /** `pnpm panda codegen`. */
  codegenMs: 60_000,
  /** biome and tsc, each. */
  staticCheckMs: 60_000,
  /** How long to wait for `vite preview` to answer. */
  previewReadyMs: 30_000,
  /** One page load during a capture or measurement. */
  pageLoadMs: 30_000,
}
