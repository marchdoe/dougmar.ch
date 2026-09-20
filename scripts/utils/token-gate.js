/**
 * Did every token name the engineer wrote actually resolve?
 *
 * PandaCSS does not fail on a token it has never heard of. It passes the name
 * through as a literal value, so `fontSize: '5xl'` against a ramp that stops at
 * `2xl` compiles, ships, and lands in the stylesheet as `font-size:5xl`. That is
 * not a font size, so the browser drops the declaration and the element renders
 * at whatever it inherited. Nothing throws. Nothing warns. The page looks nearly
 * right, which on a site that redesigns itself every night is the hardest kind
 * of wrong to see.
 *
 * On 2026-08-30 the home hero asked for `5xl` at base and `7xl` at md. Both were
 * dropped, so the h1 fell back to the browser default and rendered at 32px on
 * mobile where the approved mockup called for 64px. The stylesheet carried about
 * forty such values that morning.
 *
 * There is a second, quieter version of the same failure. Panda appends `px` to
 * a bare number on a length property, so `width: '11'` — meant as a spacing
 * token — compiled to the perfectly valid `width:11px`. The browser keeps it.
 * The brand mark shipped at 11px instead of 44px. Scanning the emitted CSS
 * cannot catch that one, because the CSS is valid; it has to be caught in the
 * source, against the scale the preset actually defines.
 *
 * ## What this does not do
 *
 * It is not `strictTokens`. That rejects every raw CSS value as well, which on
 * this codebase means hundreds of errors, nearly all of them legitimate — the
 * tooling surfaces under app/components/panel are meant to ignore the day's
 * design. The defect worth failing a build over is a token *reference* that
 * resolved to nothing, not a hardcoded pixel value.
 *
 * It also deliberately ignores dead code. `app/components/` holds roughly forty
 * files and routes import about eight of them, but Panda's `include` glob scans
 * every one, so stale components emit unresolved CSS too (`cardBg`, `pine.400`).
 * Failing the nightly build over a file nothing renders would be a false alarm,
 * and a false alarm on a nightly run is worse than a missed one: it kills a run
 * that would have been fine. Every finding is therefore filtered against the
 * set of files reachable by import from `app/routes/**`. Deleting the orphans is
 * #216; until that lands this gate simply steps around them.
 *
 * @see https://github.com/marchdoe/dougmar.ch/issues/252
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

/* ------------------------------------------------------------------ *
 * Part one: unresolved token names in the emitted CSS
 * ------------------------------------------------------------------ */

/**
 * CSS properties whose value, when it is a bare identifier, is almost certainly
 * a token name that never resolved.
 *
 * The set is explicit rather than inferred. Every property here has a small,
 * closed set of legal bare-identifier values (listed in {@link PROPERTY_KEYWORDS}
 * or, for the colour properties, the CSS named colours), so anything else is a
 * name Panda could not look up. Properties that accept open-ended identifiers —
 * `display`, `position`, `text-rendering`, `animation-name`, `grid-area` — are
 * left out on purpose: there is no way to tell a typo from a keyword there.
 *
 * Maps the emitted (kebab-case) property to the Panda token category the
 * engineer was reaching for, so the error message can say which scale to look in.
 */
export const CHECKED_PROPERTIES = new Map([
  // colours
  ['color', 'colors'],
  ['background', 'colors'],
  ['background-color', 'colors'],
  ['border-color', 'colors'],
  ['border-top-color', 'colors'],
  ['border-right-color', 'colors'],
  ['border-bottom-color', 'colors'],
  ['border-left-color', 'colors'],
  ['border-inline-color', 'colors'],
  ['border-inline-start-color', 'colors'],
  ['border-inline-end-color', 'colors'],
  ['border-block-color', 'colors'],
  ['border-block-start-color', 'colors'],
  ['border-block-end-color', 'colors'],
  ['outline-color', 'colors'],
  ['text-decoration-color', 'colors'],
  ['caret-color', 'colors'],
  ['accent-color', 'colors'],
  ['column-rule-color', 'colors'],
  ['fill', 'colors'],
  ['stroke', 'colors'],
  ['-webkit-text-fill-color', 'colors'],
  ['-webkit-text-stroke-color', 'colors'],
  // type
  ['font-size', 'fontSizes'],
  ['font-family', 'fonts'],
  ['letter-spacing', 'letterSpacings'],
  // space and size
  ['margin', 'spacing'],
  ['margin-top', 'spacing'],
  ['margin-right', 'spacing'],
  ['margin-bottom', 'spacing'],
  ['margin-left', 'spacing'],
  ['margin-inline', 'spacing'],
  ['margin-inline-start', 'spacing'],
  ['margin-inline-end', 'spacing'],
  ['margin-block', 'spacing'],
  ['margin-block-start', 'spacing'],
  ['margin-block-end', 'spacing'],
  ['padding', 'spacing'],
  ['padding-top', 'spacing'],
  ['padding-right', 'spacing'],
  ['padding-bottom', 'spacing'],
  ['padding-left', 'spacing'],
  ['padding-inline', 'spacing'],
  ['padding-inline-start', 'spacing'],
  ['padding-inline-end', 'spacing'],
  ['padding-block', 'spacing'],
  ['padding-block-start', 'spacing'],
  ['padding-block-end', 'spacing'],
  ['gap', 'spacing'],
  ['row-gap', 'spacing'],
  ['column-gap', 'spacing'],
  ['top', 'spacing'],
  ['right', 'spacing'],
  ['bottom', 'spacing'],
  ['left', 'spacing'],
  ['inset', 'spacing'],
  ['inset-inline', 'spacing'],
  ['inset-block', 'spacing'],
  ['width', 'sizes'],
  ['height', 'sizes'],
  ['min-width', 'sizes'],
  ['max-width', 'sizes'],
  ['min-height', 'sizes'],
  ['max-height', 'sizes'],
  ['flex-basis', 'sizes'],
  ['border-radius', 'radii'],
  ['border-width', 'borderWidths'],
  ['border-top-width', 'borderWidths'],
  ['border-right-width', 'borderWidths'],
  ['border-bottom-width', 'borderWidths'],
  ['border-left-width', 'borderWidths'],
])

