import { describe, beforeEach, it, expect } from 'vitest'
import {
  ENGINEER_COMPONENT_FILES,
  ROOT,
  backup,
  cleanupOrphans,
  restore,
  writeFiles,
  validateWritePath,
  isWritablePath,
} from '../../scripts/utils/file-manager.js'
import { ENGINEER_FILES } from '../../scripts/utils/site-context.js'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { tempDir, tempRepoRoot, writeUnder } from '../helpers/tmp.js'

describe('validateWritePath', () => {
  describe('allowlist — permits legitimate writes', () => {
    it('allows app/components/generated/ paths', () => {
      expect(validateWritePath('app/components/generated/Foo.tsx')).toBe(
        'app/components/generated/Foo.tsx'
      )
      expect(validateWritePath('app/components/generated/sections/Hero.tsx')).toBe(
        'app/components/generated/sections/Hero.tsx'
      )
    })

    it('allows the two shell components the engineer must write, by exact path', () => {
      expect(validateWritePath('app/components/Layout.tsx')).toBe('app/components/Layout.tsx')
      expect(validateWritePath('app/components/Sidebar.tsx')).toBe('app/components/Sidebar.tsx')
      expect(ENGINEER_COMPONENT_FILES).toEqual([
        'app/components/Layout.tsx',
        'app/components/Sidebar.tsx',
      ])
    })

    it('every engineer-owned file on MUTABLE_FILES is writable', () => {
      // file-manager.js cannot import site-context.js (site-context imports
      // ROOT from here), so ENGINEER_COMPONENT_FILES is a hand-kept list.
      // This is what stops it drifting from the mutable list (#448).
      for (const f of ENGINEER_FILES) {
        expect(validateWritePath(f), f).toBe(f)
      }
    })

    it('rejects any other path under app/components/ (#448)', () => {
      // The hand-written components: /elements renders these three, one run
      // overwrote FeaturedProject.tsx, and nothing the engineer writes may
      // reach them again.
      for (const f of [
        'app/components/FeaturedProject.tsx',
        'app/components/SectionHead.tsx',
        'app/components/ProjectRow.tsx',
        'app/components/MobileFooter.tsx',
        'app/components/ArchiveMarkdown.tsx',
        'app/components/RunStages.tsx',
        'app/components/panel/api.ts',
        'app/components/Foo.tsx',
        'app/components/BrandLockup.tsx',
        'app/components/Material.tsx',
        'app/components/WhitePaper.tsx',
      ]) {
        expect(() => validateWritePath(f), f).toThrow(/allowlist/)
      }
      // A traversal out of generated/ back into components/ is still a
      // components/ write once normalized.
      expect(() => validateWritePath('app/components/generated/../SectionHead.tsx')).toThrow(
        /allowlist/
      )
    })

    it('allows app/routes/ paths', () => {
      expect(validateWritePath('app/routes/index.tsx')).toBe('app/routes/index.tsx')
    })

    it('allows elements/preset.ts', () => {
      expect(validateWritePath('elements/preset.ts')).toBe('elements/preset.ts')
    })

    it('allows elements/chassis-preset.ts', () => {
      expect(validateWritePath('elements/chassis-preset.ts')).toBe('elements/chassis-preset.ts')
    })

    it('rejects executable pipeline code under elements/', () => {
      // design-agents.js imports these at startup — writable would mean
      // persistent code execution on the next nightly run
      expect(() => validateWritePath('elements/chassis/index.js')).toThrow(/allowlist/)
      expect(() => validateWritePath('elements/chassis/evil.js')).toThrow(/allowlist/)
      expect(() => validateWritePath('elements/index.ts')).toThrow(/allowlist/)
      expect(() => validateWritePath('elements/theme/tokens.ts')).toThrow(/allowlist/)
    })

    it('allows app/stubs/ paths', () => {
      expect(validateWritePath('app/stubs/foo.ts')).toBe('app/stubs/foo.ts')
    })

    it('normalizes ./ prefix', () => {
      expect(validateWritePath('./app/components/generated/Foo.tsx')).toBe(
        'app/components/generated/Foo.tsx'
      )
    })

    it('normalizes duplicate slashes', () => {
      expect(validateWritePath('app//components//generated//Foo.tsx')).toBe(
        'app/components/generated/Foo.tsx'
      )
    })
  })

  describe('path traversal — rejects escapes', () => {
    it('rejects ../ traversal', () => {
      expect(() => validateWritePath('../evil.txt')).toThrow(/traversal|not in write allowlist/)
    })

    it('rejects nested ../ escape', () => {
      expect(() => validateWritePath('app/components/../../../../etc/passwd')).toThrow(
        /traversal|allowlist/
      )
    })

    it('rejects absolute paths', () => {
      expect(() => validateWritePath('/etc/passwd')).toThrow()
    })

    it('rejects lateral escape into protected dir via ..', () => {
      // app/components/../content/projects.ts normalizes to app/content/projects.ts
      expect(() => validateWritePath('app/components/../content/projects.ts')).toThrow(/Forbidden/)
    })
  })

  describe('forbidden paths — rejects sensitive locations', () => {
    it('rejects .env', () => {
      expect(() => validateWritePath('.env')).toThrow(/Dotfile/)
    })

    it('rejects .github/ workflows', () => {
      expect(() => validateWritePath('.github/workflows/evil.yml')).toThrow(/Dotfile/)
    })

    it('rejects .npmrc', () => {
      expect(() => validateWritePath('.npmrc')).toThrow(/Dotfile/)
    })

    it('rejects .gitignore', () => {
      expect(() => validateWritePath('.gitignore')).toThrow(/Dotfile/)
    })

    it('rejects package.json', () => {
      expect(() => validateWritePath('package.json')).toThrow(/not in write allowlist/)
    })

    it('rejects pnpm-lock.yaml', () => {
      expect(() => validateWritePath('pnpm-lock.yaml')).toThrow(/not in write allowlist/)
    })

    it('rejects vite.config.ts', () => {
      expect(() => validateWritePath('vite.config.ts')).toThrow(/not in write allowlist/)
    })

    it('rejects vercel.json', () => {
      expect(() => validateWritePath('vercel.json')).toThrow(/not in write allowlist/)
    })

    it('rejects scripts/ directory', () => {
      expect(() => validateWritePath('scripts/daily-redesign.js')).toThrow(/not in write allowlist/)
    })

    it('rejects app/content/ files', () => {
      expect(() => validateWritePath('app/content/projects.ts')).toThrow(/Forbidden/)
    })

    it('rejects app/server/ files', () => {
      expect(() => validateWritePath('app/server/signals.ts')).toThrow(/Forbidden/)
    })

    it('rejects app/styles/ files', () => {
      expect(() => validateWritePath('app/styles/panda.css')).toThrow(/Forbidden/)
    })

    it('rejects app/routeTree.gen.ts', () => {
      expect(() => validateWritePath('app/routeTree.gen.ts')).toThrow(/Forbidden/)
    })

    it('rejects node_modules', () => {
      expect(() => validateWritePath('node_modules/react/index.js')).toThrow(
        /not in write allowlist/
      )
    })
  })

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      expect(() => validateWritePath('')).toThrow(/Invalid/)
    })

    it('rejects null', () => {
      expect(() => validateWritePath(null)).toThrow(/Invalid/)
    })

    it('rejects undefined', () => {
      expect(() => validateWritePath(undefined)).toThrow(/Invalid/)
    })

    it('rejects non-string input', () => {
      expect(() => validateWritePath(42)).toThrow(/Invalid/)
    })
  })
})

