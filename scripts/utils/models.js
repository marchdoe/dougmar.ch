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
 * 'opus'. The mockup critic moved to the same tier with spec 11's 1d, when it
 * became a taste judge rather than a floors check. Dev caps every agent at DEV_CEILING (Sonnet) so local runs stay off
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
 * `PIPELINE_TIER=dev|prod` env var overrides this either way. `MODEL_OVERRIDE`
 * swaps single agents' tiers for one run (scripts/replay-mockup.js sets it);
 * see parseModelOverride.
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
  // react-engineer's trial tier, and the mockup critic's since spec 11 1d (see
  // the header comment). Kept apart from `opus` so art-director and
  // mockup-designer are untouched.
  'opus-5-5': 'claude-opus-5-5',
}

export const PROD_MODELS = {
  'art-director': 'opus',
  'mockup-designer': 'opus',
  // A taste judge since spec 11's 1d: freshness, legibility, hierarchy, the
  // hero in the first fold at 1440 and 360, copy against the work records,
  // and the header, footer and ground declarations. The floors it used to check on Haiku are measured in code now
  // (mockup-precheck.js, #671). On 2026-09-28 Haiku approved a hero below
  // the 1440 fold and an invented FishSticks description. About $0.10 a round.
  'mockup-critic': 'opus-5-5',
  'react-engineer': 'opus-5-5',
  'screenshot-critic': 'sonnet',
}

// opus-5-5 ranks above opus so the dev-tier cap below still lands react-
// engineer and the mockup critic on Sonnet locally, same as every other agent
// above DEV_CEILING.
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
 * Read `MODEL_OVERRIDE`, a per-run replacement for PROD_MODELS entries
 * (spec 11, 1e): `agent=tier` pairs separated by commas, e.g.
 * `art-director=opus-5-5,mockup-designer=opus-5-5`. The Phase 2 taste test
 * runs the same night on two models, and editing PROD_MODELS in a commit
 * before each run (how the 2026-09-23 arms ran) is the thing this replaces.
 * An agent PROD_MODELS does not name, a tier MODEL_IDS does not name, or a
 * malformed pair throws: a typo must not quietly run the model under test on
 * the default. The override replaces the tier only; the dev cap below still
 * applies, so a replay sets PIPELINE_TIER=prod beside it.
 *
 * @param {string|undefined} raw
 * @returns {Record<string, string>} agent name to tier
 */
export function parseModelOverride(raw) {
  if (raw === undefined || raw.trim() === '') return {}
  const overrides = {}
  for (const pair of raw.split(',')) {
    const [agent, tier] = parseOverridePair(pair)
    if (Object.hasOwn(overrides, agent)) {
      throw new Error(`MODEL_OVERRIDE: "${agent}" is named twice`)
    }
    overrides[agent] = tier
  }
  return overrides
}

/**
 * One `agent=tier` pair, checked against PROD_MODELS and MODEL_IDS.
 * @param {string} pair
 * @returns {[string, string]}
 */
function parseOverridePair(pair) {
  const [agent, tier, ...rest] = pair.split('=').map((s) => s.trim())
  if (!agent || !tier || rest.length > 0) {
    throw new Error(`MODEL_OVERRIDE: "${pair}" is not agent=tier`)
  }
  if (!Object.hasOwn(PROD_MODELS, agent)) {
    throw new Error(
      `MODEL_OVERRIDE: unknown agent "${agent}" (known: ${Object.keys(PROD_MODELS).join(', ')})`
    )
  }
  if (!Object.hasOwn(MODEL_IDS, tier)) {
    throw new Error(
      `MODEL_OVERRIDE: unknown tier "${tier}" (known: ${Object.keys(MODEL_IDS).join(', ')})`
    )
  }
  return [agent, tier]
}

/**
 * Resolve the model ID for an agent, capped to the dev ceiling in dev tier.
 * `MODEL_OVERRIDE` (see parseModelOverride) replaces the agent's tier first.
 * @param {string} agentName
 * @returns {string} Explicit model ID (e.g. 'claude-opus-4-8')
 */
export function modelFor(agentName) {
  const override = parseModelOverride(process.env.MODEL_OVERRIDE)
  const tier = override[agentName] || PROD_MODELS[agentName] || 'sonnet'
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