/**
 * Keywords every property accepts. `none` and `auto` are here rather than in the
 * per-property lists because they are legal on so many of the checked properties
 * that splitting them out buys nothing.
 */
export const GLOBAL_KEYWORDS = new Set([
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
  'none',
  'auto',
  'normal',
  'currentcolor',
  'transparent',
])

/** Keywords legal on one property but not the rest. */
const PROPERTY_KEYWORDS = new Map([
  [
    'font-size',
    [
      'xx-small',
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large',
      'xxx-large',
      'smaller',
      'larger',
      'math',
    ],
  ],
  [
    'font-family',
    [
      'serif',
      'sans-serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
      'ui-serif',
      'ui-sans-serif',
      'ui-monospace',
      'ui-rounded',
      'math',
      'emoji',
      'fangsong',
    ],
  ],
  ['width', ['fit-content', 'max-content', 'min-content', 'stretch', 'available']],
  ['height', ['fit-content', 'max-content', 'min-content', 'stretch', 'available']],
  ['min-width', ['fit-content', 'max-content', 'min-content', 'stretch', 'available']],
  ['max-width', ['fit-content', 'max-content', 'min-content', 'stretch', 'available']],
  ['min-height', ['fit-content', 'max-content', 'min-content', 'stretch', 'available']],
  ['max-height', ['fit-content', 'max-content', 'min-content', 'stretch', 'available']],
  ['flex-basis', ['fit-content', 'max-content', 'min-content', 'content']],
  [
    'background',
    [
      'border-box',
      'padding-box',
      'content-box',
      'repeat',
      'no-repeat',
      'cover',
      'contain',
      'fixed',
      'scroll',
      'local',
    ],
  ],
  ['border-width', ['thin', 'medium', 'thick']],
  ['border-top-width', ['thin', 'medium', 'thick']],
  ['border-right-width', ['thin', 'medium', 'thick']],
  ['border-bottom-width', ['thin', 'medium', 'thick']],
  ['border-left-width', ['thin', 'medium', 'thick']],
])

/**
 * The 148 CSS named colours. `color: rebeccapurple` is real CSS, so a colour
 * property carrying one of these has resolved to something the browser will
 * paint, whatever the design system thinks of it.
 */
export const NAMED_COLORS = new Set(
  `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet
   brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan
   darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen
   darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey
   darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite
   forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew
   hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue
   lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon
   lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime
   limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple
   mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue
   mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid
   palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum
   powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen
   seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal
   thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen`.split(/\s+/)
)

/** Every unit CSS knows, so `0.5s` and `8.5vw` read as numbers rather than names. */
const CSS_UNITS =
  'px|em|rem|ex|ch|cap|ic|lh|rlh|vw|vh|vmin|vmax|vi|vb|svw|svh|svmin|svmax|lvw|lvh|lvmin|lvmax|dvw|dvh|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|q|in|pt|pc|fr|deg|grad|rad|turn|ms|s|hz|khz|dpi|dpcm|dppx|x'

const NUMBER_WITH_OPTIONAL_UNIT = new RegExp(
  `^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?(?:${CSS_UNITS})?$`,
  'i'
)

/**
 * Is `value` a bare identifier — a name, rather than a measurement, a colour
 * literal, a function call, a quoted string or a list?
 *
 * Anything carrying a space, a comma, a slash, a bracket, a `#`, a `%` or a
 * quote is raw CSS and none of this gate's business. So is anything that parses
 * as a number with or without a unit. What is left is a word, and on the
 * properties in {@link CHECKED_PROPERTIES} a word is either a keyword or a token
 * name that did not resolve.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isBareIdentifier(value) {
  if (!value) return false
  if (/[\s(),/#%'"\\[\]*+<>=;{}$]/.test(value)) return false
  if (value.startsWith('--')) return false
  if (NUMBER_WITH_OPTIONAL_UNIT.test(value)) return false
  return /^-{0,2}[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)
}

/**
 * Did `value` on `property` fail to resolve to a token?
 *
 * @param {string} property emitted CSS property, kebab-case
 * @param {string} value emitted CSS value
 * @returns {boolean}
 */
export function isUnresolvedTokenValue(property, value) {
  const prop = property.trim().toLowerCase()
  if (!CHECKED_PROPERTIES.has(prop)) return false

  const raw = value.replace(/!\s*important\s*$/i, '').trim()
  if (!isBareIdentifier(raw)) return false

  const lower = raw.toLowerCase()
  // A vendor-prefixed keyword (-webkit-fill-available, -moz-fit-content) is a
  // keyword, not a token name; no token scale starts with a dash.
  if (lower.startsWith('-')) return false
  if (GLOBAL_KEYWORDS.has(lower)) return false
  if (PROPERTY_KEYWORDS.get(prop)?.includes(lower)) return false
  if (CHECKED_PROPERTIES.get(prop) === 'colors' && NAMED_COLORS.has(lower)) return false

  return true
}

/**
 * Turn an escaped Panda selector back into the value the engineer wrote.
 *
 * Panda names an atomic class after the declaration it carries and escapes the
 * characters CSS reserves, so `color: 'pine.400'` under a `md` condition becomes
 * `.md\:c_pine\.400`. Unescaping recovers `md:c_pine.400`; everything after the
 * last `_` is the authored value.
 *
 * That matters because the emitted value is not always the authored one — Panda
 * rewrites `pine.400` to `pine.4` on the way out — so the class name is the only
 * reliable way back to the string that appears in the TSX.
 *
 * @param {string} selector e.g. `.md\:c_pine\.400:hover`
 * @returns {{ className: string, authoredValue: string } | null}
 */