describe('file-manager writeFiles', () => {
  // A temp root. This wrote into the repo's real app/components/ while
  // build-validator-scanner.test.js was doing the same thing in a parallel
  // worker, and both were scanned by whatever ran validateGenerated.
  const testFile = 'app/components/generated/__test_write.tsx'
  let ROOT
  let testAbsPath

  beforeEach(async () => {
    ROOT = await tempDir('dm-writefiles-')
    testAbsPath = path.join(ROOT, testFile)
  })

  it('writes allowed files and returns normalized paths', async () => {
    const written = await writeFiles([{ path: testFile, content: 'hello' }], { root: ROOT })
    expect(existsSync(testAbsPath)).toBe(true)
    expect(readFileSync(testAbsPath, 'utf8')).toBe('hello')
    expect(written).toEqual([testFile])
  })

  it('normalizes paths on write', async () => {
    const written = await writeFiles(
      [{ path: './app/components/generated/__test_write.tsx', content: 'x' }],
      {
        root: ROOT,
      }
    )
    expect(written).toEqual(['app/components/generated/__test_write.tsx'])
  })

  it('throws on disallowed paths', async () => {
    await expect(writeFiles([{ path: 'package.json', content: '{}' }])).rejects.toThrow()
  })

  it('throws on traversal attempts', async () => {
    await expect(writeFiles([{ path: '../../../etc/passwd', content: 'bad' }])).rejects.toThrow()
  })

  it('throws on .env writes', async () => {
    await expect(writeFiles([{ path: '.env', content: 'STOLEN=1' }])).rejects.toThrow(/Dotfile/)
  })
})

