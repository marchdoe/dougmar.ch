/**
 * Per-agent model resolution with a dev/prod tier, and everything the
 * pipeline knows about each model in one table.
 *
 * Prod uses the best model per job — Opus 4.8 for the art director and
 * mockup designer, where design taste matters most, and (2026-09-22,
 * one-week trial) Opus 5.5 at effort `high` for the react engineer: a local
 * A/B on the 2026-09-21 tape had the Sonnet 5 engineer start at 37 gate
 * errors and lose the mockup's hero hierarchy, against Opus 5.5 starting at
 * 4 and matching the mockup in about half the wall time. `opus-5-5` is its
 * own tier, separate from `opus`, so this does not touch the art director or
 * mockup designer. Revert: change PROD_MODELS['react-engineer'] back to
 * 'opus'. Dev caps every agent at DEV_CEILING (Sonnet) so local runs stay off
 * the Max-plan Opus budget: on a subscription, Opus usage is weighted
 * heavily against the rolling rate limit, so a single Opus call burns far
 * more allowance than the same work on Sonnet. Removing it is what lets a
 * local run complete without throttling.
 *
 * Tiers resolve to explicit model IDs rather than CLI aliases. CI pins the
 * claude CLI, whose 'opus'/'sonnet' alias mapping is frozen at whatever was
 * current when that version shipped; explicit IDs pass through to the API
 * and stay current regardless of the CLI pin.
 *
 * Tier selection (default): an API key present means billed/API usage (CI or a
 * deliberate `ANTHROPIC_API_KEY=... node ...` local run) → PROD models, off the
 * subscription pool. No API key means a local Max-plan run → DEV cap. The
 * `PIPELINE_TIER=dev|prod` env var overrides this either way.
 */

/**
 * The catalog. Pricing is USD per million tokens at Anthropic first-party
 * API rates; cache reads bill at ~0.1x input and cache writes at ~1.25x,
 * applied in cost-ledger.js rather than stored here.
 *
 * Pricing used to live in cost-ledger.js keyed by literal IDs, beside two IDs
 * this module never emitted, so bumping a tier here silently made every call
 * on the new model `partial: true` in the ledger (#221). The test in
 * models.test.js now holds the two sides together: every emitted ID has a
 * price, and nothing is priced that is never emitted.
 *
 * `adaptiveThinking`: the 4.6-and-later families accept the `thinking`
 * parameter; Haiku 4.5 rejects it with a 400, so the SDK call resolves the
 * flag from here rather than assuming.
 */
export const MODEL_CATALOG = {
  'claude-haiku-4-5': { pricing: { input: 1, output: 5 }, adaptiveThinking: false },
  'claude-sonnet-5': { pricing: { input: 2, output: 10 }, adaptiveThinking: true },
  'claude-opus-4-8': { pricing: { input: 5, output: 25 }, adaptiveThinking: true },
  'claude-opus-5-5': { pricing: { input: 4, output: 20 }, adaptiveThinking: true },
}

export const MODEL_IDS = {
  haiku: 'claude-haiku-4-5',
  sonnet: 'claude-sonnet-5',
  opus: 'claude-opus-4-8',
  // react-engineer's one-week trial tier (see the header comment). Kept apart
  // from `opus` so art-director and mockup-designer are untouched.
  'opus-5-5': 'claude-opus-5-5',
}

export const PROD_MODELS = {
  'art-director': 'opus',
  'mockup-designer': 'opus',
  // Haiku 4.5 has vision; this gate is a floors-check (canvas %, hero scale,
  // color coverage) against the measurables the Art Director already
  // declared, not a taste call — Sonnet's judgment was never the bottleneck.
  'mockup-critic': 'haiku',
  'react-engineer': 'opus-5-5',
  'screenshot-critic': 'sonnet',
}

// opus-5-5 ranks above opus so the dev-tier cap below still lands react-
// engineer on Sonnet locally, same as every other agent above DEV_CEILING.
const TIER_RANK = { haiku: 0, sonnet: 1, opus: 2, 'opus-5-5': 3 }
const DEV_CEILING = 'sonnet'

export function isDevModelTier() {
  const tier = process.env.PIPELINE_TIER
  if (tier === 'prod') return false
  if (tier === 'dev') return true
  // No explicit tier: API key → prod (billed, off the subscription pool);
  // otherwise → dev (local Max-plan run, cap to spare the Opus budget).
  return !process.env.ANTHROPIC_API_KEY
}

/**
 * Resolve the model ID for an agent, capped to the dev ceiling in dev tier.
 * @param {string} agentName
 * @returns {string} Explicit model ID (e.g. 'claude-opus-4-8')
 */
export function modelFor(agentName) {
  const tier = PROD_MODELS[agentName] || 'sonnet'
  if (!isDevModelTier()) return MODEL_IDS[tier]
  return MODEL_IDS[TIER_RANK[tier] > TIER_RANK[DEV_CEILING] ? DEV_CEILING : tier]
}

/**
 * USD per million tokens for a model ID, or null when the pipeline does not
 * know the model — never zero, which would read as "free".
 * @param {string} model
 * @returns {{ input: number, output: number } | null}
 */
export function pricingFor(model) {
  return MODEL_CATALOG[model]?.pricing ?? null
}

/**
 * Whether the model accepts the `thinking` parameter. Unknown models are
 * assumed to, since every family after 4.5 does.
 * @param {string} model
 * @returns {boolean}
 */
export function supportsAdaptiveThinking(model) {
  return MODEL_CATALOG[model]?.adaptiveThinking ?? true
}