export function parseAtomicSelector(selector) {
  const first = selector.trim().split(/\s|>|~|\+|,/)[0]
  if (!first.startsWith('.')) return null

  // Walk the selector so an escaped `\:` is kept while a pseudo-class `:` ends
  // the class name. Same for the `\.` in a nested token path versus a `.` that
  // starts the next compound class.
  let className = ''
  for (let i = 1; i < first.length; i++) {
    const ch = first[i]
    if (ch === '\\') {
      i++
      if (i < first.length) className += first[i]
      continue
    }
    if (ch === ':' || ch === '.' || ch === '[' || ch === '#') break
    className += ch
  }
  if (!className) return null

  const underscore = className.lastIndexOf('_')
  const authoredValue = underscore === -1 ? '' : className.slice(underscore + 1)
  return { className, authoredValue }
}

/**
 * Every declaration in `css`, paired with the selector that carries it.
 *
 * The regex matches innermost brace blocks only, which is what makes it safe
 * inside `@media` and `@layer`: an at-rule prelude is always followed by another
 * `{`, so it can never satisfy the `[^{}]` body and the match slides past it to
 * the rule inside.
 *
 * @param {string} css
 * @returns {Array<{selector: string, property: string, value: string}>}
 */
export function parseDeclarations(css) {
  const out = []
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const decl of body.split(';')) {
      const colon = decl.indexOf(':')
      if (colon === -1) continue
      const property = decl.slice(0, colon).trim()
      const value = decl.slice(colon + 1).trim()
      if (!property || property.startsWith('--')) continue
      out.push({ selector: selector.trim(), property, value })
    }
  }
  return out
}

/**
 * Unresolved token names in an emitted stylesheet.
 *
 * Findings are deduplicated by property and value: the same miss repeated across
 * six breakpoints is one mistake, and six lines of it would bury the others in
 * the retry prompt.
 *
 * @param {string} css contents of a built stylesheet
 * @returns {Array<{property: string, value: string, category: string, authoredValue: string, selector: string}>}
 */
export function findUnresolvedCssValues(css) {
  const found = new Map()
  for (const { selector, property, value } of parseDeclarations(css)) {
    if (!isUnresolvedTokenValue(property, value)) continue
    const prop = property.toLowerCase()
    const parsed = parseAtomicSelector(selector)
    const key = `${prop}:${value}`
    if (found.has(key)) continue
    found.set(key, {
      property: prop,
      value,
      category: CHECKED_PROPERTIES.get(prop),
      // Fall back to the emitted value for a rule with no class to read, such as
      // anything the Art Director puts in globalCss.
      authoredValue: parsed?.authoredValue || value,
      selector: selector.trim(),
    })
  }
  return [...found.values()]
}

/* ------------------------------------------------------------------ *
 * Part two: bare numbers where a spacing token was meant
 * ------------------------------------------------------------------ */

/**
 * Style props that read a token scale keyed by number, written the way they
 * appear in TSX. Maps each to the Panda category it looks up, because they do
 * not all read the same one: `gap: '1'` resolves against spacing, while
 * `height: '3'` resolves against sizes and — with no numeric sizes tokens in the
 * preset — quietly becomes `height:3px`.
 */
export const NUMERIC_SCALE_PROPS = new Map([
  ['margin', 'spacing'],
  ['marginTop', 'spacing'],
  ['marginRight', 'spacing'],
  ['marginBottom', 'spacing'],
  ['marginLeft', 'spacing'],
  ['marginX', 'spacing'],
  ['marginY', 'spacing'],
  ['marginInline', 'spacing'],
  ['marginBlock', 'spacing'],
  ['padding', 'spacing'],
  ['paddingTop', 'spacing'],
  ['paddingRight', 'spacing'],
  ['paddingBottom', 'spacing'],
  ['paddingLeft', 'spacing'],
  ['paddingX', 'spacing'],
  ['paddingY', 'spacing'],
  ['paddingInline', 'spacing'],
  ['paddingBlock', 'spacing'],
  ['gap', 'spacing'],
  ['rowGap', 'spacing'],
  ['columnGap', 'spacing'],
  ['top', 'spacing'],
  ['right', 'spacing'],
  ['bottom', 'spacing'],
  ['left', 'spacing'],
  ['inset', 'spacing'],
  ['width', 'sizes'],
  ['height', 'sizes'],
  ['minWidth', 'sizes'],
  ['maxWidth', 'sizes'],
  ['minHeight', 'sizes'],
  ['maxHeight', 'sizes'],
])

/**
 * Where Panda writes the theme it actually compiled.
 *
 * `panda codegen` runs before every build (`pnpm build` is
 * `panda codegen && …`) and again in the pipeline right after the Art Director
 * writes its preset, so by the time this gate runs the file is present and
 * current.
 */
const GENERATED_TOKENS = ['styled-system', 'tokens', 'index.mjs']

/**
 * The keys of one token scale, read out of Panda's generated token map.
 *
 * The map is flat and fully merged — `"spacing.4": { value, variable }` — so a
 * key is whatever follows the category and a dot.
 *
 * @param {string} source contents of styled-system/tokens/index.mjs
 * @param {string} category e.g. `spacing`
 * @returns {Set<string>} every key the compiled theme defines in that scale
 */
export function parseGeneratedTokenKeys(source, category) {
  const keys = new Set()
  const re = new RegExp(`"${category}\\.([^"]+)"\\s*:`, 'g')
  for (const [, key] of source.matchAll(re)) keys.add(key)
  return keys
}

