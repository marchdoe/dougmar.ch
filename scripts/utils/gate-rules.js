/**
 * Every gate the build enforces against the React Engineer's output, stated
 * from the same constants the validator checks against.
 *
 * Run 33756500843 (#432) failed on two gates in one attempt each —
 * `dangerouslySetInnerHTML` and a disallowed URL host — and
 * `react-engineer.md` was silent on both, because the security scan's
 * pattern list and host allowlist lived only inside `validateGenerated` and
 * nobody had transcribed them into the prompt. The transcription itself was
 * already stale where it existed: the hand-written host list was missing
 * `doug-march.com` and `www.w3.org`, both of which `ALLOWED_URL_HOSTS`
 * actually allows.
 *
 * This module reads the validator's own exported constants — not a copy of
 * them — and renders one line per gate into `react-engineer.md` at load
 * time (`scripts/design-agents.js`, the `{{GATES}}` placeholder). A gate the
 * validator can fail the build on and this module does not name is a
 * contradiction in terms, and `tests/utils/gate-rules.test.js` fails the
 * suite the day one appears.
 *
 * @see https://github.com/marchdoe/dougmar.ch/issues/432
 */

import { ALLOWED_URL_HOSTS, DANGEROUS_PATTERNS } from './build-validator.js'
import { AI_VOCABULARY, CONNECTIVE_TELLS, ORPHAN_SEPARATOR_FIX, TELLS } from './copy-tells.js'
import { REQUIRED_FILES } from './engineer-output-check.js'
import {
  ALLOWED_EXACT,
  ALLOWED_WRITE_PREFIXES,
  ENGINEER_COMPONENT_FILES,
  FORBIDDEN_EXACT,
  FORBIDDEN_PREFIXES,
} from './file-manager.js'
import { LINE_LENGTH_FIX, LINE_LENGTH_OPTIONS } from './line-length.js'
import {
  OG_CARD_VIEWPORT,
  OG_FIT_FIX,
  OG_SAFE_MARGIN_PX,
  OG_TEXTURE_MAX_OPACITY,
} from './og-card-fit.js'
import { INVISIBLE_FIX, STRANDED_FIX, WORD_BREAK_FIX } from './render-health.js'
import {
  LINE_LENGTH_MAX_CHARS,
  SMALL_COPY_FLOOR_PX,
  SMALL_TEXT_FLOOR_PX,
} from './responsive-thresholds.js'
import { SEMANTIC_COLOR_NAMES } from './semantic-contract.js'
import { SHELL_OVERLAP_FIX, SHELL_OVERLAP_MIN_OPACITY } from './shell-overlap.js'
import { SMALL_COPY_FIX, SMALL_TEXT_FIX } from './small-text.js'
import {
  BOX_PAST_VIEWPORT_FIX,
  BRAND_CONTRAST_MIN,
  BRAND_MARK_MIN_PX,
  RUNNING_COPY_FIX,
  RUNNING_COPY_MAX_PX,
  RUNNING_COPY_MIN_CHARS,
  TEXT_WIDER_THAN_BOX_FIX,
  VIEWPORT_RUNGS,
} from './surface-gate.js'
import {
  CONTRAST_FIX,
  LARGE_BOLD_TEXT_PX,
  LARGE_TEXT_PX,
  TEXT_CONTRAST_ERROR_BELOW,
  TEXT_CONTRAST_WARN_BELOW,
  UNRESOLVED_FIX,
} from './text-contrast.js'
import { correctedSpacingForm, SPACED_SPACING_WHY } from './token-gate.js'

/**
 * @typedef {object} GateRule
 * @property {string} gate short, stable id for the gate (used by tests)
 * @property {string} rule one line, imperative, values listed verbatim —
 *   ready to render as a markdown bullet
 * @property {string} source where the rule's values come from, e.g.
 *   `'build-validator.js ALLOWED_URL_HOSTS'`
 */

/**
 * The forbidden-code-pattern gate: `validateGenerated`'s Check 5 rejects any
 * of `DANGEROUS_PATTERNS` in a scanned file. One line naming every pattern
 * by the same name the scan reports it under, so the string a build failure
 * quotes is the string the engineer already read.
 *
 * @returns {GateRule}
 */
