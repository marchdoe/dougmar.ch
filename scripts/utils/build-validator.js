import { RECOGNIZED_HOSTS } from './site-origin.js'
import { localDateString } from './local-time.js'
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { ROOT } from './file-manager.js'
import { STEP_BUDGETS } from './budgets.js'
import { checkTokenExistence } from './token-existence.js'
import {
  CAN_OPEN_STRING,
  EXPRESSION_KEYWORDS,
  checkTokenResolution,
  readReachableSources,
  stripComments,
} from './token-gate.js'
import { shouldPin } from '../pin-inline-scripts.js'
import { MUTABLE_FILES, ORCHESTRATOR_FILES } from './site-context.js'
import { MARK_PATH_FINGERPRINTS, lockupIsDeclared } from './brand-lockup.js'
import { MATERIAL_OWNER } from './material.js'
import { HOME_ROUTE, checkCalloutPlacement } from './site-callout.js'
import { checkWhitePaper } from './white-paper.js'
import { parseObjectLiteral } from './preset-parser.js'
import {
  SEMANTIC_COLOR_NAMES,
  checkPresetContract,
  findOffContractColorValues,
} from './semantic-contract.js'

/**
 * Does any of `sources` wire up a mailto link to `email`?
 *
 * Two spellings count, because the source is TSX and the contract asks the
 * engineer to BIND the address rather than type it: an interpolated
 * `mailto:${identity.email}` never contains the literal address, so a plain
 * substring test would reject the very authoring style the prompt requires.
 * A hardcoded but correct address still passes — the question this answers is
 * whether a visitor can mail Doug, not which syntax got them there.
 *
 * @param {string[]} sources - file contents to search
 * @param {string} email - the canonical address from identity.email
 * @returns {boolean}
 */
export function contactLinkPresent(sources, email) {
  const literal = `mailto:${email}`
  const bound = /mailto:\$\{[^}]*\bidentity\.email\b[^}]*\}/
  return sources.some((src) => src.includes(literal) || bound.test(src))
}

/**
 * Contact addresses at one of our own domains that are NOT the canonical one.
 *
 * {@link contactLinkPresent} asks whether anything links to the right address.
 * It cannot see a second link pointing at the wrong one, and that is exactly
 * what shipped: Footer.tsx bound `identity.email` while Sidebar.tsx still
 * hardcoded `hello@doug-march.com`, so the check passed while the live site
 * advertised two addresses, one of which has no MX records and silently
 * discards mail.
 *
 * Scoped to our own hosts on purpose. A `mailto:` to some other domain is
 * somebody else's address and none of this check's business.
 *
 * @param {string[]} sources - file contents to search
 * @param {string} email - the canonical address from identity.email
 * @param {string[]} hosts - every host that has ever been ours
 * @returns {string[]} stale addresses found, deduped
 */