/**
 * The token scales the built site resolves against.
 *
 * Read from Panda's own output rather than parsed back out of the preset
 * sources, because the sources cannot answer this question. `panda.config.ts`
 * merges `[elementsPreset, chassisPreset]` and the two own different halves of
 * the theme: the Art Director writes `elements/preset.ts` and is told in so
 * many words NOT to emit `spacing` (scripts/prompts/art-director.md), while
 * the orchestrator derives it from the day's chassis rhythm into
 * `elements/chassis-preset.ts`, merged second. Only the merge knows what won.
 *
 * Reading preset.ts alone is what killed the 2026-09-01 run: the Art Director
 * followed its contract, the gate parsed an empty spacing scale, and all 49
 * legal `gap: '4'`s in the tree were reported as bare-number misses. Reading a
 * hardcoded list of both presets was the same guess with one more entry in it,
 * and would have gone stale the day a third preset joined the merge.
 *
 * Returns null when the generated map is absent, which is a different fact
 * from an empty scale and has to stay distinguishable. An empty scale is
 * authoritative: `sizes` carries no numeric keys today, and `width: '11'`
 * shipping an 11px brand mark is the case this gate was built for, so it must
 * still flag. A missing map means we know nothing about the theme, and a gate
 * that knows nothing must not invent findings.
 *
 * @param {string} root repo root
 * @returns {Record<string, Set<string>> | null}
 */
export function readGeneratedTokenScales(root) {
  const generated = path.join(root, ...GENERATED_TOKENS)
  if (!existsSync(generated)) return null
  let source
  try {
    source = readFileSync(generated, 'utf8')
  } catch {
    return null
  }
  return {
    spacing: parseGeneratedTokenKeys(source, 'spacing'),
    sizes: parseGeneratedTokenKeys(source, 'sizes'),
  }
}

/**
 * Bare numbers written where a token key was meant.
 *
 * `width: '11'` reads as a token reference and compiles to `width:11px`, which
 * is valid CSS, so it survives every check that looks at the stylesheet. It has
 * to be caught here, against the scale the preset defines.
 *
 * `0` is always allowed: it is a legal CSS length on its own and no scale needs
 * to define it.
 *
 * @param {string} source TSX contents
 * @param {Record<string, Set<string>>} scales token keys by category
 * @returns {Array<{prop: string, value: string, category: string}>}
 */
// Characters that can legally precede a `'` / `"` / regex opening — an
// assignment, an opening bracket, a separator, an operator. A quote seen
// anywhere else (after a word character, `>`, a closing quote, …) is prose,
// not the start of a string — `Doug's studio` and `<p>It's here</p>` are the
// motivating cases. Also permitted at the very start of the source.
export const CAN_OPEN_STRING = new Set(['=', '(', ',', ':', '[', '{', '|', '&', '?', '+', ';'])

// Keywords that grammatically precede an expression, so the quote right
// after one opens a string even though the keyword's last letter is not in
// CAN_OPEN_STRING — `return 'https://…'`, `case 'https://…':`, `throw '…'`,
// `typeof '…'`, `yield '…'`, `await '…'` have no punctuation before the
// quote at all. Without this, the build-validator security scan's raw-text
// URL check (which this stripComments feeds) silently stopped scanning
// exactly the shapes an LLM writes (#313 follow-up).
export const EXPRESSION_KEYWORDS = new Set([
  'return',
  'case',
  'throw',
  'typeof',
  'yield',
  'await',
  'in',
  'of',
  'instanceof',
  'void',
  'delete',
  'new',
  'else',
  'do',
])

/**
 * Find the end of a `/regex/` literal starting at `source[start]`, or -1 if
 * `start` is not a regex opening (division, or an unterminated `/`). A `/`
 * inside a `[...]` character class does not end the literal; regex literals
 * cannot span a line.
 *
 * @param {string} source
 * @param {number} start index of the opening `/`
 * @returns {number} index of the closing `/`, or -1
 */
function findRegexEnd(source, start) {
  let inClass = false
  for (let i = start + 1; i < source.length; i++) {
    const c = source[i]
    if (c === '\n') return -1
    if (c === '\\') {
      i++
      continue
    }
    if (c === '[') inClass = true
    else if (c === ']') inClass = false
    else if (c === '/' && !inClass) return i
  }
  return -1
}

/**
 * Remove comments so the gate reads code, not prose about code.
 *
 * `app/components/Sidebar.tsx` carries a comment explaining that `width: '11'`
 * once meant a spacing token that does not exist — and the gate flagged the
 * comment, reporting an 11px mark in a file that renders none. A rule that
 * fires on its own documentation teaches people to delete the documentation.
 *
 * String literals are tracked so a `//` inside one — every https:// URL in
 * the tree — is not mistaken for the start of a comment. A `'` or `"` only
 * opens a string when what precedes it looks like a value is expected
 * (`CAN_OPEN_STRING`, the start of the source, or the previous word being an
 * `EXPRESSION_KEYWORDS` entry — `return 'https://…'` has no punctuation
 * before the quote at all, #313); otherwise — prose in JSX text, an
 * apostrophe in a comment — it is left alone (#309). Template literals keep
 * the old, unconditional toggle: a tagged template's backtick is preceded by
 * an identifier, which the same heuristic would reject. A `/` in an opening
 * position is checked for a regex literal first, so a character class like
 * `/['"]/` does not open a fake string.
 *
 * @param {string} source
 * @returns {string} same length, comment bodies blanked
 */
export function stripComments(source) {
  let out = ''
  let quote = null
  let lastSignificant = null
  // The most recently completed identifier/keyword, tracked alongside
  // lastSignificant so `return 'https://…'` is recognized even though the
  // char right before the quote is whitespace, not punctuation. Persists
  // across whitespace, cleared by real punctuation or once consumed.
  let lastWord = ''
  let currentWord = ''
  for (let i = 0; i < source.length; i++) {
    const c = source[i]
    const next = source[i + 1]
    if (quote) {
      out += c
      if (c === '\\') {
        out += next ?? ''
        i++
      } else if (c === quote) {
        quote = null
        lastSignificant = c
      }
      continue
    }
    if (/[A-Za-z0-9_$]/.test(c)) {
      currentWord += c
      out += c
      lastSignificant = c
      continue
    }
    if (currentWord) {
      lastWord = currentWord
      currentWord = ''
    }
    const canOpen =
      lastSignificant === null ||
      CAN_OPEN_STRING.has(lastSignificant) ||
      EXPRESSION_KEYWORDS.has(lastWord)
    if ((c === "'" || c === '"') && canOpen) {
      quote = c
      out += c
      lastWord = ''
      continue
    }
    if (c === '`') {
      quote = c
      out += c
      lastWord = ''
      continue
    }
    if (c === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++
      out += '\n'
      lastWord = ''
      continue
    }
    if (c === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      const body = source.slice(i, end < 0 ? source.length : end + 2)
      // Keep the newlines so reported line numbers stay true.
      out += body.replace(/[^\n]/g, ' ')
      i = end < 0 ? source.length : end + 1
      lastWord = ''
      continue
    }
    if (c === '/' && canOpen) {
      const end = findRegexEnd(source, i)
      if (end !== -1) {
        let flagEnd = end + 1
        while (flagEnd < source.length && /[a-zA-Z]/.test(source[flagEnd])) flagEnd++
        out += source.slice(i, flagEnd)
        lastSignificant = source[flagEnd - 1]
        lastWord = ''
        i = flagEnd - 1
        continue
      }
    }
    out += c
    if (!/\s/.test(c)) {
      lastSignificant = c
      lastWord = ''
    }
  }
  return out
}