function forbiddenPatternsRule() {
  const names = DANGEROUS_PATTERNS.map((p) => p.name)
  return {
    gate: 'forbidden-code-patterns',
    rule:
      'The security scan rejects any of these in a file you write, however it is spelled — ' +
      `${names.join(', ')}. There is no exception for a comment or a string that merely mentions one.`,
    source: 'build-validator.js DANGEROUS_PATTERNS',
  }
}

/**
 * The URL-host gate: `validateGenerated`'s Check 5 rejects a `https://` URL
 * in a string literal whose host is not in `ALLOWED_URL_HOSTS`.
 *
 * @returns {GateRule}
 */
function allowedUrlHostsRule() {
  const hosts = [...ALLOWED_URL_HOSTS].sort()
  return {
    gate: 'allowed-url-hosts',
    rule:
      'A URL in a string literal may point only at one of these hosts — ' +
      `${hosts.join(', ')} — every other host fails the build, including a host that merely looks like one of these (a subdomain, a lookalike, a longer domain that starts with one).`,
    source: 'build-validator.js ALLOWED_URL_HOSTS',
  }
}

/**
 * The required-files gate: `findMissingRequiredFiles` rejects an engineer
 * response that omits any of `REQUIRED_FILES`.
 *
 * A full generation is checked against its own reply, so it must carry
 * every one of them. A patch (`patch: true` — a repair or a revision) is
 * checked against the reply merged over what is already on disk (#447): a
 * file the reply omits stays as it was, so the patch contract asks for the
 * opposite of the full-generation one — send only what changed.
 *
 * @param {{ patch?: boolean }} [options]
 * @returns {GateRule}
 */
function requiredFilesRule({ patch = false } = {}) {
  if (patch) {
    return {
      gate: 'required-files',
      rule:
        'This check runs against the merged result, not this reply: a file you do not return ' +
        'stays on disk exactly as it was, so you do not need to resend every one of ' +
        `${REQUIRED_FILES.join(', ')} to keep them present. Only an empty block that deletes ` +
        'one of them without a replacement in the same reply leaves it missing and triggers an ' +
        'automatic retry.',
      source: 'engineer-output-check.js REQUIRED_FILES',
    }
  }
  return {
    gate: 'required-files',
    rule:
      'Every response must include every one of: ' +
      `${REQUIRED_FILES.join(', ')} — omitting any one of them triggers an automatic retry.`,
    source: 'engineer-output-check.js REQUIRED_FILES',
  }
}

/**
 * The `## Required output files` section `react-engineer.md` renders at
 * `{{REQUIRED_FILES}}` — the full-generation contract (send all of
 * `REQUIRED_FILES` every time) or the patch contract (send only what
 * changed; the rest stays as it is on disk). Kept beside `requiredFilesRule`
 * so the section and the gate line it must agree with can't drift apart the
 * way they did before #447.
 *
 * @param {{ patch?: boolean }} [options]
 * @returns {string} markdown, no heading
 */
export function formatRequiredFilesSection({ patch = false } = {}) {
  const list = REQUIRED_FILES.map((p) => `- ${p}`).join('\n')
  if (patch) {
    return (
      'This is a patch call: return ONLY the files the brief below asks you to change. ' +
      'These files are still required in the finished result, but not in this reply — a file ' +
      "you don't return stays on disk exactly as it was written earlier in this run:\n\n" +
      `${list}\n\n` +
      'Deleting one of them (an empty `===FILE:path===` block) without writing a replacement ' +
      'in the same reply leaves it missing from the merged result and fails the build. Any new ' +
      'component the fix needs still goes under `app/components/generated/`; the other files ' +
      'under `app/components/` are hand-written and the write is rejected.\n\n' +
      'Layout.tsx, when you touch it, still needs a named export (`export function Layout`) ' +
      'that imports and renders Sidebar and wraps `{children}`.'
    )
  }
  return (
    `Respond with ===FILE:...=== blocks for ALL of these, every time:\n\n${list}\n\n` +
    'plus any additional components the translation genuinely needs, each under\n' +
    '`app/components/generated/`. That directory is yours alone: the nightly\n' +
    "deletes whatever in it today's files do not import, so a component from a\n" +
    'previous night is gone unless you import it again. The other files under\n' +
    '`app/components/` are hand-written and the write is rejected.\n\n' +
    'Layout.tsx must use a named export (`export function Layout`), import and render Sidebar, and wrap `{children}`. __root.tsx imports it by name and passes the route outlet as children; forgetting `{children}` compiles but renders blank pages.'
  )
}

