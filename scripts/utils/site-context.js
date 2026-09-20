import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import * as yaml from 'js-yaml'
import { ROOT } from './file-manager.js'

/**
 * All files Claude is allowed to read and rewrite.
 * These are also the files that get backed up before each attempt.
 */
export const MUTABLE_FILES = [
  'elements/preset.ts',
  'app/components/BrandLockup.tsx',
  'app/components/Material.tsx',
  'app/components/SiteCallout.tsx',
  'app/components/Layout.tsx',
  'app/components/Sidebar.tsx',
  // SelectedWork, Experiments, Bio, Timeline, Capabilities and Personal used
  // to sit here. No route had imported one since 2026-03-20 and no run has
  // rewritten one since, so every night they were backed up, token-gated and
  // handed to the engineer as files it owned, for a page that never rendered
  // them (#216). SectionHead, ProjectRow and FeaturedProject followed on
  // 2026-09-03 (#448): hand-written, rendered only by /elements, and one run
  // had overwritten FeaturedProject. The engineer's write surface is now
  // Layout, Sidebar, the routes and app/components/generated/ (see
  // file-manager.js), so a file off this list is a file it cannot touch.
  'app/routes/__root.tsx',
  'app/routes/index.tsx',
  'app/routes/about.tsx',
  'app/routes/work.$slug.tsx',
  'app/routes/og.tsx',
  'elements/chassis-preset.ts',
]

/**
 * Files owned by the orchestrator (generated deterministically from the
 * Director-chosen chassis, never authored by an agent). Listed in
 * MUTABLE_FILES so backup/restore covers them, but never handed to an agent
 * to author.
 */
export const ORCHESTRATOR_FILES = [
  'app/routes/__root.tsx',
  'elements/chassis-preset.ts',
  // The brand lockup (#254). Listed here so dropOrchestratorFiles discards it
  // if an agent emits one, and in MUTABLE_FILES above so backup/restore covers
  // it on a rollback.
  'app/components/BrandLockup.tsx',
  // The material library (#505), on the same terms as the lockup.
  'app/components/Material.tsx',
  // The home page callout (#532). The one element allowed to say what the
  // site does, so no agent may write it. See scripts/utils/site-callout.js.
  'app/components/SiteCallout.tsx',
]

/**
 * Files the React Engineer writes: everything mutable that is neither the
 * Art Director's preset nor the orchestrator's. The Token Designer, Layout
 * Architect, Sidebar Designer and Footer Designer this file used to keep
 * separate lists for were retired with the mockup pipeline; their lists
 * survived as exports nothing but a test read (#221).
 */
export const ENGINEER_FILES = MUTABLE_FILES.filter(
  (f) => f !== 'elements/preset.ts' && !ORCHESTRATOR_FILES.includes(f)
)

/**
 * Build a human-readable summary of projects content.
 * We only include title, type, year — not full descriptions.
 * This is intentional: Claude needs to know what projects exist to preserve
 * import usage, but doesn't need (and shouldn't alter) the actual content.
 */
async function buildContentSummary() {
  const lines = []

  // Read projects.ts and extract key fields via regex (safe for this known format)
  const projectsPath = path.join(ROOT, 'app/content/projects.ts')
  if (existsSync(projectsPath)) {
    const src = await readFile(projectsPath, 'utf8')
    lines.push('## Projects (from app/content/projects.ts)')
    lines.push('')

    // Extract slug, title, type, year blocks
    const projectMatches = src.matchAll(
      /slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?type:\s*'([^']+)'[\s\S]*?year:\s*(\d+)/g
    )
    for (const m of projectMatches) {
      lines.push(`- ${m[2]} (${m[3]}, ${m[4]}, slug: ${m[1]})`)
    }

    // Note exported arrays
    if (src.includes('featuredProject')) {
      lines.push('')
      lines.push('Exports: `projects`, `featuredProject`, `selectedWork`, `experiments`')
      lines.push(
        "The `Project` and `Client` types live in `app/content/types.ts` and are re-exported from `projects.ts` — import them with `import type { Project } from '../content/projects'` or `'../content/types'`."
      )
    }
  }

  lines.push('')
  lines.push('## Timeline (from app/content/timeline.ts)')
  lines.push(
    'Exports: `timeline` (array of career entries), `capabilities` (array of skill strings)'
  )
  lines.push(
    'Render both on the About page. There is no standing component for either — compose them wherever the layout wants them.'
  )

  return lines.join('\n')
}

/**
 * Read all mutable files from disk.
 * Returns array of { path, content } — content is the file's current source.
 * Files that don't exist yet are skipped (they don't need to be in the context).
 */
async function readCurrentFiles() {
  const files = []
  for (const relPath of MUTABLE_FILES) {
    const absPath = path.join(ROOT, relPath)
    if (existsSync(absPath)) {
      const content = await readFile(absPath, 'utf8')
      files.push({ path: relPath, content })
    }
  }
  return files
}

/**
 * Read and return all context Claude needs to produce a redesign.
 * @returns {Promise<{ signals: object, contentSummary: string, currentFiles: Array<{path: string, content: string}> }>}
 */
export async function readContext() {
  // Parse signals YAML
  const signalsPath = path.join(ROOT, 'signals/today.yml')
  const signalsRaw = await readFile(signalsPath, 'utf8')
  const signals = yaml.load(signalsRaw)

  // js-yaml parses bare YAML dates as Date objects — normalize to string
  if (signals.date instanceof Date) {
    signals.date = signals.date.toISOString().slice(0, 10)
  }

  const contentSummary = await buildContentSummary()
  const currentFiles = await readCurrentFiles()

  return { signals, contentSummary, currentFiles }
}
