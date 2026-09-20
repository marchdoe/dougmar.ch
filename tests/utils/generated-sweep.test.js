/**
 * The sweep of app/components/generated/ (#448): after every engineer write,
 * a generated file nothing imports is deleted, recorded into the run's backup
 * first so the rollback restores it. Run against a temp root shaped like the
 * checkout.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { tempRepoRoot, writeUnder } from '../helpers/tmp.js'
import {
  GENERATED_DIR,
  collectImports,
  sweepGenerated,
} from '../../scripts/utils/generated-sweep.js'

const gen = (name) => `${GENERATED_DIR}/${name}`
const COMPONENT = (name) => `export function ${name}() {\n  return null\n}\n`

describe('collectImports', () => {
  it('reads static and dynamic relative imports in either quote style', () => {
    const src = [
      "import { Nav } from '../components/generated/Nav'",
      'import type { Props } from "./generated/Hero.tsx"',
      "const Lazy = lazy(() => import('../components/generated/Lazy'))",
      "import { css } from '../../styled-system/css'",
      "import { createFileRoute } from '@tanstack/react-router'",
      "import React from 'react'",
    ].join('\n')
    expect(collectImports(src)).toEqual([
      '../components/generated/Nav',
      './generated/Hero.tsx',
      '../components/generated/Lazy',
      '../../styled-system/css',
    ])
  })
})

describe('sweepGenerated', () => {
  let root
  beforeEach(async () => {
    root = await tempRepoRoot('dm-sweep-')
  })

  it('removes what nothing imports and keeps what a route or a component imports', async () => {
    writeUnder(root, gen('Nav.tsx'), COMPONENT('Nav'))
    writeUnder(root, gen('Hero.tsx'), COMPONENT('Hero'))
    writeUnder(root, gen('Colophon.tsx'), COMPONENT('Colophon'))
    writeUnder(root, gen('Yesterday.tsx'), COMPONENT('Yesterday'))
    writeUnder(root, 'app/routes/index.tsx', "import { Nav } from '../components/generated/Nav'\n")
    // With the extension, and from a nested route directory.
    writeUnder(
      root,
      'app/routes/work/index.tsx',
      "import { Hero } from '../../components/generated/Hero.tsx'\n"
    )
    writeUnder(
      root,
      'app/components/Layout.tsx',
      "import { Colophon } from './generated/Colophon'\n"
    )

    const result = await sweepGenerated({ root })

    expect(result).toEqual({
      kept: [gen('Colophon.tsx'), gen('Hero.tsx'), gen('Nav.tsx')],
      removed: [gen('Yesterday.tsx')],
    })
    expect(existsSync(path.join(root, gen('Yesterday.tsx')))).toBe(false)
    for (const rel of result.kept) {
      expect(existsSync(path.join(root, rel)), rel).toBe(true)
    }
  })

  it('a dynamic import keeps a file too', async () => {
    writeUnder(root, gen('Lazy.tsx'), COMPONENT('Lazy'))
    writeUnder(
      root,
      'app/routes/how.$date.tsx',
      "const Lazy = lazy(() => import('../components/generated/Lazy').then((m) => m.Lazy))\n"
    )
    expect(await sweepGenerated({ root })).toEqual({ kept: [gen('Lazy.tsx')], removed: [] })
  })

  it('a generated file imported only by another generated file follows it', async () => {
    writeUnder(root, gen('Nav.tsx'), `import { NavItem } from './NavItem'\n${COMPONENT('Nav')}`)
    writeUnder(root, gen('NavItem.tsx'), COMPONENT('NavItem'))
    writeUnder(
      root,
      gen('Orphan.tsx'),
      `import { OrphanChild } from './OrphanChild'\n${COMPONENT('Orphan')}`
    )
    writeUnder(root, gen('OrphanChild.tsx'), COMPONENT('OrphanChild'))
    writeUnder(root, 'app/routes/index.tsx', "import { Nav } from '../components/generated/Nav'\n")

    expect(await sweepGenerated({ root })).toEqual({
      kept: [gen('Nav.tsx'), gen('NavItem.tsx')],
      removed: [gen('Orphan.tsx'), gen('OrphanChild.tsx')],
    })
  })

  it('a file that imports itself is not kept by its own import', async () => {
    writeUnder(root, gen('Loop.tsx'), `import { Loop } from './Loop'\n${COMPONENT('Loop')}`)
    expect(await sweepGenerated({ root })).toEqual({ kept: [], removed: [gen('Loop.tsx')] })
  })

  it('records each removed file into the backup and leaves entries it already has alone', async () => {
    writeUnder(root, gen('Yesterday.tsx'), COMPONENT('Yesterday'))
    writeUnder(root, gen('Written.tsx'), COMPONENT('Written'))
    // Written.tsx was created this run: writeFiles recorded it as null, and
    // the rollback must still delete it rather than put today's content back.
    const backup = new Map([[gen('Written.tsx'), null]])

    const result = await sweepGenerated({ root, backup })

    expect(result.removed).toEqual([gen('Written.tsx'), gen('Yesterday.tsx')])
    expect(backup.get(gen('Yesterday.tsx'))).toBe(COMPONENT('Yesterday'))
    expect(backup.get(gen('Written.tsx'))).toBeNull()
    expect(existsSync(path.join(root, gen('Written.tsx')))).toBe(false)
    expect(existsSync(path.join(root, gen('Yesterday.tsx')))).toBe(false)
  })

  it('records into every map it is given, each keeping the entries it already has', async () => {
    writeUnder(root, gen('Yesterday.tsx'), COMPONENT('Yesterday'))
    writeUnder(root, gen('Written.tsx'), COMPONENT('Written'))
    const original = new Map()
    const passing = new Map([[gen('Written.tsx'), 'the passing content']])

    await sweepGenerated({ root, backup: [original, passing] })

    expect(original.get(gen('Yesterday.tsx'))).toBe(COMPONENT('Yesterday'))
    expect(passing.get(gen('Yesterday.tsx'))).toBe(COMPONENT('Yesterday'))
    expect(original.get(gen('Written.tsx'))).toBe(COMPONENT('Written'))
    expect(passing.get(gen('Written.tsx'))).toBe('the passing content')
  })

  it('never touches a file outside the directory', async () => {
    writeUnder(root, 'app/components/MobileFooter.tsx', COMPONENT('MobileFooter'))
    writeUnder(root, 'app/components/panel/api.ts', 'export const api = 1\n')
    writeUnder(root, gen('Yesterday.tsx'), COMPONENT('Yesterday'))

    const result = await sweepGenerated({ root })

    expect(result).toEqual({ kept: [], removed: [gen('Yesterday.tsx')] })
    expect(readFileSync(path.join(root, 'app/components/MobileFooter.tsx'), 'utf8')).toBe(
      COMPONENT('MobileFooter')
    )
    expect(existsSync(path.join(root, 'app/components/panel/api.ts'))).toBe(true)
  })

  it('does nothing when the directory is missing or empty', async () => {
    expect(await sweepGenerated({ root })).toEqual({ kept: [], removed: [] })
    writeUnder(root, `${GENERATED_DIR}/.keep`, '')
    expect(await sweepGenerated({ root })).toEqual({ kept: [], removed: [] })
  })
})