describe('backup, restore and cleanupOrphans take a root', () => {
  // #221: the swarm runs against a temp root in tests. These three used the
  // module constant, so a test that exercised a rollback would have written
  // into the real checkout while the paths it was asked about sat in the
  // temp root.
  const existing = 'app/components/generated/__root_opt_existing.tsx'
  const missing = 'app/components/generated/__root_opt_missing.tsx'
  const orphan = 'app/components/generated/__root_opt_orphan.tsx'
  let root

  beforeEach(async () => {
    root = await tempRepoRoot('dm-root-opt-')
    writeUnder(root, existing, 'before')
  })

  it('backup reads under the given root and records what is absent there', async () => {
    const map = await backup([existing, missing], { root })
    expect(map.get(existing)).toBe('before')
    expect(map.get(missing)).toBeNull()
    expect(existsSync(path.join(ROOT, existing))).toBe(false)
  })

  it('restore rewrites and deletes under the given root only', async () => {
    const map = await backup([existing, missing], { root })
    writeUnder(root, existing, 'after')
    writeUnder(root, missing, 'invented')

    await restore(map, { root })

    expect(readFileSync(path.join(root, existing), 'utf8')).toBe('before')
    expect(existsSync(path.join(root, missing))).toBe(false)
    expect(existsSync(path.join(ROOT, existing))).toBe(false)
    expect(existsSync(path.join(ROOT, missing))).toBe(false)
  })

  it('cleanupOrphans deletes unbacked paths under the given root only', async () => {
    const map = await backup([existing], { root })
    writeUnder(root, orphan, 'stray')

    await cleanupOrphans(new Set([existing, orphan]), map, { root })

    expect(existsSync(path.join(root, orphan))).toBe(false)
    expect(readFileSync(path.join(root, existing), 'utf8')).toBe('before')
    expect(existsSync(path.join(ROOT, orphan))).toBe(false)
  })
})

/**
 * `isWritablePath` must agree with `validateWritePath` on every path, because
 * the whole point of it is that a caller can ask before writing. The two are
 * the same function underneath; this is the test that keeps them that way if
 * anyone is ever tempted to restate the rules for speed.
 */
describe('isWritablePath', () => {
  const paths = [
    'app/components/generated/Hero.tsx',
    'app/routes/index.tsx',
    'app/stubs/thing.ts',
    'app/components/Layout.tsx',
    'app/components/Sidebar.tsx',
    'elements/preset.ts',
    'elements/chassis-preset.ts',
    'app/components/MobileFooter.tsx',
    'app/routeTree.gen.ts',
    'package.json',
    '.github/workflows/ci.yml',
    '../escape.tsx',
    '/absolute.tsx',
    'app/components/../../etc/passwd',
  ]

  it.each(paths)('answers for %s exactly as validateWritePath decides', (p) => {
    let accepted = true
    try {
      validateWritePath(p)
    } catch {
      accepted = false
    }
    expect(isWritablePath(p)).toBe(accepted)
  })

  it('returns false rather than throwing on junk input', () => {
    for (const bad of [undefined, null, '', 0, {}]) {
      expect(isWritablePath(bad)).toBe(false)
    }
  })
})