// Tag names whose own attributes are SVG geometry, not Panda style props —
// `<svg width="24" height="24">` and `<rect width="10" height="10"/>` are not
// the same `width` as `<Box width="24">`. resolveImport already excludes an
// imported `.svg` asset for the same reason; this covers the inline case (#316).
const SVG_GEOMETRY_TAGS = new Set([
  'svg',
  'rect',
  'circle',
  'ellipse',
  'line',
  'image',
  'path',
  'use',
  'pattern',
  'mask',
  'clippath',
  'foreignobject',
  'marker',
  'symbol',
  'view',
])

/**
 * Is `index` inside the opening tag of an SVG geometry element — i.e. does
 * the nearest unclosed `<` before it start an `<svg>`, `<rect>`, etc.?
 *
 * @param {string} code
 * @param {number} index
 * @returns {boolean}
 */
function isInsideSvgTag(code, index) {
  const openIndex = code.lastIndexOf('<', index)
  if (openIndex === -1) return false
  const closeIndex = code.lastIndexOf('>', index)
  // A `>` after the last `<` means that tag already closed — we are between
  // tags (or inside text/children), not inside one.
  if (closeIndex > openIndex) return false
  const tagMatch = /^<\s*([A-Za-z][\w:-]*)/.exec(code.slice(openIndex))
  if (!tagMatch) return false
  return SVG_GEOMETRY_TAGS.has(tagMatch[1].toLowerCase())
}

