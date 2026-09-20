/**
 * Chassis helpers — deterministic transforms from a chassis entry into the
 * artifacts the orchestrator injects:
 *
 *   buildGoogleFontsUrl(chassis)   → CSS2 stylesheet href for __root.tsx
 *   buildFontTokens(chassis)       → theme.tokens.fonts object
 *   buildFontSizes(chassis)        → theme.tokens.fontSizes object
 *   buildTextStyles(chassis)       → theme.textStyles object (size+leading+tracking)
 *   buildFontWeights(chassis)      → theme.tokens.fontWeights object
 *   buildLineHeights(chassis)      → legacy named tokens, derived from the step table
 *   buildLetterSpacings(chassis)   → legacy named tokens, derived from the step table
 *   buildSpacing(chassis)          → theme.tokens.spacing, rhythm-derived
 *   renderRootTemplate(url)        → __root.tsx contents with URL substituted
 *   renderChassisPresetFile(c)     → elements/chassis-preset.ts contents
 *
 * The type system lives in the chassis (elements/chassis/*.js): each entry
 * carries an explicit step table (size, lineHeight, tracking per step), a
 * fontWeights map, and an optional spacing rhythm. Everything here is a
 * read of that table — no ratio math, that happens once at authoring time
 * via elements/chassis/scale.js.
 *
 * No I/O lives here except renderRootTemplate (which reads the template
 * fresh per call). Keep it pure so the preview script and the orchestrator
 * share identical behavior.
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RAMP_STEPS } from '../../elements/chassis/scale.js'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** The narrow end of the viewport window, as the prompts quote it. */
const NARROW_PX = NARROW_VIEWPORT.width
const TEMPLATE_PATH = resolve(__dirname, '../templates/__root.tsx.template')

/**
 * Build the Google Fonts CSS2 URL for the chassis.
 *
 * Format examples:
 *   No italics:   family=Outfit:wght@300;400;500
 *   With italics: family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700
 *
 * Two font tokens may name the same family (a single-family chassis runs its
 * display and body off one face). CSS2 rejects a repeated family parameter,
 * so entries are merged per family: weights union, italics OR.
 *
 * Always ends with &display=swap for consistent FOIT/FOUT behavior across
 * chassis. The validator allowlists fonts.googleapis.com only.
 */