/**
 * The write-location gate: `validateWritePath` rejects any write outside
 * `ALLOWED_WRITE_PREFIXES`/`ALLOWED_EXACT`, and rejects `FORBIDDEN_EXACT`/
 * `FORBIDDEN_PREFIXES` outright even when they would otherwise match an
 * allowed prefix.
 *
 * @returns {GateRule}
 */
function writeLocationsRule() {
  const engineerExact = [...ENGINEER_COMPONENT_FILES].sort()
  const presetExact = [...ALLOWED_EXACT].filter((p) => !ENGINEER_COMPONENT_FILES.includes(p)).sort()
  const forbiddenExact = [...FORBIDDEN_EXACT].sort()
  return {
    gate: 'write-locations',
    rule:
      `A file may be written only under ${ALLOWED_WRITE_PREFIXES.join(', ')}, or at the exact path ` +
      `${engineerExact.join(' or ')}; every component you invent goes under app/components/generated/, and any other path under app/components/ is rejected. ` +
      `${presetExact.join(' and ')} are the Art Director's and the orchestrator's — never write them yourself. ` +
      `${forbiddenExact.join(', ')} and anything under ${FORBIDDEN_PREFIXES.join(', ')} are rejected outright, even though the prefix would otherwise match.`,
    source: 'file-manager.js validateWritePath allowlist',
  }
}

/**
 * The frozen-semantic-colour gate: `checkPresetContract` and
 * `findOffContractColorValues` reject any colour-position value that is not
 * one of `SEMANTIC_COLOR_NAMES`. Stated tersely here as a build-failure
 * fact; the full role of each name is in the `{{SEMANTIC_COLOR_CONTRACT}}`
 * block above.
 *
 * @returns {GateRule}
 */
function frozenSemanticColorsRule() {
  return {
    gate: 'frozen-semantic-colors',
    rule:
      'A value in a colour position must be exactly one of the frozen semantic names — ' +
      `${SEMANTIC_COLOR_NAMES.join(', ')} — nothing else resolves, not even a real palette token such as \`sand.300\`.`,
    source: 'semantic-contract.js SEMANTIC_COLOR_NAMES',
  }
}

/**
 * Every gate the build enforces against the React Engineer's output, in the
 * order `react-engineer.md` should list them.
 *
 * `root` is accepted for parity with the codebase's other prompt-generation
 * collectors (`readPatternProps`, `checkPresetContract`) and for a future
 * gate that reads a generated file; every rule here comes from a static
 * import and does not use it today.
 *
 * @param {{ root?: string, patch?: boolean }} [_options] `patch` selects the
 *   patch-contract wording for the required-files gate (#447)
 * @returns {GateRule[]}
 */
export function collectGateRules({ patch = false } = {}) {
  return [
    forbiddenPatternsRule(),
    allowedUrlHostsRule(),
    requiredFilesRule({ patch }),
    writeLocationsRule(),
    frozenSemanticColorsRule(),
  ]
}

/* ------------------------------------------------------------------ *
 * The surface gate's checklist (#634)
 * ------------------------------------------------------------------ */

/**
 * @typedef {object} SurfaceRule
 * @property {string} gate short, stable id for the rule (used by tests)
 * @property {string[]} kinds the finding kinds this rule answers for; the
 *   drift test in `tests/utils/gate-rules.test.js` holds every error kind the
 *   gate can raise against one of these
 * @property {string} rule one line: what is measured, then the fix line the
 *   gate's finding ends with, quoted from the gate's own constant
 */

/** The rung widths the surface gate renders at, and the desktop fold. */
function rungWidths() {
  const rung = (name) => VIEWPORT_RUNGS.find((r) => r.name === name)
  return {
    phone: rung('mobile').width,
    tablet: rung('tablet').width,
    desktop: rung('desktop').width,
    fold: rung('desktop').height,
  }
}