export function findNumericScaleMisses(source, scales) {
  const out = []
  const seen = new Set()
  const code = stripComments(source)
  for (const [prop, category] of NUMERIC_SCALE_PROPS) {
    // Both spellings: `css({ width: '11' })` and the JSX prop `<Box width="11">`.
    // Today's tree uses each in a different file and both compile to the same px.
    const re = new RegExp(`\\b${prop}\\s*[:=]\\s*['"\`](\\d+(?:\\.\\d+)?)['"\`]`, 'g')
    for (const match of code.matchAll(re)) {
      const [, value] = match
      if (isInsideSvgTag(code, match.index)) continue
      if (Number(value) === 0) continue
      if (scales[category]?.has(value)) continue
      const key = `${prop}:${value}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ prop, value, category })
    }
  }
  return out
}

/* ------------------------------------------------------------------ *
 * Part two-b: several tokens in one spacing string
 * ------------------------------------------------------------------ */

/**
 * Spacing properties, in the spelling they carry in TSX, and how each one
 * splits when it is given more than one value.
 *
 * Panda resolves a token only when it is the whole value. `padding: '3 4'` is
 * not `spacing.3` and `spacing.4`: the string goes to the stylesheet as `3 4`,
 * and Panda appends `px` to each bare number, so the row on /experiments got
 * 3px of vertical padding instead of 16px (#553). The result is valid CSS, which
 * is why scanning the emitted stylesheet, as part one does, cannot see it.
 *
 * `box` marks the shorthands that split by count in the corrected form: two
 * values are block then inline, three are top, inline, bottom, four are top,
 * right, bottom, left. `pair` names the two longhands of a property that
 * already carries an axis. `null` means the property takes a single value.
 *
 * `top`, `right`, `bottom` and `left` are left out although `inset` splits into
 * them. They are also the names of ordinary component props, and the generated
 * RunningFoot passes `right="31 to 41"` as data. `inset` covers the case that
 * matters, and a false finding kills a nightly run.
 */
export const SPACED_SPACING_PROPS = new Map([
  ['padding', { box: 'padding' }],
  ['margin', { box: 'margin' }],
  ['inset', { box: 'inset' }],
  ['paddingInline', { pair: ['paddingInlineStart', 'paddingInlineEnd'] }],
  ['paddingBlock', { pair: ['paddingBlockStart', 'paddingBlockEnd'] }],
  ['marginInline', { pair: ['marginInlineStart', 'marginInlineEnd'] }],
  ['marginBlock', { pair: ['marginBlockStart', 'marginBlockEnd'] }],
  ['insetInline', { pair: ['insetInlineStart', 'insetInlineEnd'] }],
  ['insetBlock', { pair: ['insetBlockStart', 'insetBlockEnd'] }],
  ['paddingX', { pair: ['paddingInlineStart', 'paddingInlineEnd'] }],
  ['paddingY', { pair: ['paddingBlockStart', 'paddingBlockEnd'] }],
  ['marginX', { pair: ['marginInlineStart', 'marginInlineEnd'] }],
  ['marginY', { pair: ['marginBlockStart', 'marginBlockEnd'] }],
  ['gap', { pair: ['rowGap', 'columnGap'] }],
  ['paddingTop', null],
  ['paddingRight', null],
  ['paddingBottom', null],
  ['paddingLeft', null],
  ['paddingInlineStart', null],
  ['paddingInlineEnd', null],
  ['paddingBlockStart', null],
  ['paddingBlockEnd', null],
  ['marginTop', null],
  ['marginRight', null],
  ['marginBottom', null],
  ['marginLeft', null],
  ['marginInlineStart', null],
  ['marginInlineEnd', null],
  ['marginBlockStart', null],
  ['marginBlockEnd', null],
  ['rowGap', null],
  ['columnGap', null],
])

/**
 * Words that are valid CSS in a spacing value and are not token names. A part
 * that is one of these, a length with a unit, `0`, a percentage or a function
 * is written the way CSS reads it and ships as written. Only a bare number or
 * a bare name is a token reference Panda did not get to resolve.
 */
const SPACING_KEYWORDS = new Set([
  ...GLOBAL_KEYWORDS,
  'auto',
  'normal',
  'revert',
  'revert-layer',
  'fit-content',
  'min-content',
  'max-content',
])

/** Split a value on whitespace that sits outside parentheses: `calc(1rem + 2px) 4` is two parts. */
function splitTopLevel(value) {
  const parts = []
  let depth = 0
  let current = ''
  for (const c of value.trim()) {
    if (c === '(') depth++
    else if (c === ')') depth = Math.max(0, depth - 1)
    if (/\s/.test(c) && depth === 0) {
      if (current) parts.push(current)
      current = ''
    } else {
      current += c
    }
  }
  if (current) parts.push(current)
  return parts
}

/** A bare non-zero number or a bare name, the two shapes of a token reference. */
function isTokenReference(part) {
  if (part === '0') return false
  if (/^-?\d*\.?\d+$/.test(part)) return true
  return /^-?[A-Za-z][\w.-]*$/.test(part) && !SPACING_KEYWORDS.has(part)
}

const quoted = (s) => `'${s}'`

/**
 * The one-property-per-value spelling of a space-separated value, or a plain
 * instruction when the property has no such split.
 *
 * @param {string} prop
 * @param {string[]} parts
 * @returns {string}
 */
export function correctedSpacingForm(prop, parts) {
  const spec = SPACED_SPACING_PROPS.get(prop)
  const write = (names) => names.map((name, i) => `${name}: ${quoted(parts[i])}`).join(', ')
  if (spec?.box && parts.length === 2) {
    return write([`${spec.box}Block`, `${spec.box}Inline`])
  }
  if (spec?.box && parts.length === 3) {
    const side = (s) => (spec.box === 'inset' ? s.toLowerCase() : `${spec.box}${s}`)
    return write([side('Top'), `${spec.box}Inline`, side('Bottom')])
  }
  if (spec?.box && parts.length === 4) {
    const side = (s) => (spec.box === 'inset' ? s.toLowerCase() : `${spec.box}${s}`)
    return write([side('Top'), side('Right'), side('Bottom'), side('Left')])
  }
  if (spec?.pair && parts.length === 2) return write(spec.pair)
  return `one property per value, each a single token (${parts.map(quoted).join(', ')})`
}

/**
 * The string values written after a property name: the string itself, every
 * string in a `{ base: '…', md: '…' }` condition map, or every string in an
 * array. Reads `padding: '3 4'`, `padding="3 4"`, `padding={'3 4'}` and
 * `padding={{ base: '6 4', md: '8 6vw' }}`, and nothing it cannot tell is a
 * value: a string handed to a function call inside the braces is not one.
 *
 * @param {string} code source with comments stripped
 * @param {number} from index just past the `:` or `=`
 * @param {boolean} jsx true after `=`, where one wrapping `{` is JSX syntax
 * @returns {Array<{value: string, index: number}>}
 */
function valuesAfter(code, from, jsx) {
  let i = from
  while (/\s/.test(code[i] ?? '')) i++
  if (jsx && code[i] === '{') {
    i++
    while (/\s/.test(code[i] ?? '')) i++
  }
  const open = code[i]
  if (open === "'" || open === '"' || open === '`') {
    const end = code.indexOf(open, i + 1)
    return end < 0 ? [] : [{ value: code.slice(i + 1, end), index: i + 1 }]
  }
  if (open !== '{' && open !== '[') return []

  const close = open === '{' ? '}' : ']'
  let depth = 0
  let end = i
  for (; end < code.length; end++) {
    if (code[end] === open) depth++
    else if (code[end] === close && --depth === 0) break
  }
  const region = code.slice(i, end)
  // In an object a value follows `:`, in an array it follows `[` or `,`.
  const lead = open === '{' ? /:\s*$/ : /[[,]\s*$/
  const out = []
  for (const m of region.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)) {
    if (lead.test(region.slice(0, m.index))) out.push({ value: m[2], index: i + m.index + 1 })
  }
  return out
}

/**
 * Find spacing values that put several tokens in one string.
 *
 * A value is flagged when it has two or more parts and at least one is a bare
 * number or a bare name. `'1px 5px'` and `'0 auto'` are ordinary CSS and pass;
 * `'3 4'`, `'8 6vw'` and `'3px 4'` do not, because Panda would have resolved
 * the bare part as a token had it stood alone. Reported once per property and
 * value, with the line it first appears on.
 *
 * @param {string} source TSX contents
 * @returns {Array<{prop: string, value: string, line: number, text: string, fix: string}>}
 */
export function findSpacedSpacing(source) {
  const code = stripComments(source)
  const lines = source.split('\n')
  const out = []
  const seen = new Set()
  for (const prop of SPACED_SPACING_PROPS.keys()) {
    const re = new RegExp(`(?<![\\w$.-])${prop}\\s*([:=])`, 'g')
    for (const match of code.matchAll(re)) {
      const from = match.index + match[0].length
      if (match[1] === '=' && code[from] === '=') continue // `padding == x`
      for (const { value, index } of valuesAfter(code, from, match[1] === '=')) {
        const parts = splitTopLevel(value)
        if (parts.length < 2 || !parts.some(isTokenReference)) continue
        const key = `${prop}:${value}`
        if (seen.has(key)) continue
        seen.add(key)
        const line = code.slice(0, index).split('\n').length
        out.push({
          at: index,
          prop,
          value,
          line,
          text: (lines[line - 1] ?? '').trim(),
          fix: correctedSpacingForm(prop, parts),
        })
      }
    }
  }
  // Source order, not the order the properties are listed in.
  return out.sort((a, b) => a.at - b.at).map(({ at: _at, ...hit }) => hit)
}

/* ------------------------------------------------------------------ *
 * Part three: which files actually render
 * ------------------------------------------------------------------ */

const SOURCE_EXTENSIONS = ['.tsx', '.ts']

function resolveImport(specifier, fromFile, appDir) {
  let base
  if (specifier.startsWith('#/')) base = path.join(appDir, specifier.slice(2))
  else if (specifier.startsWith('.')) base = path.resolve(path.dirname(fromFile), specifier)
  else return null

  // Only TypeScript sources. An import can resolve to an asset — `.svg`, `.css`,
  // `.json` — and an SVG's `width="71"` attribute is not a Panda style prop.
  const candidates = SOURCE_EXTENSIONS.includes(path.extname(base)) ? [base] : []
  candidates.push(
    ...SOURCE_EXTENSIONS.map((e) => base + e),
    ...SOURCE_EXTENSIONS.map((e) => path.join(base, `index${e}`))
  )
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

function listFiles(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) listFiles(full, out)
    else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) out.push(full)
  }
  return out
}