export function buildGoogleFontsUrl(chassis) {
  /** @type {Map<string, {weights: Set<number>, italics: boolean}>} */
  const byFamily = new Map()
  for (const font of Object.values(chassis.fonts)) {
    const entry = byFamily.get(font.family) || { weights: new Set(), italics: false }
    for (const w of font.weights) entry.weights.add(w)
    entry.italics = entry.italics || font.italics
    byFamily.set(font.family, entry)
  }

  const families = [...byFamily.entries()].map(([family, { weights: weightSet, italics }]) => {
    const familyParam = family.replace(/\s+/g, '+')
    const weights = [...weightSet].sort((a, b) => a - b)

    if (italics) {
      // ital,wght axis: cartesian product, italic-first then weight-first.
      // Order matters — Google Fonts requires axis values ascending.
      const tuples = []
      for (const ital of [0, 1]) {
        for (const w of weights) tuples.push(`${ital},${w}`)
      }
      return `family=${familyParam}:ital,wght@${tuples.join(';')}`
    }

    return `family=${familyParam}:wght@${weights.join(';')}`
  })

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

/**
 * Build the theme.tokens.fonts object for preset.ts. Components reference
 * these by token name (e.g. fontFamily: 'display'), so the keys here are
 * the contract — must match what Layout/Sidebar/etc. expect.
 *
 * Value format: '"Family Name", Fallback1, Fallback2, generic'
 * Multi-word families get double-quoted; single-word fallbacks don't.
 */
export function buildFontTokens(chassis) {
  const tokens = {}
  for (const [key, font] of Object.entries(chassis.fonts)) {
    const stack = [font.family, ...font.fallbacks].map(quoteIfMultiWord).join(', ')
    tokens[key] = { value: stack }
  }
  return tokens
}

/** Quote any font name with internal whitespace ("Times New Roman") but
 * leave bare identifiers (Georgia, system-ui, serif) alone. */
function quoteIfMultiWord(name) {
  return /\s/.test(name) ? `"${name}"` : name
}

/** The chassis step table, with every ramp step present or an error naming
 * the gap — a missing step would otherwise ship a bare-identifier token. */
function stepsOf(chassis) {
  const steps = chassis.type?.steps
  if (!steps) throw new Error(`chassis ${chassis.id ?? '(unnamed)'} has no type.steps table`)
  for (const step of RAMP_STEPS) {
    if (!steps[step]?.size) {
      throw new Error(`chassis ${chassis.id ?? '(unnamed)'} step table is missing "${step}"`)
    }
  }
  return steps
}

/**
 * Build the theme.tokens.fontSizes object for the chassis — a straight read
 * of the step table.
 */
export function buildFontSizes(chassis) {
  const steps = stepsOf(chassis)
  const sizes = {}
  for (const step of RAMP_STEPS) {
    sizes[step] = { value: steps[step].size }
  }
  return sizes
}

/**
 * Build the theme.textStyles object: one style per ramp step carrying
 * size, leading and tracking together, so a component writes
 * `textStyle: 'hero'` instead of assembling three properties by hand.
 *
 * fontSize references the step's own token by name; Panda resolves token
 * names inside textStyles the same way it does in css(), so the size has
 * one source of truth.
 */
export function buildTextStyles(chassis) {
  const steps = stepsOf(chassis)
  const styles = {}
  for (const step of RAMP_STEPS) {
    styles[step] = {
      value: {
        fontSize: step,
        lineHeight: String(steps[step].lineHeight),
        letterSpacing: steps[step].tracking,
      },
    }
  }
  return styles
}

/** Build theme.tokens.fontWeights from the chassis weights map. */
export function buildFontWeights(chassis) {
  const weights = chassis.type?.weights
  if (!weights || Object.keys(weights).length === 0) {
    throw new Error(`chassis ${chassis.id ?? '(unnamed)'} has no type.weights map`)
  }
  const tokens = {}
  for (const [name, weight] of Object.entries(weights)) {
    tokens[name] = { value: String(weight) }
  }
  return tokens
}

/**
 * Legacy named lineHeights (tight/snug/normal/loose), derived from the step
 * table instead of re-invented nightly — `tight` ranged 0.85 to 1.02 across
 * six Art Director presets before the chassis owned it (#253).
 */
export function buildLineHeights(chassis) {
  const steps = stepsOf(chassis)
  const normal = steps.base.lineHeight
  return {
    tight: { value: String(steps.hero.lineHeight) },
    snug: { value: String(steps['2xl'].lineHeight) },
    normal: { value: String(normal) },
    loose: { value: String(Math.round((normal + 0.2) * 100) / 100) },
  }
}

/**
 * Legacy named letterSpacings (tight/normal/wide/wider/widest), derived
 * from the step table. `wide` is the small-step opening; `wider`/`widest`
 * scale it up for caps labels, so a chassis that opens its captions more
 * gets proportionally airier smallcaps.
 */
export function buildLetterSpacings(chassis) {
  const steps = stepsOf(chassis)
  const wide = parseEm(steps['2xs'].tracking)
  return {
    tight: { value: steps['2xl'].tracking },
    normal: { value: steps.base.tracking },
    wide: { value: formatEm(wide) },
    wider: { value: formatEm(wide * 2) },
    widest: { value: formatEm(wide * 3.5) },
  }
}

function parseEm(value) {
  if (value === '0') return 0
  const match = /^(-?[\d.]+)em$/.exec(value)
  if (!match) throw new Error(`tracking must be an em value or '0', got: ${value}`)
  return parseFloat(match[1])
}

function formatEm(n) {
  const rounded = Math.round(n * 1000) / 1000
  return rounded === 0 ? '0' : `${rounded}em`
}

/** The chassis rhythm in px: declared, or the body size times body leading. */
export function rhythmPx(chassis) {
  const steps = stepsOf(chassis)
  if (chassis.type.rhythm) return parseRem(chassis.type.rhythm) * 16
  return parseRem(steps.base.size) * 16 * steps.base.lineHeight
}

/**
 * Spacing multiples of the rhythm submultiple r/6, chosen so a 24px rhythm
 * reproduces the scale the Art Director used to re-type every night:
 * 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
 */
const SPACING_MULTIPLES = [1 / 6, 1 / 3, 2 / 3, 1, 4 / 3, 2, 8 / 3, 4, 16 / 3]

/**
 * Build theme.tokens.spacing as multiples of the chassis rhythm, so vertical
 * space and the body line-height share a base unit (the vertical-rhythm
 * principle the impeccable typography reference opens with). Token names
 * stay `1`-`9` and, at the catalog's usual 24px rhythm, the values are the
 * same nine the nightly presets carried.
 */
export function buildSpacing(chassis) {
  const r = rhythmPx(chassis)
  const tokens = {}
  SPACING_MULTIPLES.forEach((m, i) => {
    const px = Math.round(r * m * 2) / 2
    tokens[String(i + 1)] = { value: `${px}px` }
  })
  return tokens
}

/**
 * Resolve a step's rendered px size at a viewport width. Understands the
 * two size forms the schema allows: a rem value, or a `clamp()` whose middle
 * term is `<rem> + <vw>`.
 *
 * @param {{size: string}} step
 * @param {number} viewportPx
 * @returns {number} px, rounded to 0.1
 */
export function stepPxAt(step, viewportPx) {
  const clampMatch = /^clamp\(([\d.]+)rem,\s*(-?[\d.]+)rem \+ ([\d.]+)vw,\s*([\d.]+)rem\)$/.exec(
    step.size
  )
  let rem
  if (clampMatch) {
    const [min, intercept, vw, max] = clampMatch.slice(1).map(Number)
    rem = Math.min(Math.max(min, intercept + (vw / 100) * (viewportPx / 16)), max)
  } else {
    rem = parseRem(step.size)
  }
  return Math.round(rem * 16 * 10) / 10
}

/**
 * Read the frozen __root.tsx template and substitute its placeholders:
 * {{GOOGLE_FONTS_URL}}, {{OG_META}}, and {{ARCHIVE_COUNT}}.
 *
 * The template lives at scripts/templates/__root.tsx.template. Agents never
 * author it, which is why the archive link lives there (#155).
 *
 * Read fresh on every call so a developer editing the template during a
 * dev loop sees changes without a node restart. Cost is negligible.
 */
export function renderRootTemplate(googleFontsUrl, ogMeta = '', archiveCount = 0) {
  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  if (!template.includes('{{GOOGLE_FONTS_URL}}')) {
    throw new Error('__root.tsx.template missing {{GOOGLE_FONTS_URL}} placeholder')
  }
  if (!template.includes('{{OG_META}}')) {
    throw new Error('__root.tsx.template missing {{OG_META}} placeholder')
  }
  if (!template.includes('{{ARCHIVE_COUNT}}')) {
    throw new Error('__root.tsx.template missing {{ARCHIVE_COUNT}} placeholder')
  }
  return template
    .replace('{{GOOGLE_FONTS_URL}}', googleFontsUrl)
    .replace('{{OG_META}}', ogMeta)
    .replace('{{ARCHIVE_COUNT}}', String(archiveCount))
}

function parseRem(value) {
  const match = /^([\d.]+)rem$/.exec(value)
  if (!match) throw new Error(`expected a rem value, got: ${value}`)
  return parseFloat(match[1])
}

/**
 * The keyframes every declared entrance and ground reaches for (#506).
 *
 * Orchestrator-owned, like the ramp: the engineer names them in `animation`
 * and never writes a keyframe of its own. Three entrances at 500ms (the
 * motion-design reference's entrance band) and one ground drift over 40s.
 * Only `opacity`, `transform` and `clip-path` are animated, so nothing here
 * can move layout. `drift` is a transform, not a background-position, for the
 * same reason: it works on any field, gradient or flat, and the engineer's
 * property allowlist stays three long.
 *
 * @type {Record<string, Record<string, Record<string, string>>>}
 */
export const MOTION_KEYFRAMES = {
  settle: {
    from: { opacity: '0', transform: 'translateY(8px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  rise: {
    from: { opacity: '0', transform: 'translateY(24px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  wipe: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)' },
  },
  drift: {
    from: { transform: 'translate3d(0, 0, 0) scale(1.04)' },
    to: { transform: 'translate3d(-2%, 1.5%, 0) scale(1.04)' },
  },
}

/**
 * The reduced-motion rule, emitted with the keyframes so a declared entrance
 * is never the reason a visitor with `prefers-reduced-motion` sees the page
 * lurch: every animation and transition collapses to its end state in 0.01ms.
 * The values carry `!important` because the engineer's `animation` shorthand
 * sets the duration on the element, and a global rule loses to that without it.
 * The delay is zeroed too, which the usual snippet leaves out: a staggered
 * sibling with `animation-fill-mode: both` sits at its starting state, which
 * is invisible, for the whole of its delay, and a 0.01ms duration does nothing
 * about that. The first reduced-motion strip showed the hero's rows arriving
 * 80 to 240ms late on a page that was supposed to arrive fully formed.
 *
 * `animation-name: none` is what makes the claim above true of `reveal:
 * on-scroll`. A `view()` timeline takes its progress from scroll position, not
 * from the clock, so duration and delay mean nothing to it — the three lines
 * below leave a scroll-driven reveal exactly as it was, holding its section at
 * the 0% state of `rise`, which is `opacity: 0`. Removing the animation
 * outright is the only one of these that reaches it, and it is also the
 * safest shape: with no animation there is nothing for `fill-mode` to apply,
 * so the element falls back to its own styles, which are its end state. The
 * other four stay because they also govern transitions, and because a rule
 * that collapses time-based motion should keep saying so on its own.
 *
 * @type {Record<string, Record<string, Record<string, string>>>}
 */
export const REDUCED_MOTION_RULE = {
  '@media (prefers-reduced-motion: reduce)': {
    '*, *::before, *::after': {
      animationName: 'none !important',
      animationDuration: '0.01ms !important',
      animationDelay: '0s !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
    },
  },
}

/**
 * Render the contents of `elements/chassis-preset.ts` for a chosen chassis.
 * The orchestrator writes this file each run so PandaCSS can merge the
 * chassis type system into the final design system.
 *
 * Listed LAST in panda.config.ts so everything here — fonts, the ramp,
 * weights, leading, tracking, spacing — wins over any values the Art
 * Director emits in elements/preset.ts. The Art Director owns color, radii
 * and semantic tokens; typography and spacing are chassis-owned, and
 * anything it writes for these groups is overridden by this merge order.
 *
 * It also pins `body { font-family: var(--fonts-body) }`. That declaration used
 * to be the Art Director's to write and 9 of the last 12 presets left it out,
 * so every element the engineer did not tag by hand rendered in Times with the
 * chassis body face loaded and unused (#252).
 *
 * The declaration goes under `globalCss.extend`, not `globalCss`. Panda merges
 * plain preset globalCss shallowly per selector and the last preset wins the
 * whole selector, so a bare `globalCss.body` here would delete the Art
 * Director's background, colour and margin along with it. Under `extend` the
 * two objects deep-merge and only `fontFamily` is taken.
 *
 * Since #506 it also carries the motion keyframes under `theme.extend.keyframes`
 * and the reduced-motion rule under the same `globalCss.extend`, for the same
 * reason the ramp lives here: the engineer declares `animation: 'rise 500ms
 * ...'` and must find `rise` defined whatever the Art Director wrote.
 */
export function renderChassisPresetFile(chassis) {
  const fonts = buildFontTokens(chassis)
  const sizes = buildFontSizes(chassis)
  const weights = buildFontWeights(chassis)
  const lineHeights = buildLineHeights(chassis)
  const letterSpacings = buildLetterSpacings(chassis)
  const spacing = buildSpacing(chassis)
  const textStyles = buildTextStyles(chassis)
  return `import { definePreset } from '@pandacss/dev'

/**
 * Generated from elements/chassis/${chassis.id}.js by scripts/utils/chassis.js.
 * Listed LAST in panda.config.ts so the chassis type system — fonts,
 * fontSizes, fontWeights, lineHeights, letterSpacings, spacing, textStyles —
 * wins over any values the Art Director emits in elements/preset.ts.
 *
 * Do not edit by hand — overwritten on every daily redesign.
 */
export const chassisPreset = definePreset({
  name: 'chassis',
  // Orchestrator-owned. \`extend\` deep-merges into the Art Director's
  // globalCss.body instead of replacing it. See scripts/utils/chassis.js.
  globalCss: {
    extend: {
      // lineHeight rides along with the font: the spacing scale is derived
      // from the base step's size times its leading, and rhythm only means
      // something if the body actually renders at that leading.
      body: { fontFamily: 'body', lineHeight: 'normal' },
      // Every animation and transition collapses to its end state when the
      // visitor asks for reduced motion (#506). See scripts/utils/chassis.js.
${formatNestedBlock(REDUCED_MOTION_RULE, 6)}
    },
  },
  theme: {
    extend: {
      // The entrances and the ground drift the engineer may name (#506).
${formatKeyframesBlock(MOTION_KEYFRAMES, 6)}
      tokens: {
${formatTokenBlock('fonts', fonts, 8)}
${formatTokenBlock('fontSizes', sizes, 8)}
${formatTokenBlock('fontWeights', weights, 8)}
${formatTokenBlock('lineHeights', lineHeights, 8)}
${formatTokenBlock('letterSpacings', letterSpacings, 8)}
${formatTokenBlock('spacing', spacing, 8)}
      },
${formatTextStylesBlock(textStyles, 6)}
    },
  },
})
`
}

/** Format a tokens object as TS source with the given indent depth (in spaces). */
function formatTokenBlock(name, tokens, indent) {
  const pad = ' '.repeat(indent)
  const inner = ' '.repeat(indent + 2)
  const lines = Object.entries(tokens).map(([key, { value }]) => {
    return `${inner}${quoteKey(key)}: { value: ${JSON.stringify(value)} },`
  })
  return `${pad}${name}: {\n${lines.join('\n')}\n${pad}},`
}

/**
 * Format a nested selector-to-declarations object (the reduced-motion rule)
 * as TS source: each key a quoted selector or at-rule, each leaf a style map.
 */
function formatNestedBlock(rules, indent) {
  const pad = ' '.repeat(indent)
  return Object.entries(rules)
    .map(([selector, inner]) => {
      const lines = Object.entries(inner).map(([sel, decls]) => {
        const props = Object.entries(decls)
          .map(([prop, v]) => `${prop}: ${JSON.stringify(v)}`)
          .join(', ')
        return `${pad}  '${sel}': { ${props} },`
      })
      return `${pad}'${selector}': {\n${lines.join('\n')}\n${pad}},`
    })
    .join('\n')
}

/** Format the keyframes object as TS source under theme.extend. */
function formatKeyframesBlock(keyframes, indent) {
  const pad = ' '.repeat(indent)
  const inner = ' '.repeat(indent + 2)
  const lines = Object.entries(keyframes).map(([name, stops]) => {
    const body = Object.entries(stops)
      .map(([stop, decls]) => {
        const props = Object.entries(decls)
          .map(([prop, v]) => `${prop}: ${JSON.stringify(v)}`)
          .join(', ')
        return `${stop}: { ${props} }`
      })
      .join(', ')
    return `${inner}${quoteKey(name)}: { ${body} },`
  })
  return `${pad}keyframes: {\n${lines.join('\n')}\n${pad}},`
}

/** Format the textStyles object (nested style values) as TS source. */
function formatTextStylesBlock(styles, indent) {
  const pad = ' '.repeat(indent)
  const inner = ' '.repeat(indent + 2)
  const lines = Object.entries(styles).map(([key, { value }]) => {
    const props = Object.entries(value)
      .map(([prop, v]) => `${prop}: ${JSON.stringify(v)}`)
      .join(', ')
    return `${inner}${quoteKey(key)}: { value: { ${props} } },`
  })
  return `${pad}textStyles: {\n${lines.join('\n')}\n${pad}},`
}

function quoteKey(key) {
  return /^[a-z][a-z0-9]*$/i.test(key) ? key : `'${key}'`
}

/**
 * Render the chassis catalog as a markdown table for inclusion in the
 * Art Director prompt. Each row shows id, name, class, description, moods,
 * archetype affinities, and the rendered size of the two display registers
 * at the two ends of the fluid window — enough to match a chassis to the
 * day's brief, and to know how loud its marquee actually gets, without
 * dumping the entire chassis source.
 *
 * Both display columns are ranges because both steps are clamps: `hero`
 * since #253, `2xl` through `5xl` since #457, `xl` since #469. A single
 * number here would read as a fixed size and invite the Art Director to spec
 * a heading that only fits on a desktop.
 */
export function formatChassisCatalogForPrompt(catalog) {
  const lines = [
    `| ID | Name | Class | Feel | Moods | Best for archetypes | Hero px ${NARROW_PX}→1440 | 5xl px ${NARROW_PX}→1440 |`,
    '|----|------|-------|------|-------|---------------------|------------------|-----------------|',
  ]
  for (const c of catalog) {
    const hero = c.type.steps.hero
    const top = c.type.steps['5xl']
    lines.push(
      `| \`${c.id}\` | ${c.name} | ${c.class} | ${c.description} | ${c.moods.join(', ')} | ${c.archetypes.join(', ')} | ${Math.round(stepPxAt(hero, NARROW_PX))}→${Math.round(stepPxAt(hero, 1440))} | ${Math.round(stepPxAt(top, NARROW_PX))}→${Math.round(stepPxAt(top, 1440))} |`
    )
  }
  return lines.join('\n')
}

/**
 * Per-chassis render facts for the spec critic: the size of each display
 * register at both ends of the viewport window, plus the body size, which is
 * fixed. Generated from the catalog so "can it render marquee" is a lookup,
 * not a hardcoded list that goes stale when a chassis is added.
 *
 * `2xl` and `5xl` are ranges, not single numbers: since #457 (#469 for `xl`)
 * every step from `xl` up is a clamp, so quoting one figure would describe
 * the desktop only.
 */
export function formatChassisRenderFactsForPrompt(catalog) {
  const lines = []
  for (const c of catalog) {
    const s = c.type.steps
    lines.push(
      `- \`${c.id}\`: hero ${Math.round(stepPxAt(s.hero, NARROW_PX))}px at ${NARROW_PX} → ${Math.round(stepPxAt(s.hero, 1440))}px at 1440; 2xl ${Math.round(stepPxAt(s['2xl'], NARROW_PX))}→${Math.round(stepPxAt(s['2xl'], 1440))}px; 5xl ${Math.round(stepPxAt(s['5xl'], NARROW_PX))}→${Math.round(stepPxAt(s['5xl'], 1440))}px; base ${Math.round(stepPxAt(s.base, 1440))}px`
    )
  }
  return lines.join('\n')
}

/**
 * The chassis-selection facts injected into the Art Director prompt in
 * place of the hardcoded ratio list it used to carry. Every chassis reaches
 * the 64px mobile marquee floor by construction (see scale.js), so the
 * selection question is desktop voice, not feasibility.
 *
 * It also states which steps scale with the viewport and which do not, so a
 * heading specced at `4xl` is not read as a fixed desktop size. Before #457
 * only `hero` was fluid and the upper steps kept their desktop size down to
 * 360, where a 5xl ran to 273px inside a 317px column.
 */
export function formatChassisSelectionForPrompt(catalog) {
  const byLoudness = [...catalog].sort(
    (a, b) => stepPxAt(b.type.steps.hero, 1440) - stepPxAt(a.type.steps.hero, 1440)
  )
  const voices = byLoudness
    .map((c) => `${c.id} ${Math.round(stepPxAt(c.type.steps.hero, 1440))}px`)
    .join(', ')
  const condensed = catalog
    .filter((c) => c.moods.includes('condensed'))
    .map((c) => c.id)
    .join(', ')
  // The two type treatment constraints (#502) the validator enforces, stated
  // up front so the Art Director declares against what actually loads.
  const italics = catalog
    .filter((c) => c.fonts.display?.italics)
    .map((c) => c.id)
    .join(', ')
  const singleWeight = catalog
    .filter((c) => c.fonts.display?.weights.length === 1)
    .map((c) => c.id)
    .join(', ')
  return [
    `Every chassis renders the hero at 64px or more on a ${NARROW_PX}px viewport, so marquee is never infeasible; the choice is how loud the desktop marquee gets. Hero at 1440px, loudest first: ${voices}.`,
    `\`hero\` and every step from \`xl\` up are fluid clamps that shrink to fit a ${NARROW_PX}px column; \`lg\` and below are fixed and render the same size at every width. Spec a display step by the register you want, not by a pixel size — the numbers in the catalog table are the two ends of a range.`,
    `Reserve the quietest heroes for editorial or literary phrases that don't want shouting. The condensed-caps chassis (${condensed}) share one register — don't default to them every time a phrase wants scale.`,
    `Display italics load on ${italics} only, so \`lead: italic\` is available on those. A single display weight loads on ${singleWeight}, so those take \`weight: regular\` only.`,
  ].join(' ')
}