export function staleContactAddresses(sources, email, hosts) {
  const found = new Set()
  for (const src of sources) {
    for (const m of src.matchAll(/mailto:([^"'`\s>)]+)/g)) {
      const addr = m[1]
      if (addr === email) continue
      if (addr.includes('${')) continue // an interpolation, resolved at runtime
      const domain = addr.split('@')[1]
      if (domain && hosts.includes(domain)) found.add(addr)
    }
  }
  return [...found]
}

/**
 * Every `.ts`/`.tsx` directly under app/components/ and under
 * app/components/generated/, repo-relative. The two scans in
 * `validateGenerated` that used to read app/components/ alone would have
 * missed the engineer's invented components once they moved a level down
 * (#448); fallow ignores that directory, the security scan must not. The
 * panel/ subdirectory is hand-written dev tooling and stays out, as before.
 * @param {string} root
 * @returns {string[]}
 */
function listComponentSources(root) {
  const out = []
  for (const dir of ['app/components', 'app/components/generated']) {
    let entries
    try {
      entries = readdirSync(resolve(root, dir), { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (entry.isFile() && /\.tsx?$/.test(entry.name)) out.push(`${dir}/${entry.name}`)
    }
  }
  return out
}

/**
 * Source files under `app/` that no route can reach.
 *
 * The orphans #216 owns: roughly thirty components in `app/components/` that
 * nothing imports any more, which Panda still scans and emits CSS for. They are
 * worth reporting and never worth failing a nightly run over, so the semantic
 * contract check warns on them.
 *
 * @param {string} root repo root
 * @param {Map<string, string>} reachable output of readReachableSources
 * @returns {string[]} repo-relative paths
 */
function unreachableSources(root, reachable) {
  const out = []
  const walk = (dir) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = resolve(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.tsx?$/.test(entry.name) && !reachable.has(full)) {
        out.push(
          full
            .slice(root.length + 1)
            .split(sep)
            .join('/')
        )
      }
    }
  }
  walk(resolve(root, 'app'))
  return out.sort()
}

/**
 * Read one quoted literal's body starting just after its opening `quote`.
 *
 * @param {string} source
 * @param {number} start index just past the opening quote
 * @param {string} quote the quote character that opened it (`'`, `"`, or `` ` ``)
 * @returns {{ content: string, endIndex: number }} the body, and the index of
 *   the closing quote (or `source.length` if the literal never closes)
 */
function readQuotedBody(source, start, quote) {
  let content = ''
  for (let i = start; i < source.length; i++) {
    const c = source[i]
    if (c === '\\') {
      content += c + (source[i + 1] ?? '')
      i++
      continue
    }
    if (c === quote) return { content, endIndex: i }
    content += c
  }
  return { content, endIndex: source.length }
}

/**
 * Read the identifier/keyword run starting at `source[start]`.
 *
 * @param {string} source
 * @param {number} start
 * @returns {{ word: string, endIndex: number }} the word, and the index
 *   just past it
 */
function readWord(source, start) {
  let end = start
  while (end < source.length && /[A-Za-z0-9_$]/.test(source[end])) end++
  return { word: source.slice(start, end), endIndex: end }
}

/**
 * Would a `'` / `"` right here open a string, given what came before it?
 * Mirrors token-gate.js's `CAN_OPEN_STRING` heuristic — an apostrophe in JSX
 * text like `don't` must not be mistaken for an opening quote — plus
 * `EXPRESSION_KEYWORDS`: `return 'https://…'` has no punctuation before the
 * quote at all, only whitespace after a keyword (#313).
 *
 * @param {string|null} lastSignificant
 * @param {string} lastWord
 * @returns {boolean}
 */
function quoteCanOpen(lastSignificant, lastWord) {
  return (
    lastSignificant === null ||
    CAN_OPEN_STRING.has(lastSignificant) ||
    EXPRESSION_KEYWORDS.has(lastWord)
  )
}

/**
 * The contents of every quoted string and template literal in `source`,
 * quotes stripped, in source order.
 *
 * The security scan's URL allowlist is only meaningful against a string a
 * runtime value could carry — `fetch(someUrl)` matters, `// see
 * https://evil.example.com/docs` never runs. Meant to run on output already
 * passed through `stripComments`.
 *
 * @param {string} source
 * @returns {string[]}
 */
function stringLiterals(source) {
  const literals = []
  let lastSignificant = null
  let lastWord = ''
  for (let i = 0; i < source.length; i++) {
    const c = source[i]
    if (/[A-Za-z0-9_$]/.test(c)) {
      const word = readWord(source, i)
      lastWord = word.word
      i = word.endIndex - 1
      continue
    }
    const canOpen = c === '`' || quoteCanOpen(lastSignificant, lastWord)
    if ((c === "'" || c === '"' || c === '`') && canOpen) {
      const { content, endIndex } = readQuotedBody(source, i + 1, c)
      literals.push(content)
      lastSignificant = c
      lastWord = ''
      i = endIndex
      continue
    }
    if (!/\s/.test(c)) {
      lastSignificant = c
      lastWord = ''
    }
  }
  return literals
}

/**
 * Security-sensitive code patterns Check 5 of `validateGenerated` scans for.
 * AI output is untrusted — a compromised or prompt-injected agent can emit
 * code that exfiltrates data, runs arbitrary scripts, or loads third-party
 * resources. This is the second line of defense after signal sanitization in
 * collect-signals.js.
 *
 * Hoisted to module scope and exported (rather than declared inside
 * `validateGenerated`) so `scripts/utils/gate-rules.js` can render the same
 * list into `react-engineer.md` — the prompt cannot list a pattern the scan
 * does not also check, or vice versa (#432).
 *
 * @type {ReadonlyArray<{ name: string, regex: RegExp, severity: string }>}
 */
export const DANGEROUS_PATTERNS = [
  { name: 'fetch() call', regex: /\bfetch\s*\(/, severity: 'blocks network exfiltration' },
  {
    name: 'XMLHttpRequest',
    regex: /\bXMLHttpRequest\b/,
    severity: 'blocks network exfiltration',
  },
  {
    name: 'sendBeacon',
    regex: /\bnavigator\.sendBeacon\b/,
    severity: 'blocks network exfiltration',
  },
  { name: 'WebSocket', regex: /\bnew\s+WebSocket\b/, severity: 'blocks network exfiltration' },
  {
    name: 'EventSource',
    regex: /\bnew\s+EventSource\b/,
    severity: 'blocks network exfiltration',
  },
  { name: 'eval()', regex: /\beval\s*\(/, severity: 'blocks arbitrary code execution' },
  {
    name: 'new Function()',
    regex: /\bnew\s+Function\s*\(/,
    severity: 'blocks arbitrary code execution',
  },
  {
    name: 'dynamic import()',
    regex: /\bimport\s*\(\s*[`'"]/,
    severity: 'blocks arbitrary module loading',
  },
  { name: 'dangerouslySetInnerHTML', regex: /dangerouslySetInnerHTML/, severity: 'blocks XSS' },
  { name: 'document.write', regex: /document\.write\s*\(/, severity: 'blocks XSS' },
  { name: 'innerHTML assignment', regex: /\.innerHTML\s*=/, severity: 'blocks XSS' },
  { name: 'script tag', regex: /<script[\s>]/i, severity: 'blocks inline scripts' },
  { name: 'javascript: URL', regex: /javascript:/i, severity: 'blocks XSS via URL' },
  // onerror/onclick as HTML attributes only (not JS property assignments like es.onerror = fn)
  {
    name: 'inline onerror attribute',
    regex: /\sonerror\s*=\s*["']/i,
    severity: 'blocks inline event handlers',
  },
  {
    name: 'inline onclick attribute',
    regex: /\sonclick\s*=\s*["']/i,
    severity: 'blocks inline event handlers',
  },
  { name: 'atob/btoa', regex: /\b(?:atob|btoa)\s*\(/, severity: 'blocks obfuscated payloads' },
]

/**
 * Allowlist of domains permitted in URL strings in generated code. Fonts,
 * project-owned URLs, and XML namespace identifiers. Any other domain is
 * flagged by Check 5 of `validateGenerated`.
 *
 * Hoisted to module scope and exported for the same reason as
 * `DANGEROUS_PATTERNS` above — `scripts/utils/gate-rules.js` renders this
 * exact set into `react-engineer.md`, so the prompt's host list cannot go
 * stale against the scan the way it did for #432 (missing `doug-march.com`
 * and `www.w3.org`).
 *
 * @type {ReadonlySet<string>}
 */
export const ALLOWED_URL_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'spaceman.llc',
  'getfishsticks.com',
  '15th.club',
  // Every recognized site host, not just today's: archived designs and
  // hand-written links may reference either side of a domain move.
  ...RECOGNIZED_HOSTS,
  'github.com',
  // XML namespace URIs that appear in xmlns / xmlns:xlink attributes on
  // inline SVG. These are identifiers, not fetchable URLs — no network
  // request is ever made to them, and inline SVG without xmlns can fail
  // to render in some environments.
  'www.w3.org',
])

/**
 * Pre-build validation: check for known bad patterns in generated code.
 * Catches issues that `pnpm build` misses but break SSR at runtime.
 *
 * @returns {{ success: boolean, error?: string }}
 */
/**
 * @param {{ root?: string, shell?: object|null }} [options] where to scan, and
 *   the day's parsed SHELL declaration. `shell` is what turns the
 *   "declared a lockup, rendered nothing" check on; omit it and that one
 *   check is skipped, which is what every caller outside the nightly run wants.
 *   Tests pass a temp tree: this used to be scanned against the real ROOT,
 *   which meant two test files dropped fixtures into app/components/ while
 *   vitest ran files in parallel, and the scan swept up whatever the nightly
 *   had left in the working tree. Six assertions were written as
 *   `if (!result.success) expect(...).not.toContain(...)` to survive that —
 *   they silently skipped on any checkout with an unrelated validator error.
 */
export function validateGenerated({ root = ROOT, shell = null } = {}) {
  const errors = []

  // Check 1: Circular token references in preset.ts
  // e.g., fonts.heading: '{fonts.heading}' creates an infinite loop in PandaCSS
  try {
    const presetPath = resolve(root, 'elements/preset.ts')
    const preset = readFileSync(presetPath, 'utf8')

    const semanticStart = preset.indexOf('semanticTokens')
    if (semanticStart > -1) {
      const semanticSection = preset.slice(semanticStart)

      // Check for self-referencing tokens: '{tokenCategory.tokenName}' where the
      // surrounding context is defining that same tokenCategory.tokenName
      // This catches: fonts: { heading: { value: '{fonts.heading}' } }
      const selfRefCategories = [
        'fonts',
        'fontSizes',
        'fontWeights',
        'lineHeights',
        'letterSpacings',
      ]

      for (const category of selfRefCategories) {
        // Find if this category appears in semantic tokens
        const catRegex = new RegExp(`${category}\\s*:\\s*\\{`, 'g')
        for (const catMatch of semanticSection.matchAll(catRegex)) {
          // Parse the block itself (preset-parser.js) rather than counting
          // braces by hand — a hand-rolled counter treats a brace inside a
          // comment or a string as a real one, which misplaces the close and
          // was reporting a matching contract name as missing over nothing
          // but a comment (#318).
          const openBrace = catMatch.index + catMatch[0].length - 1
          let block
          try {
            block = parseObjectLiteral(semanticSection, openBrace)
          } catch {
            continue
          }

          // Check for self-references: a value of exactly '{category.tokenName}'
          // under that same tokenName, whether written bare or wrapped in
          // `{ value: ... }`.
          for (const [tokenName, rawValue] of Object.entries(block)) {
            const value =
              rawValue !== null && typeof rawValue === 'object' && 'value' in rawValue
                ? rawValue.value
                : rawValue
            if (value === `{${category}.${tokenName}}`) {
              errors.push(
                `Circular token: semanticTokens.${category}.${tokenName} references '{${category}.${tokenName}}' (self-reference breaks PandaCSS)`
              )
            }
          }
        }
      }
    }
  } catch {
    // If we can't read preset.ts, that's a bigger problem — build will catch it
  }

  // Check 2: Non-type imports of React types in component files
  // e.g., import { ReactNode } from 'react' breaks SSR — must be import type { ReactNode }
  // Dynamically scan all .tsx files in app/components/ and app/components/generated/
  // (the engineer may invent any component under generated/)
  let componentFiles = listComponentSources(root).filter((f) => f.endsWith('.tsx'))
  if (componentFiles.length === 0) {
    componentFiles = ['app/components/Layout.tsx', 'app/components/Sidebar.tsx']
  }

  const reactTypes = [
    'ReactNode',
    'ReactElement',
    'FC',
    'PropsWithChildren',
    'CSSProperties',
    'MouseEvent',
    'ChangeEvent',
    'FormEvent',
  ]

  for (const file of componentFiles) {
    try {
      const content = readFileSync(resolve(root, file), 'utf8')
      // Match ALL value imports from 'react' (not just the first one).
      // The old .match() with no /g flag only caught the first occurrence,
      // missing subsequent imports that AI often splits across multiple lines.
      // Explicitly excludes `import type { ... } from 'react'` since those
      // are correct.
      const importRegex = /^import\s+\{([^}]+)\}\s+from\s+['"]react['"]/gm
      for (const importMatch of content.matchAll(importRegex)) {
        const imports = importMatch[1].split(',').map((s) => s.trim())
        const typeImports = imports.filter((i) => reactTypes.includes(i))
        if (typeImports.length > 0) {
          errors.push(
            `${file}: import { ${typeImports.join(', ')} } from 'react' must use 'import type' — breaks SSR`
          )
        }
      }
    } catch {
      // File doesn't exist or can't be read — skip
    }
  }

  // Check 3: __root.tsx must import Scripts and ScrollRestoration from
  // @tanstack/react-router AND render them. Previously we just did a
  // substring check for "Scripts" which would pass on a fake local
  // `function Scripts() { return null }` — that breaks SPA hydration
  // but satisfies the old regex.
  try {
    const rootContent = readFileSync(resolve(root, 'app/routes/__root.tsx'), 'utf8')
    // Must import Scripts from the router package (not a fake local definition)
    const routerImport = rootContent.match(
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@tanstack\/react-router['"]/
    )
    if (!routerImport) {
      errors.push('app/routes/__root.tsx: no import from @tanstack/react-router')
    } else {
      const imports = routerImport[1].split(',').map((s) => s.trim())
      if (!imports.includes('Scripts')) {
        errors.push(
          'app/routes/__root.tsx: Scripts not imported from @tanstack/react-router — client JS will not load and routes will render empty'
        )
      }
    }
    // Must render <Scripts /> or <Scripts/> somewhere (JSX usage)
    if (!/<Scripts\s*\/?>/m.test(rootContent)) {
      errors.push(
        'app/routes/__root.tsx: <Scripts /> not rendered in JSX — client JS will not load'
      )
    }
    // Reject fake local definitions that satisfy other checks
    if (/function\s+Scripts\s*\(\s*\)/.test(rootContent)) {
      errors.push(
        'app/routes/__root.tsx: has a local `function Scripts()` definition — must use the import from @tanstack/react-router'
      )
    }
    // head() must declare UTF-8 charset. Without it, em-dashes, smart
    // quotes, and other non-ASCII bytes from signals/briefs render as
    // Mojibake (`â€"` etc.) in the browser.
    if (!/charSet\s*:\s*['"]utf-8['"]/i.test(rootContent)) {
      errors.push(
        'app/routes/__root.tsx: head() missing meta charSet "utf-8" — non-ASCII characters will render as Mojibake'
      )
    }
  } catch {}

  // Check 4: Route files must NOT import or use Layout. __root.tsx already
  // wraps all routes in <Layout> — importing it again creates double headers.
  // Dynamically scan every .tsx in app/routes/ so newly-added routes are
  // covered (the old hardcoded list missed anything new).
  try {
    const routesDir = resolve(root, 'app/routes')
    const routeFiles = readdirSync(routesDir)
      .filter((f) => f.endsWith('.tsx') && f !== '__root.tsx')
      .map((f) => `app/routes/${f}`)

    for (const file of routeFiles) {
      try {
        const content = readFileSync(resolve(root, file), 'utf8')
        if (/from\s+['"]\.\.\/components\/Layout['"]/.test(content)) {
          errors.push(
            `${file}: imports Layout — routes must NOT import Layout (already provided by __root.tsx). This creates a double header.`
          )
        }
      } catch {}
    }
  } catch {}

  // Check 5: Scan generated code for security-sensitive patterns.
  // AI output is untrusted — a compromised or prompt-injected agent can
  // emit code that exfiltrates data, runs arbitrary scripts, or loads
  // third-party resources. This is the second line of defense after
  // signal sanitization in collect-signals.js.

  // Per-file exceptions for legitimate current uses in AI-generated files.
  // Keep this small and explicit — every exception is an increase in
  // attack surface. Non-mutable files (archive.tsx, elements.tsx, dev.tsx)
  // are not scanned at all, so no exception is needed for them.
  const PATTERN_EXCEPTIONS = {
    // __root.tsx contains the theme-init script (dark mode detection on
    // first paint). The AI must preserve this pattern when regenerating.
    // The script's content is not validated here — only that a theme init script exists.
    // check in Check 3.
    'app/routes/__root.tsx': ['script tag'],
  }

  // Files to scan: only AI-generated mutable files. Hand-maintained
  // files like elements.tsx, archive.tsx, archive.$date.tsx, dev.tsx are
  // excluded — they have different trust boundaries.
  // Plus any components/ files the engineer may have added beyond the
  // canonical list (dynamically discovered), including everything under
  // app/components/generated/ — fallow ignores that directory, this scan
  // does not (#448).
  const filesToScan = [...MUTABLE_FILES]
  for (const relPath of listComponentSources(root)) {
    if (!filesToScan.includes(relPath)) filesToScan.push(relPath)
  }

  for (const file of filesToScan) {
    let content
    try {
      content = readFileSync(resolve(root, file), 'utf8')
    } catch {
      continue
    }

    // Strip comments so patterns in comments don't trigger false positives.
    // Uses the shared, string-aware stripComments (#309) rather than a plain
    // regex: a trailing `// see https://…` line comment used to survive
    // (only a standalone comment line was removed), and the old block-comment
    // regex was not string-aware, so `const a = "/*"` followed later by
    // `const b = "*/"` deleted every real line in between, fetch() calls
    // included (#313).
    const stripped = stripComments(content)

    const fileExceptions = PATTERN_EXCEPTIONS[file] || []

    for (const { name, regex, severity } of DANGEROUS_PATTERNS) {
      if (fileExceptions.includes(name)) continue
      if (regex.test(stripped)) {
        errors.push(`${file}: contains ${name} (${severity})`)
      }
    }

    // Check URLs against the allowlist, but only inside string literals —
    // a URL mentioned in JSX prose or left over in a comment is not a value
    // any runtime code will fetch (#313).
    for (const literal of stringLiterals(stripped)) {
      const urlMatches = literal.matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)
      for (const match of urlMatches) {
        const host = match[1].toLowerCase()
        if (!ALLOWED_URL_HOSTS.has(host)) {
          errors.push(
            `${file}: contains disallowed URL to ${host} (only ${[...ALLOWED_URL_HOSTS].join(', ')} are allowed)`
          )
        }
      }
    }
  }

  // Check 6: the contact address must survive the night.
  //
  // It has no other enforcement. `identity.email` in app/content/about.ts is
  // the source of truth, but nothing makes the engineer bind it, and on
  // 2026-08-29 the build silently replaced Sidebar.tsx's `mailto:` with a
  // `/#contact` page anchor while Footer.tsx kept a link — so a per-file rule
  // would have false-positived. The site-wide question is the real one: can a
  // visitor mail Doug at all?
  //
  // Read the address as text rather than importing about.ts: this is a plain
  // .js script and node is pinned to 22.15.1, where type stripping is still
  // behind a flag. Same regex-over-the-source idiom site-context.js uses for
  // projects.ts.
  //
  // Two spellings count, because the source is TSX and the prompt asks the
  // engineer to BIND the address rather than type it: an interpolated
  // `mailto:${identity.email}` never contains the literal address, so a plain
  // substring test would fail the very authoring style the contract requires.
  let contactEmail = null
  try {
    const aboutSrc = readFileSync(resolve(root, 'app/content/about.ts'), 'utf8')
    contactEmail = aboutSrc.match(/email:\s*'([^']+)'/)?.[1] ?? null
  } catch {}

  if (!contactEmail) {
    errors.push(
      'app/content/about.ts: no `email` field on identity — it is the source of ' +
        'truth for the contact address and Check 6 cannot run without it'
    )
  } else {
    const sources = filesToScan.map((file) => {
      try {
        return readFileSync(resolve(root, file), 'utf8')
      } catch {
        return ''
      }
    })
    if (!contactLinkPresent(sources, contactEmail)) {
      errors.push(
        `no file links to mailto:${contactEmail} — bind it from identity.email ` +
          `(app/content/about.ts); scanned ${filesToScan.length} files`
      )
    }

    // A present-and-correct link does not mean there is no second, wrong one.
    const stale = staleContactAddresses(sources, contactEmail, RECOGNIZED_HOSTS)
    if (stale.length > 0) {
      errors.push(
        `stale contact address(es) at our own domains: ${stale.join(', ')} — ` +
          `the canonical address is ${contactEmail} (identity.email in ` +
          `app/content/about.ts). Bind it rather than hardcoding.`
      )
    }
  }

  // Check 7: nobody draws the brand mark but BrandLockup.
  //
  // The mark had no owner. Every night the engineer built one from
  // logo-mono.svg or from pasted path data, and it kept shipping wrong: gone
  // entirely on 2026-07-10, "a gray box" on 2026-07-22, 11px against a 44px
  // mockup on 2026-08-30. Five leftover attempts still sit in app/components/.
  // app/components/BrandLockup.tsx is generated by the orchestrator every run
  // from scripts/templates/BrandLockup.tsx.template; these three rules are what
  // stop a sixth attempt from appearing beside it. See #254.
  //
  // Scanned against the files a route can actually reach, the same orphan
  // filter the token gate uses. The five leftovers are real and they are
  // exactly this failure, but no page renders them and #216 owns deleting
  // them — failing tonight's build over a file nobody sees would kill a run
  // that was fine.
  const LOCKUP_OWNER = 'app/components/BrandLockup.tsx'
  try {
    const reachable = readReachableSources(root)
    const engineerSources = []
    for (const [absPath, source] of reachable) {
      const rel = absPath
        .slice(root.length + 1)
        .split(sep)
        .join('/')
      if (rel === LOCKUP_OWNER || rel === MATERIAL_OWNER) continue
      engineerSources.push([rel, source])
    }

    // Check 7b: nobody synthesizes a material but Material.tsx (#505). The
    // material library is generated from scripts/templates/Material.tsx.template
    // the way the lockup is, and an `feTurbulence` in an engineer file is a
    // hand-rolled grain standing in for the declared one, the same failure as
    // pasted mark path data.
    for (const [rel, source] of engineerSources) {
      if (/\bfeTurbulence\b/.test(source)) {
        errors.push(
          `${rel}: defines its own feTurbulence, and material is owned by ${MATERIAL_OWNER}. ` +
            'Render <Ground material=... seed=... /> with the declared line instead of redrawing it.'
        )
      }
    }

    for (const [rel, source] of engineerSources) {
      if (/from\s+['"][^'"]*\/logo(?:-mono)?\.svg['"]/.test(source)) {
        errors.push(
          `${rel}: imports the logo SVG directly — the mark is owned by ${LOCKUP_OWNER}. ` +
            `Render <BrandLockup variant=... mode=... /> instead; it carries both color modes.`
        )
      }
      const collapsed = source.replace(/\s+/g, ' ')
      const pasted = MARK_PATH_FINGERPRINTS.filter((fragment) => collapsed.includes(fragment))
      if (pasted.length > 0) {
        errors.push(
          `${rel}: contains the brand mark's path data inline (matched ${pasted.join(', ')}) — ` +
            `the mark is drawn once, in ${LOCKUP_OWNER}. Render <BrandLockup /> instead of redrawing it.`
        )
      }
    }

    // The declaration says a lockup is on the page. Something has to render it.
    if (lockupIsDeclared(shell)) {
      const rendered = engineerSources.some(([, source]) => /<BrandLockup[\s/>]/.test(source))
      if (!rendered) {
        errors.push(
          `SHELL declares brand_lockup: ${shell.brand_lockup}, but no file renders <BrandLockup /> — ` +
            `the declared lockup is not on the page. Scanned ${engineerSources.length} reachable files.`
        )
      }
    }
  } catch (err) {
    console.warn(`  brand lockup check skipped: ${err.message}`)
  }

  // Check 7c: the white paper keeps its layout (#533).
  //
  // /work/dougmar-ch is rendered by app/components/WhitePaper.tsx, which the
  // orchestrator writes from a template the way it writes the lockup and the
  // material. The difference is that those two are placed wherever the day's
  // design wants them, and this one has a single place: work.$slug.tsx, which
  // the engineer rewrites every night. A night that forgets it ships the
  // generated case study in its place and nothing else would notice, so the
  // route is read here. See white-paper.js for the three findings.
  try {
    const sources = []
    for (const [absPath, source] of readReachableSources(root)) {
      const rel = absPath
        .slice(root.length + 1)
        .split(sep)
        .join('/')
      sources.push([rel, source])
    }
    errors.push(...checkWhitePaper({ root, sources }))
  } catch (err) {
    console.warn(`  white paper check skipped: ${err.message}`)
  }

  // Check 7d: the home page places the callout (#532).
  //
  // <SiteCallout /> is the only element allowed to say what the site does, and
  // on `/` it also carries the archive link that __root.tsx renders everywhere
  // else. The engineer places it, so the engineer can drop it, and a home page
  // without it has no route into the archive at all. That is #155 again, and
  // this is what stands where the root-level link used to: the miss fails the
  // build and goes back to the engineer with the line to add.
  //
  // A tree with no index.tsx at all is the required-files gate's finding
  // (engineer-output-check.js), not a second one here.
  try {
    errors.push(...checkCalloutPlacement(readFileSync(resolve(root, HOME_ROUTE), 'utf8')))
  } catch {}

  // Check 8: the frozen semantic colour contract (#255).
  //
  // Eight consecutive presets defined eight different semantic sets, so the
  // engineer either named a token that did not exist that night or gave up on
  // the semantic layer and reached into the palette — `sand.300` and
  // `gold.800` throughout 2026-08-30's Layout.tsx. A raw scale step resolves,
  // so no gate saw it, and it pins an ink to a value the day's design cannot
  // move. scripts/utils/semantic-contract.js is the one list; this enforces it
  // from both sides.
  //
  // (a) The preset defines the contract, all of it and nothing else. Extras are
  //     rejected as firmly as omissions: an extra name is a role the engineer
  //     cannot rely on tomorrow, and it is what leaves a component behind
  //     referencing a name the next night no longer defines.
  try {
    const presetSource = readFileSync(resolve(root, 'elements/preset.ts'), 'utf8')
    const contract = checkPresetContract(presetSource)
    if (contract.missing.length > 0) {
      errors.push(
        `elements/preset.ts: semanticTokens.colors is missing ${contract.missing.join(', ')} — ` +
          `the semantic set is frozen at ${SEMANTIC_COLOR_NAMES.length} names and every one must be ` +
          'defined. Map the missing role onto the palette this design already has.'
      )
    }
    if (contract.extra.length > 0) {
      errors.push(
        `elements/preset.ts: semanticTokens.colors defines ${contract.extra.join(', ')}, which is ` +
          `not in the frozen set (${SEMANTIC_COLOR_NAMES.join(', ')}). A name invented for one ` +
          'night is a name the next build cannot use. Map that colour onto one of the canonical roles.'
      )
    }
  } catch {
    // An unreadable preset is a bigger problem and check 1 already says so.
  }

  // (b) Engineer TSX names the contract and nothing else in a colour position.
  //
  //     Scoped the way the token gate and the lockup rules are: a finding in a
  //     file the nightly agents own blocks, and a finding in an orphan (#216) or
  //     a hand-maintained file warns. The error string is handed to a React
  //     Engineer retry, and a finding in a file the agent may not open would
  //     burn that retry and then fail the run anyway.
  try {
    const reachable = readReachableSources(root)
    const relOf = (absPath) =>
      absPath
        .slice(root.length + 1)
        .split(sep)
        .join('/')
    const owned = new Set(MUTABLE_FILES.filter((f) => !ORCHESTRATOR_FILES.includes(f)))
    const describe = (rel, findings) =>
      `${rel}: ${findings.map((f) => `${f.prop}: '${f.value}'`).join(', ')} — not in the frozen ` +
      `semantic set (${SEMANTIC_COLOR_NAMES.join(', ')}). A raw palette step resolves and still ` +
      "pins the colour to one scale value the day's design cannot move; use the semantic role."

    const offContract = []
    for (const [absPath, source] of reachable) {
      const findings = findOffContractColorValues(source)
      if (findings.length > 0) offContract.push([relOf(absPath), findings, true])
    }
    for (const rel of unreachableSources(root, reachable)) {
      const findings = findOffContractColorValues(readFileSync(resolve(root, rel), 'utf8'))
      if (findings.length > 0) offContract.push([rel, findings, false])
    }

    const warnings = []
    for (const [rel, findings, isReachable] of offContract) {
      if (isReachable && owned.has(rel)) errors.push(describe(rel, findings))
      else warnings.push(describe(rel, findings))
    }
    for (const w of warnings.slice(0, 8)) {
      console.warn(`  ⚠ ${w} (not a file the nightly agents own or render, so not blocking)`)
    }
    if (warnings.length > 8) {
      console.warn(`  ⚠ ${warnings.length - 8} more off-contract colour reference(s) not shown`)
    }
  } catch (err) {
    console.warn(`  semantic colour contract check skipped: ${err.message}`)
  }

  // Check 9: every internal link goes somewhere.
  //
  // 2026-09-01 shipped a nav reading WORK / ABOUT / NOW. There is no `/now`
  // route and never has been, so every page on the site — the nav lives in the
  // shell — carried a link straight to the 404. Nothing caught it: the route
  // renders, the build compiles, the token gate is about colour and spacing,
  // and the surface gate only walks routes it already knows exist. A link to a
  // route that does not exist is invisible to all of them.
  //
  // The engineer invents nav labels from the day's composition, which is the
  // point — the shell is a design surface. It just has to point at real pages.
  // See checkInternalLinks below for how a link is found and resolved.
  errors.push(...checkInternalLinks({ root }))

  // Check: token references that resolve to nothing.
  //
  // Panda emits an unknown token as the bare string, so `color: 'panel'`
  // becomes `color: panel`, the browser drops the declaration, and the element
  // renders with its inherited value. Nothing throws. The only token check
  // above this one is for circular semantic references; a name that was never
  // defined passes everything.
  //
  // A warning, not an error, deliberately: the agent currently emits
  // `fontFamily: 'mono'` on most nights and the chassis defines only
  // display/body, so blocking on it today would fail every run before the
  // prompt is taught otherwise. Making it blocking is changing `console.warn`
  // to `errors.push` — worth doing once a green run confirms a clean baseline.
  try {
    const unknownTokens = checkTokenExistence({ root, files: MUTABLE_FILES })
    for (const { file, prop, value, category } of unknownTokens) {
      console.warn(
        `  ⚠ ${file}: ${prop}: '${value}' is not a token (no ${category}.${value}) — Panda emits the bare string and the browser drops the declaration`
      )
    }
    if (unknownTokens.length === 0) console.log('  token references all resolve')
  } catch (err) {
    console.warn(`  token existence check skipped: ${err.message}`)
  }

  if (errors.length > 0) {
    const errorMsg = `Pre-build validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    console.log('  pre-build validation failed')
    for (const e of errors) console.log(`  ✗ ${e}`)
    return { success: false, error: errorMsg }
  }

  console.log('  pre-build validation passed')
  return { success: true }
}

/**
 * The routes this app actually serves.
 *
 * Derived from the route files on disk plus the project slugs, rather than a
 * hardcoded list, because both move: `app/routes/*.tsx` is how TanStack Router
 * defines them and app/content/projects.ts is what fills `work.$slug`.
 *
 * @param {string} root repo root
 * @returns {{ static: string[], dynamic: string[] }}
 */
export function knownRoutes(root) {
  let files = []
  try {
    files = readdirSync(resolve(root, 'app/routes')).filter((f) => f.endsWith('.tsx'))
  } catch {
    return { static: ['/'], dynamic: [] }
  }

  const staticRoutes = new Set(['/'])
  const dynamic = []
  for (const file of files) {
    const stem = file.replace(/\.tsx$/, '')
    if (stem === '__root') continue
    // TanStack file routing: dots are path separators, `$x` is a parameter,
    // and `index` names the parent segment itself.
    const segments = stem.split('.')
    if (segments.some((seg) => seg.startsWith('$'))) {
      dynamic.push(
        '/' + segments.map((seg) => (seg.startsWith('$') ? ':' + seg.slice(1) : seg)).join('/')
      )
      continue
    }
    if (segments[segments.length - 1] === 'index') segments.pop()
    staticRoutes.add(segments.length === 0 ? '/' : '/' + segments.join('/'))
  }

  // The slugs that make `work.$slug` resolve. A link to /work/<real-slug> is
  // good; one to /work/<invented> is exactly the bug this check exists for,
  // so they are listed concretely rather than matched by the pattern.
  let enumeratedSlugs = false
  try {
    const projects = readFileSync(resolve(root, 'app/content/projects.ts'), 'utf8')
    for (const [, slug] of projects.matchAll(/slug:\s*'([^']+)'/g)) {
      staticRoutes.add(`/work/${slug}`)
      enumeratedSlugs = true
    }
  } catch {}

  // With the real slugs listed, `/work/:slug` must stop matching — otherwise a
  // link to an invented project passes the check, which is the same bug as
  // /now wearing a different name. Patterns we cannot enumerate (`/how/:date`,
  // one page per archived build) stay as patterns.
  const narrowed = enumeratedSlugs ? dynamic.filter((p) => p !== '/work/:slug') : dynamic

  return { static: [...staticRoutes].sort(), dynamic: narrowed }
}

/**
 * Internal link targets written in a source file.
 *
 * Both spellings the tree uses: TanStack's `to="/about"` and a plain
 * `href="/about"`. External links, mailto, anchors and template expressions
 * are not ours to check.
 *
 * @param {string} source
 * @returns {string[]}
 */
export function internalHrefs(source) {
  const found = new Set()
  for (const [, value] of source.matchAll(/\b(?:to|href)=["']([^"'{}]+)["']/g)) {
    if (!value.startsWith('/')) continue
    const path = value.split(/[?#]/)[0]
    if (path.length > 1) found.add(path.replace(/\/$/, ''))
    else found.add('/')
  }
  return [...found]
}

/**
 * Does a link target resolve against the app's routes?
 *
 * `/archive/…` and `/og/…` are not TanStack routes at all — vercel.json's
 * rewrite excludes both prefixes from the SPA shell and serves them as static
 * files (sealed archive builds, OG images), so a link into either is fine
 * even though no route file matches it.
 *
 * @param {string} href
 * @param {{ static: string[], dynamic: string[] }} routes
 * @returns {boolean}
 */
export function routeExists(href, routes) {
  if (routes.static.includes(href)) return true
  if (href.startsWith('/archive/') || href.startsWith('/og/')) return true
  const parts = href.split('/').filter(Boolean)
  return routes.dynamic.some((pattern) => {
    const segs = pattern.split('/').filter(Boolean)
    if (segs.length !== parts.length) return false
    return segs.every((seg, i) => seg.startsWith(':') || seg === parts[i])
  })
}

/**
 * Every internal link in `files` resolves to a route that exists.
 *
 * @param {{ root?: string, files?: string[] }} [options]
 * @returns {string[]} zero or one error message, ready to push into `errors`
 */
export function checkInternalLinks({ root = ROOT, files = MUTABLE_FILES } = {}) {
  const routes = knownRoutes(root)
  const deadLinks = []
  for (const file of files) {
    let source
    try {
      source = readFileSync(resolve(root, file), 'utf8')
    } catch {
      continue
    }
    for (const href of internalHrefs(source)) {
      if (!routeExists(href, routes)) deadLinks.push(`${file} -> ${href}`)
    }
  }
  if (deadLinks.length === 0) return []
  return [
    `link(s) to routes that do not exist: ${deadLinks.join(', ')}. ` +
      `The routes that exist are: ${routes.static.join(', ')}` +
      (routes.dynamic.length > 0 ? `, plus ${routes.dynamic.join(', ')}` : '') +
      '. Link to one of those, or drop the item.',
  ]
}

/**
 * Persist the FULL combined stdout+stderr of a `pnpm build` run to
 * `archive/<date>/last-build-output.txt` (overwritten each attempt), so
 * future diagnostics have the untruncated log — the 3000-char tail kept in
 * the returned `error` string truncated the real Vite / @tanstack/router-plugin
 * error the last time the pipeline failed.
 *
 * Every other path in the run keys the day on America/New_York, not UTC —
 * `date` is always the caller's run date, so the log lands beside the rest
 * of that day's archive instead of a UTC-shifted neighbor (#311).
 *
 * @param {string} combined
 * @param {string} date
 * @param {string} root the checkout whose archive/ receives the log
 */
function writeBuildOutputLog(combined, date, root) {
  const outputDir = resolve(root, 'archive', date)
  const outputPath = resolve(outputDir, 'last-build-output.txt')
  try {
    mkdirSync(outputDir, { recursive: true })
    writeFileSync(outputPath, combined, 'utf8')
    console.log(
      `  full build output written to archive/${date}/last-build-output.txt (${combined.length} chars)`
    )
  } catch (writeErr) {
    console.warn(`  could not write full build output to ${outputPath}: ${writeErr.message}`)
  }
}

/**
 * Run `pnpm build` in `root` — the `pnpm build` gate of `validateBuild`.
 *
 * Returns `{ success: true, combined }` on success, `{ success: false, error,
 * combined }` on failure — `combined` (the raw stdout+stderr) is returned
 * either way so a caller whose build DID succeed can still search the log for
 * runtime errors if the smoke checks that follow find a status-0 build with
 * unusable output.
 *
 * On failure:
 *   1. The full log is written to disk via `writeBuildOutputLog`.
 *   2. The last ~2000 chars of combined output are printed to the console.
 *   3. If the output contains a line matching `/^Error: /m` (typical
 *      `@tanstack/router-plugin` configResolved crashes surface the real
 *      error this way, often hundreds of lines ABOVE the tail), that line
 *      is hoisted to the top of the returned `error` string so callers see
 *      it first.
 *
 * @param {{ spawn: typeof spawnSync, date: string, root: string }} deps
 * @returns {{ success: boolean, error?: string, combined: string }}
 */
function runBuildGate({ spawn, date, root }) {
  console.log('  running pnpm build...')

  const result = spawn('pnpm', ['build'], {
    cwd: root,
    encoding: 'utf8',
    timeout: STEP_BUDGETS.buildMs,
  })
  const combined = (result.stderr ?? '') + (result.stdout ?? '')

  if (result.status === 0) {
    return { success: true, combined }
  }

  writeBuildOutputLog(combined, date, root)

  // Surface `@tanstack/router-plugin` / Vite `Error: …` lines that would
  // otherwise be buried above the stack trace tail.
  const errorLineMatch = combined.match(/^Error: .*$/m)
  const headline = errorLineMatch ? errorLineMatch[0] : null

  const tail = combined.slice(-3000)
  const error = headline
    ? `${headline}\n\n---\n(last 3000 chars of build output follows)\n---\n\n${tail}`
    : tail

  console.log('  build failed')
  if (headline) {
    console.log(`  headline: ${headline}`)
  }
  console.log('  --- last 2000 chars of build output ---')
  console.log(combined.slice(-2000))
  console.log('  ---')

  return { success: false, error, combined }
}

/**
 * The build output smoke check gate of `validateBuild` — only reachable when
 * `pnpm build` exited 0. An AI designer can produce a preset that compiles
 * but renders blank pages, or an `__root.tsx` that omits `Scripts` so the
 * page never hydrates; `validateBuildOutput` catches that class of failure.
 *
 * On failure the full build log is persisted too — a status-0-but-no-shell
 * failure is otherwise invisible, since `runBuildGate` only writes the log
 * on a non-zero exit.
 *
 * @param {{ root: string, combined: string, date: string }} deps
 * @returns {{ success: boolean, error?: string }}
 */
function runSmokeCheckGate({ root, combined, date }) {
  const smokeCheck = validateBuildOutput({ root })
  if (smokeCheck.success) return { success: true }

  console.log('  build output smoke check failed')
  for (const e of smokeCheck.errors) console.log(`  ✗ ${e}`)
  writeBuildOutputLog(combined, date, root)

  // A status-0 build with missing shell output almost always means the
  // prerender step crashed — i.e. the app COMPILED but threw when
  // server-rendered (2026-07-10: "Unhandled rejection: Failed to fetch /:
  // Internal Server Error"). The retry agent can only fix what it can see,
  // so surface the runtime error lines, and the log tail when the shell is
  // missing or unusable, not just the missing-file symptom. A check that
  // names its own cause (a token that does not resolve, an unpinned script)
  // gets neither: on 2026-09-20 the tail was 35 lines of
  // `how/2026-07-xx/index.html: 3 hashes` from pin-inline-scripts, sent to
  // the engineer as if it were part of the fault.
  const runtimeErrorLines = combined
    .split('\n')
    .filter((l) =>
      /unhandled rejection|internal server error|prerender.*(fail|error)|^\s*error/i.test(l)
    )
    .slice(-6)
  const errorParts = [
    'Build output smoke check failed:',
    smokeCheck.errors.map((e) => `  - ${e}`).join('\n'),
  ]
  if (runtimeErrorLines.length) {
    errorParts.push(
      '\nThe build COMPILED but the app crashed during prerender (server-side render). Runtime error lines from the build log:',
      runtimeErrorLines.join('\n'),
      '\nThis usually means SSR-unsafe code (window/document/localStorage accessed at module scope or unconditionally during render) in a route or component file — the server bundle loads EVERY route module, so one unsafe file breaks every page.'
    )
  }
  if (smokeCheck.shellProblem || runtimeErrorLines.length) {
    errorParts.push(`\n--- last 1500 chars of build output ---\n${combined.slice(-1500)}`)
  }
  return { success: false, error: errorParts.join('\n') }
}

/**
 * Run every gate of the nightly build validation and report every failure
 * together, grouped by gate, instead of stopping at the first one.
 *
 * Before #432, `validateBuild` returned at the first failing gate — pre-build
 * validation, then `pnpm build`, then the build-output smoke checks, then
 * `runStaticChecks`. Run 33756500843 met a different gate on each of four
 * retry attempts because each attempt only ever saw the first one, so no
 * single repair could fix what was actually wrong. Every gate that CAN run
 * now runs regardless of whether an earlier one failed:
 *   - pre-build validation and `pnpm build` always run.
 *   - the smoke checks run only when `pnpm build` produced output; otherwise
 *     the report notes them as skipped rather than pretending they passed.
 *   - `runStaticChecks` always runs — it needs no build output at all.
 *
 * @param {{ root?: string, shell?: object|null, date?: string, spawn?: typeof spawnSync }} [options]
 * @returns {{ success: boolean, error?: string, fixed?: string }}
 */
export function validateBuild({
  root = ROOT,
  shell = null,
  date = localDateString(new Date()),
  spawn = spawnSync,
} = {}) {
  console.log('  running pre-build validation...')
  const preCheck = validateGenerated({ root, shell })

  const buildGate = runBuildGate({ spawn, date, root })

  const smokeGate = buildGate.success
    ? runSmokeCheckGate({ root, combined: buildGate.combined, date })
    : { success: false, skipped: true }

  console.log('  running static checks...')
  const statics = runStaticChecks({ root, date, spawn })

  // One entry per gate that did not cleanly pass, in the fixed order the
  // report presents them — the order the pipeline runs them in.
  const failures = []
  if (!preCheck.success) failures.push({ name: 'Pre-build validation', body: preCheck.error })
  if (!buildGate.success) failures.push({ name: 'pnpm build', body: buildGate.error })
  if (smokeGate.skipped) {
    failures.push({ body: 'build output smoke checks: skipped, the build did not produce output' })
  } else if (!smokeGate.success) {
    failures.push({ name: 'Build output smoke checks', body: smokeGate.error })
  }
  if (!statics.success) failures.push({ body: statics.error })

  // Skips don't count as failures for the headline — only gates that
  // actually ran and did not pass do.
  const realFailures = [
    preCheck,
    buildGate,
    ...(smokeGate.skipped ? [] : [smokeGate]),
    statics,
  ].filter((g) => !g.success).length

  if (realFailures === 0) {
    console.log('  build succeeded')
    return { success: true }
  }

  const sections = failures.map((f) => (f.name ? `${f.name}:\n${f.body}` : f.body))
  const error = [`${realFailures} of 4 gates failed:`, ...sections].join('\n\n')

  console.log(`  ${realFailures} of 4 gates failed`)
  return { success: false, error, ...(statics.fixed ? { fixed: statics.fixed } : {}) }
}

/** A `path(line,col): error TSxxxx: message` line — the start of one tsc diagnostic. */
const TSC_ERROR_START = /^(\S.*\(\d+,\d+\): error TS\d+:.*)$/

/** The one summary line `--noEmit` prints when it is not run under `--pretty`. */
const TSC_SUMMARY_LINE = /^Found \d+ errors?\b/

/**
 * Parses `tsc --noEmit` output into one line per error, in the order tsc
 * emitted them, deduplicated.
 *
 * A message that runs past one line continues on a line tsc indents deeper
 * than the last, e.g.:
 *
 *   app/components/Roster.tsx(4,6): error TS2345: Argument of type '{ name: number; }[]' is not assignable to parameter of type 'RosterItem[]'.
 *     Type '{ name: number; }' is not assignable to type 'RosterItem'.
 *
 * That continuation is joined onto the error line with a single space, so
 * the retry prompt reads one error per line instead of splitting it across
 * two and losing the second half to whatever truncates next.
 *
 * A GitHub Actions problem matcher can prefix a line with `##[error]`; that
 * prefix is stripped before matching so the file path — which
 * `identifyFailingAgent` matches by substring — still lines up at the start.
 *
 * Anything that is not part of a diagnostic — the `Found N errors` summary,
 * blank lines, a pnpm banner — ends whatever error was accumulating and is
 * otherwise dropped.
 *
 * @param {string} output raw stdout+stderr from `tsc --noEmit`
 * @returns {{ errors: string[], count: number }}
 */
export function formatTscErrors(output) {
  const errors = []
  let current = null

  for (const rawLine of output.split('\n')) {
    const line = rawLine.replace(/^##\[error\]/, '').replace(/\r$/, '')
    const start = line.match(TSC_ERROR_START)
    if (start) {
      if (current !== null) errors.push(current)
      current = start[1].trim()
      continue
    }
    if (current === null) continue
    const isIndentedContinuation = /^\s+\S/.test(line) && !TSC_SUMMARY_LINE.test(line.trim())
    if (isIndentedContinuation) {
      current += ` ${line.trim()}`
    } else {
      errors.push(current)
      current = null
    }
  }
  if (current !== null) errors.push(current)

  const seen = new Set()
  const deduped = errors.filter((e) => (seen.has(e) ? false : seen.add(e)))
  return { errors: deduped, count: deduped.length }
}

/**
 * Keeps `text` up to `maxChars`, cutting the END — never the head, where the
 * first and most actionable line lives — and saying so explicitly when it
 * had to cut. Mirrors the tradeoff `capErrorList` makes for a parsed error
 * list, for output that is not parsed (biome's).
 *
 * @param {string} text
 * @param {number} maxChars
 * @returns {string}
 */
function capOutputFromEnd(text, maxChars) {
  if (text.length <= maxChars) return text
  const omittedChars = text.length - maxChars
  return `${text.slice(0, maxChars)}\n\n… (${omittedChars} more characters omitted)`
}

/**
 * Joins `errors` up to `maxChars`, keeping only whole error lines and
 * cutting the END — never the head — so the retry prompt always sees the
 * first errors tsc reported, the ones nearest whatever broke the build.
 *
 * @param {string[]} errors
 * @param {number} maxChars
 * @returns {{ text: string, omitted: number }}
 */
function capErrorList(errors, maxChars) {
  let text = ''
  let included = 0
  for (const line of errors) {
    const candidate = included === 0 ? line : `${text}\n${line}`
    if (candidate.length > maxChars) break
    text = candidate
    included++
  }
  return { text, omitted: errors.length - included }
}

/**
 * The tsc branch of `runStaticChecks`'s failure message: every parsed
 * error, capped from the end. Pulled out on its own so the "did this even
 * parse as a diagnostic" branching lives in one place instead of inline in
 * `runStaticChecks`.
 *
 * @param {string} tscOut combined stdout+stderr from a failing `tsc --noEmit`
 * @returns {string}
 */
function formatTscFailure(tscOut) {
  const { errors, count } = formatTscErrors(tscOut)
  if (count === 0) {
    // tsc exited non-zero without a line the parser recognizes as a
    // diagnostic — a crash, a tsconfig problem — so fall back to the raw
    // output rather than reporting zero errors on a failed run.
    return `Type errors (tsc --noEmit):\n${capOutputFromEnd(tscOut.trim(), 12000)}`
  }
  const { text, omitted } = capErrorList(errors, 12000)
  const omittedNote =
    omitted > 0 ? `\n\n… (${omitted} more error${omitted === 1 ? '' : 's'} omitted)` : ''
  return `Type errors (tsc --noEmit), ${count} total, every one listed:\n${text}${omittedNote}`
}

/**
 * Paths the static checks cover. The same ones the nightly's push step
 * stages, so what gets checked is exactly what would reach main. `elements/`
 * is not here because the nightly does not write it: the two generated
 * presets are the only files a run may touch, and codegen validates those on
 * write. Biome excludes exactly those two and lints the hand-written chassis
 * catalogue like any other source.
 */
export const STATIC_CHECK_PATHS = ['app/components', 'app/routes']

/**
 * Lint, format and typecheck what the agents wrote.
 *
 * The nightly validated its output by building it, and Vite transpiles with
 * esbuild: no type checking, and formatting is checked nowhere. So on
 * 2026-08-30 it pushed an unused import and eight unformatted files straight
 * to main, and every PR opened afterwards showed Lint and Typecheck red for a
 * reason that was not in the PR (#251). CI runs both tools — on pull requests,
 * which the nightly never opens.
 *
 * Shape, decided in #251: formatting is auto-fixed, because it is not a
 * design decision and the engineer should not spend a retry on it. Whatever
 * remains after that — a genuine lint error, a type error — fails the build
 * the same way a compile error does, so it reaches the React Engineer as a
 * retry with the tool output attached. All tools run even if the first
 * fails, so one retry sees everything.
 *
 * The architecture audit joined on 2026-09-02 (#413), after a 321-line route
 * component passed biome and tsc, shipped, and turned the fallow job on main
 * red the next morning. CI's gate and the nightly's are now the same command.
 *
 * Cheap: biome under a second, tsc about one, fallow about two. The run
 * budgets sixty minutes.
 *
 * The raw combined output of all three tools is also written to
 * `archive/<date>/last-static-checks.txt`, one section per tool, overwriting
 * whatever the previous call left there — `validateBuild`'s own
 * `last-build-output.txt` does the same for `pnpm build`. Without it, a
 * failing night's static-check output existed only in the process log: the
 * artifact the nightly workflow uploads on failure held zero tsc errors
 * because nothing on disk ever recorded them (#432).
 *
 * @param {{ spawn?: typeof spawnSync, root?: string, date?: string }} [deps] injectable for tests
 * @returns {{ success: boolean, error?: string, fixed?: string }}
 */
export function runStaticChecks({
  spawn = spawnSync,
  root = ROOT,
  date = localDateString(new Date()),
} = {}) {
  const opts = { cwd: root, encoding: 'utf8', timeout: STEP_BUDGETS.staticCheckMs }
  const combined = (r) => (r.stdout ?? '') + (r.stderr ?? '')
  const failures = []
  const sections = []

  console.log('  running biome check --write...')
  const biome = spawn('pnpm', ['exec', 'biome', 'check', '--write', ...STATIC_CHECK_PATHS], opts)
  const biomeOut = combined(biome)
  sections.push(`=== biome check --write ===\n${biomeOut}`)
  // Biome reports what it changed; keep that line so the log says the
  // formatting fix happened rather than leaving it to be inferred.
  const fixed = biomeOut.match(/Fixed \d+ files?/)?.[0]
  if (fixed) console.log(`  biome: ${fixed}`)
  if (biome.status !== 0) {
    failures.push(
      `Lint errors remain after auto-fix (biome):\n${capOutputFromEnd(biomeOut.trim(), 12000)}`
    )
  }

  console.log('  running tsc --noEmit...')
  const tsc = spawn('pnpm', ['exec', 'tsc', '--noEmit'], opts)
  const tscOut = combined(tsc)
  sections.push(`=== tsc --noEmit ===\n${tscOut}`)
  if (tsc.status !== 0) failures.push(formatTscFailure(tscOut))

  // The third check CI runs on main. `--base HEAD` diffs the working tree
  // against the commit the run started from, which is exactly the set of
  // files the agents wrote tonight, and the new-only gate means an inherited
  // finding in a file the engineer had to touch cannot fail the run.
  console.log('  running fallow audit --base HEAD...')
  const fallow = spawn(
    'pnpm',
    ['exec', 'fallow', 'audit', '--base', 'HEAD', '--format', 'json'],
    opts
  )
  const fallowOut = combined(fallow)
  sections.push(`=== fallow audit --base HEAD ===\n${fallowOut}`)
  const audit = summarizeFallowAudit(fallowOut)
  if (audit.error) failures.push(audit.error)
  else if (audit.warning) console.warn(`  ${audit.warning}`)

  try {
    const outputDir = resolve(root, 'archive', date)
    mkdirSync(outputDir, { recursive: true })
    writeFileSync(resolve(outputDir, 'last-static-checks.txt'), sections.join('\n\n'), 'utf8')
    console.log(`  static-check output written to archive/${date}/last-static-checks.txt`)
  } catch (writeErr) {
    console.warn(`  could not write static-check output: ${writeErr.message}`)
  }

  if (failures.length) {
    console.log('  static checks failed')
    return {
      success: false,
      ...(fixed ? { fixed } : {}),
      error: [
        'The build compiled but does not pass the checks CI runs on main.',
        'Fix every error listed below; formatting has already been corrected.',
        '',
        ...failures,
      ].join('\n'),
    }
  }

  console.log('  static checks passed')
  return { success: true, ...(fixed ? { fixed } : {}) }
}

/**
 * What the React Engineer needs to hear from a failed architecture audit,
 * and nothing else (#413).
 *
 * The audit's JSON is thousands of lines, most of it inherited findings and
 * fix menus. The engineer needs the introduced ones: which function, in which
 * file, at what size, and which unused export. Paths stay verbatim so the
 * retry routing (`identifyFailingAgent`) can read them.
 *
 * The JSON starts after whatever pnpm prints first (a lockfile banner, on
 * some machines). Output that does not parse is a tool problem, not an
 * engineer problem, so it is reported and not gated on; a wedged tool must
 * not lose the night.
 *
 * @param {string} output stdout and stderr of `fallow audit --format json`
 * @returns {{ error?: string, warning?: string }}
 */
export function summarizeFallowAudit(output) {
  const start = output.indexOf('{')
  let report
  try {
    report = JSON.parse(output.slice(start))
  } catch {
    return { warning: 'fallow audit output could not be read; skipping the architecture gate' }
  }
  if (report.verdict !== 'fail') return {}

  const lines = []
  for (const f of report.complexity?.findings ?? []) {
    if (!f.introduced) continue
    lines.push(
      `${f.path}:${f.line} ${f.name} — cyclomatic ${f.cyclomatic}, cognitive ${f.cognitive}, ` +
        `${f.line_count} lines (over the ${f.exceeded} threshold)`
    )
  }
  for (const f of report.dead_code?.unused_exports ?? []) {
    if (!f.introduced) continue
    lines.push(`${f.path}:${f.line} export ${f.export_name} — nothing imports it`)
  }
  if (lines.length === 0) {
    lines.push(`fallow reported: ${JSON.stringify(report.attribution ?? report.summary ?? {})}`)
  }

  return {
    error: [
      'Architecture audit (fallow, the check CI runs on main):',
      ...lines,
      '',
      'Split each function listed above into section components under app/components/generated/,',
      'each with at most three branch points, and let the route page only compose them.',
      'Remove any export nothing imports. See "Size and shape" in your brief.',
    ]
      .join('\n')
      .slice(0, 3000),
  }
}

/**
 * Format one generated file in place. For the files the orchestrator writes
 * from a frozen template (`__root.tsx`, `BrandLockup.tsx`) rather than an
 * agent — `runStaticChecks` only covers whatever exists on disk at the point
 * it runs, so any write after that point ships unformatted. Formatting at
 * the write site holds regardless of where a later rewrite turns out to be.
 *
 * Never throws: a formatting failure is logged and swallowed rather than
 * blocking the run, the same tradeoff `runStaticChecks` makes for lint.
 *
 * @param {string} relPath - path relative to `root`, e.g. 'app/routes/__root.tsx'
 * @param {{ spawn?: typeof spawnSync, root?: string }} [deps] injectable for tests
 * @returns {{ success: boolean, output: string }}
 */
export function formatGeneratedFile(relPath, { spawn = spawnSync, root = ROOT } = {}) {
  const result = spawn('pnpm', ['exec', 'biome', 'format', '--write', relPath], {
    cwd: root,
    encoding: 'utf8',
  })
  const output = (result.stdout ?? '') + (result.stderr ?? '')
  if (result.status !== 0) {
    console.warn(`  formatGeneratedFile: biome format failed for ${relPath} (non-blocking)`)
    return { success: false, output }
  }
  return { success: true, output }
}

/**
 * Check 1 of `validateBuildOutput`: dist/client must exist and be non-empty.
 * Returns errors, if any; a non-empty result means the caller should stop
 * (nothing under dist/client to check further).
 *
 * @param {string} distClient
 * @returns {string[]}
 */
function checkDistClientExists(distClient) {
  try {
    const entries = readdirSync(distClient)
    if (entries.length === 0) return ['dist/client/ is empty — build produced no output']
    return []
  } catch (err) {
    return [`dist/client/ does not exist: ${err.message}`]
  }
}

/**
 * Check 2 of `validateBuildOutput`: the SPA shell HTML exists and carries
 * what hydration needs — a body to mount into and a script tag to load.
 *
 * @param {string} distClient
 * @returns {string[]}
 */
function checkSpaShell(distClient) {
  const shellPath = resolve(distClient, '_shell.html')
  const indexPath = resolve(distClient, 'index.html')
  let shellHtml = ''
  try {
    shellHtml = readFileSync(existsSync(shellPath) ? shellPath : indexPath, 'utf8')
  } catch {
    return ['dist/client/_shell.html and index.html are both missing']
  }

  const errors = []
  if (shellHtml.length < 500) {
    errors.push(
      `SPA shell HTML is suspiciously small (${shellHtml.length} bytes) — likely empty or malformed`
    )
  }
  // Must load client JS for hydration
  if (!shellHtml.includes('<script') && !shellHtml.includes('modulepreload')) {
    errors.push('SPA shell has no <script> or modulepreload tags — client JS will not load')
  }
  // Must have a root/mount point
  if (!shellHtml.match(/<body[^>]*>/)) {
    errors.push('SPA shell has no <body> tag')
  }
  return errors
}

/**
 * Check 3 of `validateBuildOutput`: asset bundles exist, and the CSS bundle
 * carries meaningful content. A preset with empty globalCss + no semantic
 * tokens still emits utility CSS from component usage, but the total stays
 * under ~1KB. Healthy builds produce 5-15KB. The 2KB floor catches "preset
 * produced no CSS" without false positives on legitimately small builds.
 *
 * @param {string} distClient
 * @returns {string[]}
 */
function checkAssetBundles(distClient) {
  const assetsDir = resolve(distClient, 'assets')
  try {
    const assets = readdirSync(assetsDir)
    const hasJS = assets.some((f) => f.endsWith('.js'))
    const cssFiles = assets.filter((f) => f.endsWith('.css'))
    const errors = []
    if (!hasJS) errors.push('dist/client/assets/ has no .js bundles')
    if (cssFiles.length === 0) {
      errors.push('dist/client/assets/ has no .css bundles')
      return errors
    }
    const totalCssBytes = cssFiles.reduce((sum, f) => sum + statSync(resolve(assetsDir, f)).size, 0)
    const MIN_CSS_BYTES = 2000
    if (totalCssBytes < MIN_CSS_BYTES) {
      errors.push(
        `CSS bundles total only ${totalCssBytes} bytes (minimum ${MIN_CSS_BYTES}). ` +
          'The preset likely produced no globalCss or semanticTokens — site will render unstyled.'
      )
    }
    return errors
  } catch (err) {
    return [`dist/client/assets/ missing or unreadable: ${err.message}`]
  }
}

/**
 * Check 4 of `validateBuildOutput`: every token name in the emitted CSS
 * actually resolved.
 *
 * A build can exit 0, produce a healthy 30KB stylesheet, and still ship
 * `font-size:5xl` — Panda passes an unknown token through as a literal and
 * the browser drops the declaration. On 2026-08-30 that put the home hero at
 * 32px on mobile against an approved 64px mockup, and nothing noticed. See
 * scripts/utils/token-gate.js and #252.
 *
 * @param {string} root
 * @returns {string[]}
 */
function checkEmittedTokensResolve(root) {
  try {
    const gate = checkTokenResolution({ root, ownedFiles: MUTABLE_FILES })
    for (const w of gate.warnings) {
      const what =
        w.kind === 'numeric'
          ? `is not a ${w.category} token, so Panda shipped ${w.value}px`
          : 'does not resolve to any token'
      console.warn(
        `  ⚠ ${w.files.join(', ')}: ${w.property}: '${w.authoredValue ?? w.value}' ${what}` +
          ' (not a file the nightly agents own, so not blocking)'
      )
    }
    if (!gate.ok) return [gate.error]
    if (gate.warnings.length === 0) console.log('  every token in the emitted CSS resolved')
    return []
  } catch (err) {
    // A gate that throws must not be the reason a good build is thrown away.
    console.warn(`  token resolution gate skipped: ${err.message}`)
    return []
  }
}

/**
 * Check 5 of `validateBuildOutput`: every page `scripts/pin-inline-scripts.js`
 * is supposed to touch actually carries its pinned CSP meta.
 *
 * `pnpm build` runs the pin step as its last stage, so this only fires if
 * that step was skipped, reordered ahead of `vite build`, or removed from
 * `package.json` — the nightly's own gate noticing what CI would otherwise
 * catch a build later. `archive/<date>/` and `404.html` are excluded for the
 * same reason `pin-inline-scripts.js` excludes them: see `shouldPin`.
 *
 * @param {string} distClient
 * @returns {string[]}
 */
function checkInlineScriptsPinned(distClient) {
  let relativePaths
  try {
    relativePaths = readdirSync(distClient, { recursive: true }).filter(
      (p) => p.endsWith('.html') && shouldPin(p)
    )
  } catch (err) {
    return [`could not walk dist/client/ to check CSP pinning: ${err.message}`]
  }

  const errors = []
  for (const relativePath of relativePaths) {
    const html = readFileSync(resolve(distClient, relativePath), 'utf8')
    const meta = html.match(/<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>/i)
    if (!meta?.[0].includes('sha256-')) {
      errors.push(
        `dist/client/${relativePath} has no pinned Content-Security-Policy meta (sha256- hash missing)`
      )
    }
  }
  return errors
}

/**
 * Post-build smoke checks: verify the built output is actually usable.
 * Runs after `pnpm build` exits 0 but before we declare success.
 *
 * Catches cases where the build compiles but produces unusable output —
 * blank pages, missing asset bundles, or a SPA shell with no scripts.
 *
 * @param {{ root?: string }} [options] where the build was written; tests pass
 *   a temp tree so this reads that instead of the real repo's `dist/client`.
 * @returns {{ success: boolean, errors: string[], shellProblem: boolean }}
 *   `shellProblem` is true when the output directory is empty or missing, or
 *   the SPA shell is missing or unusable: the failures a crashed prerender
 *   leaves behind, where the build log is the only clue to the cause.
 */
export function validateBuildOutput({ root = ROOT } = {}) {
  const distClient = resolve(root, 'dist/client')

  const distErrors = checkDistClientExists(distClient)
  if (distErrors.length > 0) return { success: false, errors: distErrors, shellProblem: true }

  const shellErrors = checkSpaShell(distClient)
  const errors = [
    ...shellErrors,
    ...checkAssetBundles(distClient),
    ...checkEmittedTokensResolve(root),
    ...checkInlineScriptsPinned(distClient),
  ]

  return { success: errors.length === 0, errors, shellProblem: shellErrors.length > 0 }
}