/**
 * Every source file a route can reach, by walking imports out from
 * `app/routes/**`.
 *
 * This is the orphan filter. Panda scans all of `app/**` and emits CSS for
 * whatever it finds, including the roughly thirty components in
 * `app/components/` that no route imports any more. Their unresolved tokens are
 * real, but they are not on the page, and failing tonight's build over a file
 * nobody renders would kill a run that was fine.
 *
 * The tradeoff is that this trusts static imports. A component pulled in by a
 * path this walk cannot follow — a computed specifier, a dynamic registry — would
 * be treated as dead and its findings dropped. Nothing in this codebase does
 * that today, and erring toward silence is the right direction for a check that
 * can fail a nightly run.
 *
 * @param {string} root repo root
 * @returns {Map<string, string>} absolute path to file contents
 */
export function readReachableSources(root) {
  const appDir = path.join(root, 'app')
  const queue = listFiles(path.join(appDir, 'routes'))
  const seen = new Map()

  while (queue.length > 0) {
    const file = queue.pop()
    if (seen.has(file)) continue
    let source
    try {
      source = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    seen.set(file, source)

    const specifiers = [
      ...source.matchAll(/(?:^|\n)\s*(?:import|export)[\s\S]{0,400}?from\s*['"]([^'"]+)['"]/g),
      ...source.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
      ...source.matchAll(/(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g),
    ].map((m) => m[1])

    for (const specifier of specifiers) {
      const resolved = resolveImport(specifier, file, appDir)
      if (resolved && !seen.has(resolved)) queue.push(resolved)
    }
  }
  return seen
}

/* ------------------------------------------------------------------ *
 * The gate
 * ------------------------------------------------------------------ */

function quotedOccurrence(value) {
  const escaped = escapeRegExp(value)
  return new RegExp(`['"\`]${escaped}['"\`]`)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Panda shorthands, keyed by the CSS property they compile to.
 *
 * A finding comes back from the stylesheet as a CSS property — `background`,
 * `min-width` — and has to be matched against what someone could have typed in
 * TSX. The camelCase spelling is derivable; the shorthands are not.
 */
const PROPERTY_ALIASES = new Map([
  ['background', ['bg', 'bgColor', 'backgroundColor']],
  ['background-color', ['bg', 'bgColor']],
  ['color', ['textColor']],
  ['width', ['w']],
  ['height', ['h']],
  ['min-width', ['minW']],
  ['max-width', ['maxW']],
  ['min-height', ['minH']],
  ['max-height', ['maxH']],
  ['border-radius', ['rounded']],
  ['box-shadow', ['shadow']],
  ['padding', ['p']],
  ['padding-top', ['pt']],
  ['padding-bottom', ['pb']],
  ['padding-left', ['pl']],
  ['padding-right', ['pr']],
  ['margin', ['m']],
  ['margin-top', ['mt']],
  ['margin-bottom', ['mb']],
  ['margin-left', ['ml']],
  ['margin-right', ['mr']],
])

/**
 * Every spelling that could have authored a given CSS property.
 *
 * @param {string} cssProperty e.g. `min-width`
 * @returns {string[]} e.g. ['min-width', 'minWidth', 'minW']
 */
export function authoringSpellings(cssProperty) {
  const camel = cssProperty.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  return [...new Set([cssProperty, camel, ...(PROPERTY_ALIASES.get(cssProperty) ?? [])])]
}

/**
 * Run both checks against a built site.
 *
 * Findings are split by who can act on them. The error string this produces is
 * handed to a retry of the React Engineer, and the engineer may only write the
 * files in `ownedFiles`; a finding in `app/routes/elements.tsx` would burn a
 * retry on a file the agent is not allowed to open and then fail the run anyway.
 * So a finding in an owned file blocks, and a finding anywhere else is printed
 * as a warning — visible every night, but never the reason a build dies.
 *
 * @param {object} options
 * @param {string} options.root repo root
 * @param {string} [options.distDir] built client output, defaults to dist/client
 * @param {string[]} [options.ownedFiles] repo-relative paths the nightly agents
 *   may rewrite. Omit to make every finding blocking.
 * @returns {{ ok: boolean, blocking: Array<object>, warnings: Array<object>, error?: string }}
 */
export function checkTokenResolution({
  root,
  distDir = path.join(root, 'dist', 'client'),
  ownedFiles = null,
}) {
  const reachable = readReachableSources(root)
  const findings = []

  // Which file names a given authored value, among the files that render.
  // Which file authored a given declaration, among the files that render.
  //
  // Two passes, because a value alone is not evidence. `width:full` in the
  // stylesheet used to be blamed on every file containing the string 'full',
  // which on 2026-09-01 meant `depth: 'full'` — project metadata, not a style
  // prop — in app/content/projects.ts and two others. The retry then received
  // a message naming three files the React Engineer is not allowed to open,
  // and there is only one retry to spend.
  //
  // So: name the files that wrote this property with this value. Fall back to
  // the value-only match when none do, because a missed attribution drops the
  // finding entirely (see the orphan filter below) and a vague file list beats
  // a silently swallowed defect.
  const attribute = (value, property) => {
    const valueRe = quotedOccurrence(value)
    const escaped = escapeRegExp(value)
    const propRes = authoringSpellings(property).map(
      (prop) => new RegExp(`\\b${escapeRegExp(prop)}\\s*[:=]\\s*['"\`]${escaped}['"\`]`)
    )
    const precise = []
    const loose = []
    for (const [file, source] of reachable) {
      const code = stripComments(source)
      const rel = path.relative(root, file)
      if (propRes.some((re) => re.test(code))) precise.push(rel)
      else if (valueRe.test(code)) loose.push(rel)
    }
    return precise.length > 0 ? precise : loose
  }

  const assetsDir = path.join(distDir, 'assets')
  let stylesheets = []
  try {
    stylesheets = readdirSync(assetsDir)
      .filter((f) => f.endsWith('.css'))
      .map((f) => path.join(assetsDir, f))
  } catch {
    // No stylesheet is a different failure, and validateBuildOutput already
    // reports it. Nothing to check here.
    return { ok: true, blocking: [], warnings: [] }
  }

  for (const sheet of stylesheets) {
    for (const hit of findUnresolvedCssValues(readFileSync(sheet, 'utf8'))) {
      const files = attribute(hit.authoredValue, hit.property)
      if (files.length === 0) continue // orphan component, see #216
      findings.push({
        kind: 'unresolved',
        property: hit.property,
        value: hit.value,
        authoredValue: hit.authoredValue,
        category: hit.category,
        files,
      })
    }
  }

  const scales = readGeneratedTokenScales(root)
  if (!scales) {
    // Codegen runs before the build, so this only happens if the build never
    // did. Say so rather than reporting every bare number in the tree.
    console.warn(
      '  [token-gate] styled-system/tokens not generated — skipping the bare-number check'
    )
  } else {
    for (const [file, source] of reachable) {
      for (const hit of findNumericScaleMisses(source, scales)) {
        findings.push({
          kind: 'numeric',
          property: hit.prop,
          value: hit.value,
          category: hit.category,
          // Only the numeric steps. The finding is about a bare number, and
          // the compiled `sizes` scale carries `breakpoint-lg` and friends —
          // true, and useless as advice to an agent that wrote `width: '11'`.
          available: [...(scales[hit.category] ?? [])]
            .filter((key) => /^\d+$/.test(key))
            .sort((a, b) => Number(a) - Number(b)),
          files: [path.relative(root, file)],
        })
      }
    }
  }

  // Source only, so it does not wait on codegen the way the scale check does.
  for (const [file, source] of reachable) {
    for (const hit of findSpacedSpacing(source)) {
      findings.push({
        kind: 'spaced',
        property: hit.prop,
        value: hit.value,
        line: hit.line,
        text: hit.text,
        fix: hit.fix,
        files: [path.relative(root, file)],
      })
    }
  }

  const owned = ownedFiles ? new Set(ownedFiles) : null
  const isBlocking = (finding) => !owned || finding.files.some((f) => owned.has(f))
  const blocking = findings.filter(isBlocking)
  const warnings = findings.filter((f) => !isBlocking(f))

  return {
    ok: blocking.length === 0,
    blocking,
    warnings,
    error: blocking.length > 0 ? formatFindings(blocking) : undefined,
  }
}

/**
 * Turn findings into the message the retry agent reads.
 *
 * It is fed straight back to the React Engineer, so it has to say what it saw,
 * where, and what to do instead — not merely that something is wrong.
 *
 * @param {Array<object>} findings
 * @returns {string}
 */
export function formatFindings(findings) {
  const lines = [
    `${findings.length} token reference${findings.length === 1 ? '' : 's'} did not resolve. ` +
      'PandaCSS passes an unknown token through as a literal, so these shipped as invalid CSS ' +
      'that the browser drops, or as a px value nobody asked for.',
  ]

  const unresolved = findings.filter((f) => f.kind === 'unresolved')
  if (unresolved.length > 0) {
    lines.push('', 'Names that are not in any token scale:')
    for (const f of unresolved) {
      lines.push(
        `  - ${f.files.join(', ')}: ${f.property}: '${f.authoredValue}' emitted ` +
          `\`${f.property}:${f.value}\`. There is no ${f.category}.${f.authoredValue} token, so the ` +
          'declaration is invalid and the browser drops it. Use a token that exists in that scale, ' +
          'or write an explicit CSS value.'
      )
    }
  }

  const numeric = findings.filter((f) => f.kind === 'numeric')
  if (numeric.length > 0) {
    lines.push('', 'Bare numbers where a token key was meant:')
    for (const f of numeric) {
      const advice = f.available?.length
        ? `The ${f.category} scale defines ${f.available.join(', ')} — use one of those, or write the length you mean with a unit.`
        : `The ${f.category} scale defines no numbered steps at all, so write the length you mean with a unit.`
      lines.push(
        `  - ${f.files.join(', ')}: ${f.property}: '${f.value}' is not a ${f.category} token, so ` +
          `Panda appended px and shipped ${f.value}px. ${advice}`
      )
    }
  }

  const spaced = findings.filter((f) => f.kind === 'spaced')
  if (spaced.length > 0) {
    lines.push('', 'Several values in one spacing string:')
    for (const f of spaced) {
      lines.push(
        `  - ${f.files.join(', ')}:${f.line}: ${f.property}: '${f.value}' ships as written, ` +
          'with px appended to each bare number. Panda resolves a token only when it is the ' +
          `whole value. Write ${f.fix}.`,
        `      ${f.text}`
      )
    }
  }

  return lines.join('\n')
}