/** A connective tell's regex as the phrase it matches, for a prompt line. */
function phraseOf(re) {
  return re.source
    .replace(/\\b/g, '')
    .replace(/\\w\+\.\{0,40\}, but$/, 'X, but Y')
    .replace(/\[['’]+\]/, "'")
}

/** The fix line `copy-tells.js` gives a tell, by its id. */
function tellFix(id) {
  return TELLS.find((t) => t.tell === id).fix
}

/**
 * Every rule the surface gate, and the copy and token gates beside it,
 * measure on the engineer's pages, each ending with the fix line its finding
 * ends with. The first passes on 2026-09-21 measured 21 to 127 errors against
 * these, which until then the engineer learned only from repair briefs (#634).
 *
 * @returns {SurfaceRule[]}
 */
export function collectSurfaceRules() {
  const { phone, tablet, desktop, fold } = rungWidths()
  const all = `${phone}, ${tablet} and ${desktop}`
  const both = `${phone} and ${desktop}`
  return [
    {
      gate: 'fit',
      kinds: ['overflow', 'clipped'],
      rule:
        `At ${all} the page is no wider than the viewport, no box ends past the viewport's ` +
        `right edge, and no text is wider than its own box. ${tablet} is measured too: a ` +
        `layout that keeps its ${desktop} grid there runs out of room. A box past the edge: ` +
        `"${BOX_PAST_VIEWPORT_FIX}" Type wider than its box: "${TEXT_WIDER_THAN_BOX_FIX}"`,
    },
    {
      gate: 'word-break',
      kinds: ['word-break'],
      rule: `At ${both} no word sits on two lines. ${WORD_BREAK_FIX}`,
    },
    {
      gate: 'running-copy',
      kinds: ['running-copy'],
      rule:
        `No block of ${RUNNING_COPY_MIN_CHARS} characters or more is set over ` +
        `${RUNNING_COPY_MAX_PX}px. ${RUNNING_COPY_FIX}`,
    },
    {
      gate: 'line-length',
      kinds: ['line-length'],
      rule:
        `At ${all} no rendered line of a p, li or blockquote of ${LINE_LENGTH_OPTIONS.minWords} ` +
        `words or more holds over ${LINE_LENGTH_MAX_CHARS} characters. ${LINE_LENGTH_FIX}`,
    },
    {
      gate: 'type-size',
      kinds: ['small-copy', 'small-text'],
      rule:
        `At ${both}, running copy (p, li, blockquote) is ${SMALL_COPY_FLOOR_PX}px or larger. ` +
        `${SMALL_COPY_FIX} Any other visible text is ${SMALL_TEXT_FLOOR_PX}px or larger. ` +
        `${SMALL_TEXT_FIX} \`xs\` is for labels, set in a span or div.`,
    },
    {
      gate: 'contrast',
      kinds: ['contrast', 'contrast-unresolved'],
      rule:
        `At ${both} in both colour schemes, text under ${LARGE_TEXT_PX}px (under ` +
        `${LARGE_BOLD_TEXT_PX}px when bold) under ${TEXT_CONTRAST_ERROR_BELOW}:1 against what ` +
        `it renders over forces a revision, and under ${TEXT_CONTRAST_WARN_BELOW}:1 is a ` +
        `warning. ${CONTRAST_FIX} \`text\` clears 4.5:1 on \`bg\`, \`bgAlt\` and \`surface\`; ` +
        'check any other ink or the accent before setting small type in it. Text over an image, ' +
        `a gradient, ruled lines or a painting layer is not measured. ${UNRESOLVED_FIX}`,
    },
    {
      gate: 'invisible-text',
      kinds: ['invisible-text'],
      rule:
        'No text is painted in nothing (a transparent colour with no stroke and no clipped ' +
        `background). ${INVISIBLE_FIX}`,
    },
    {
      gate: 'stranded-text',
      kinds: ['stranded-text'],
      rule: `With reduced motion on, no text is left at opacity: 0. ${STRANDED_FIX}`,
    },
    {
      gate: 'copy-tells',
      kinds: ['copy-tell'],
      rule:
        'In the words you write, rendered and in your files: no em dash and no en dash set as a ' +
        `dash (${tellFix('em-dash')}); nothing about the site rebuilding itself ` +
        `(${tellFix('self-reference')}); none of ${AI_VOCABULARY.join(', ')} ` +
        `(${tellFix('ai-vocabulary')}); none of ${CONNECTIVE_TELLS.map(phraseOf).join(', ')} ` +
        `(${tellFix('connective')}).`,
    },
    {
      gate: 'orphan-separator',
      kinds: ['copy-tell'],
      rule:
        'No line of text opens or closes on a separator (a comma, a middle dot, a bar, a dash, ' +
        `a spaced slash). ${ORPHAN_SEPARATOR_FIX}`,
    },
    {
      gate: 'spaced-spacing',
      kinds: ['spaced'],
      rule:
        `One spacing token per property: \`padding: '4 0'\` ships as 4px 0px and fails the ` +
        `token gate. ${SPACED_SPACING_WHY} Write ${correctedSpacingForm('padding', ['4', '0'])}.`,
    },
    {
      gate: 'heading-and-nav',
      kinds: ['heading', 'hero-fold', 'nav-reach'],
      rule:
        `Every route renders an h1, and at ${desktop} its top sits inside the first ${fold}px. ` +
        `Every route shows a visible link to /about at ${both}.`,
    },
    {
      gate: 'shell-overlap',
      kinds: ['shell-overlap'],
      rule:
        `At ${all}, no text in Layout or Sidebar at opacity ${SHELL_OVERLAP_MIN_OPACITY} or ` +
        'more lands on the text of a hand-written route (/work, /experiments, /elements). ' +
        `Fix: ${SHELL_OVERLAP_FIX}`,
    },
    {
      gate: 'brand-mark',
      kinds: ['brand-fold', 'brand-contrast'],
      rule:
        `The brand mark sits inside the first fold at ${both}, at least ${BRAND_MARK_MIN_PX}px ` +
        `tall at ${desktop}; a single-color mark reaches ${BRAND_CONTRAST_MIN}:1 on its ground.`,
    },
    {
      gate: 'og-card-fit',
      kinds: ['og-fit'],
      rule:
        `The share card (/og) is measured once, at ${OG_CARD_VIEWPORT.width}x` +
        `${OG_CARD_VIEWPORT.height} in the light scheme, the size it is captured at: every ` +
        'visible line of text and the whole brand lockup, mark and wordmark, sit at least ' +
        `${OG_SAFE_MARGIN_PX}px inside every edge of the card, and no ancestor's overflow cuts ` +
        `any of it. Type inside an aria-hidden layer at opacity ${OG_TEXTURE_MAX_OPACITY} or ` +
        `less is texture and exempt. ${OG_FIT_FIX}`,
    },
  ]
}

/**
 * Renders `collectGateRules()`'s output as the `## Gates the build enforces`
 * block that replaces `{{GATES}}` in `react-engineer.md`, followed by the
 * surface gate's checklist (#634).
 *
 * @param {GateRule[]} rules
 * @param {SurfaceRule[]} [surfaceRules] defaults to {@link collectSurfaceRules}
 * @returns {string} markdown
 */
export function formatGateRulesForPrompt(rules, surfaceRules = collectSurfaceRules()) {
  const lines = [
    '## Gates the build enforces',
    '',
    'Each of these can fail your response outright — not a style preference, a hard ' +
      'reject. The wording below is generated from the same constants the build checks ' +
      'against, so it cannot drift from what actually runs the way a hand-written list can.',
    '',
  ]
  for (const { rule } of rules) {
    lines.push(`- ${rule}`)
  }
  const { phone, tablet, desktop } = rungWidths()
  lines.push(
    '',
    '## Surface gate checklist',
    '',
    `The surface gate renders every route at ${phone}, ${tablet} and ${desktop} in both colour ` +
      'schemes and measures each line below. A miss forces a revision. Each rule and the fix ' +
      'after it are generated from the gate, in the words its findings use. Check every line ' +
      'against your files before you answer.',
    ''
  )
  for (const { rule } of surfaceRules) {
    lines.push(`- ${rule}`)
  }
  return lines.join('\n')
}
