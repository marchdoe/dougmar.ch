import { mkdir, writeFile, readFile, copyFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { ROOT } from './file-manager.js'
import { captureSnapshot } from './snapshot.js'
import { summarizeLedger } from './cost-ledger.js'
import { anomaliesOf, buildRecord } from './archive-record.js'
import { computeUniqueness } from './uniqueness-index.js'
import { readUniquenessHistory } from './read-uniqueness-history.js'
import { DESIGN_FIDELITY_METHOD } from './design-fidelity.js'

/**
 * Where the day's screenshot is published, relative to the repo root.
 *
 * Exported because it is a cross-boundary contract, not a local detail: the
 * nightly workflow embeds this path in every rating issue, and when #154 moved
 * the directory the workflow's copy of it was not moved too, so the rating
 * issues rendered a broken image for months. The workflow cannot import JS, so
 * a test asserts the two agree — see tests/scripts/nightly-commits-its-output.
 */
export const PUBLIC_SCREENSHOT_DIR = 'public/archive-data'

/**
 * Copy key archive artifacts to public/ for static serving.
 * - Site HTML  → public/archive/{date}/index.html, about.html, work/*.html
 * - Screenshot → public/archive-data/{date}.png
 * - Viewports  → public/archive-data/{date}/viewports/*.png
 *
 * Only the site HTML goes under `public/archive/`, which means one thing (#154):
 * the bytes that shipped that day. Everything this project generates *about* a
 * day lives in `public/archive-data/` beside its record.
 */
async function copyToPublic(dateStr, buildDir, root = ROOT) {
  const publicBase = path.join(root, 'public', 'archive')
  const publicData = path.join(root, ...PUBLIC_SCREENSHOT_DIR.split('/'))

  // Copy screenshot if it exists
  const screenshotSrc = path.join(buildDir, 'screenshot.png')
  if (existsSync(screenshotSrc)) {
    await mkdir(publicData, { recursive: true })
    await copyFile(screenshotSrc, path.join(publicData, `${dateStr}.png`))
    console.log(`  copied screenshot to public/archive-data/${dateStr}.png`)
  }

  // Copy site HTML if it exists
  const siteSrc = path.join(buildDir, 'site')
  if (existsSync(siteSrc)) {
    const publicSiteDir = path.join(publicBase, dateStr)
    await mkdir(path.join(publicSiteDir, 'work'), { recursive: true })
    const entries = await readdir(siteSrc, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        await copyFile(path.join(siteSrc, entry.name), path.join(publicSiteDir, entry.name))
      } else if (entry.isDirectory() && entry.name === 'work') {
        const workEntries = await readdir(path.join(siteSrc, 'work'))
        for (const w of workEntries) {
          if (w.endsWith('.html')) {
            await copyFile(path.join(siteSrc, 'work', w), path.join(publicSiteDir, 'work', w))
          }
        }
      }
    }
    console.log(`  copied site HTML to public/archive/${dateStr}/`)
  }

  // Copy viewport screenshots (if the build produced them)
  const vpSrc = path.join(buildDir, 'viewports')
  if (existsSync(vpSrc)) {
    const vpDest = path.join(publicData, dateStr, 'viewports')
    await mkdir(vpDest, { recursive: true })
    const vpEntries = await readdir(vpSrc)
    for (const f of vpEntries) {
      if (f.endsWith('.png')) {
        await copyFile(path.join(vpSrc, f), path.join(vpDest, f))
      }
    }
    console.log(`  copied viewport screenshots to public/archive-data/${dateStr}/viewports/`)
  }
}

/**
 * Format a signals object as readable markdown sections.
 * @param {object} signals
 * @returns {string}
 */
function formatSignalsMarkdown(signals) {
  const lines = []

  if (signals.weather) {
    lines.push('### Weather')
    lines.push(`**Location:** ${signals.weather.location}`)
    lines.push(`**Conditions:** ${signals.weather.conditions}`)
    lines.push(`**Feel:** ${signals.weather.feel}`)
    lines.push('')
  }

  if (signals.sports && signals.sports.length > 0) {
    lines.push('### Sports')
    for (const s of signals.sports) {
      lines.push(`- **${s.team}:** ${s.result}${s.notes ? ` — ${s.notes}` : ''}`)
    }
    lines.push('')
  }

  if (signals.golf && signals.golf.length > 0) {
    lines.push('### Golf')
    for (const g of signals.golf) {
      lines.push(`- ${g}`)
    }
    lines.push('')
  }

  if (signals.github_trending && signals.github_trending.length > 0) {
    lines.push('### GitHub Trending')
    for (const repo of signals.github_trending) {
      lines.push(`- **${repo.repo}** — ${repo.description}`)
      if (repo.why_interesting) {
        lines.push(`  *${repo.why_interesting}*`)
      }
    }
    lines.push('')
  }

  if (signals.news && signals.news.length > 0) {
    lines.push('### News')
    for (const n of signals.news) {
      lines.push(`- ${n}`)
    }
    lines.push('')
  }

  if (signals.mood_override) {
    lines.push(`### Mood Override`)
    lines.push(`\`${signals.mood_override}\``)
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Write named artifacts (Buffer or string) into a build directory.
 * Null/undefined values are skipped; individual write failures warn
 * and continue — artifacts are never worth failing a run over.
 * @param {string} buildDir
 * @param {Record<string, Buffer|string|null|undefined>} artifacts
 */
export async function writeArtifacts(buildDir, artifacts = {}) {
  for (const [name, value] of Object.entries(artifacts)) {
    if (value === null || value === undefined) continue
    if (name !== path.basename(name)) {
      console.warn(`  artifact name rejected (must be a plain filename): ${name}`)
      continue
    }
    try {
      await writeFile(path.join(buildDir, name), value)
    } catch (err) {
      console.warn(`  artifact write failed (non-blocking): ${name}: ${err.message}`)
    }
  }
}

/**
 * Write an archive entry for the day's redesign.
 *
 * Creates `archive/YYYY-MM-DD/brief.md` with:
 * - Design brief (one-liner)
 * - Signals (formatted)
 * - Claude's rationale
 * - List of changed files
 *
 * @param {string} date - e.g. "2026-03-12"
 * @param {object} signals - parsed YAML signals
 * @param {string} rationale - Claude's rationale text
 * @param {string} designBrief - one-sentence design brief
 * @param {string[]} changedFiles - list of relative file paths that were written
 * @param {object} [weights={}] - optional weighting overrides (signals, inspiration, ratings, risk)
 * @param {object|null} [colorScheme=null] - optional color scheme object emitted by the designer; written as color-scheme.json in the build dir
 * @param {string|null} [archetype=null] - the chosen archetype for this build (e.g. 'Specimen')
 * @param {Record<string, Buffer|string|null|undefined>} [artifacts={}] - named artifacts to persist in the build dir (e.g. screenshot.png, verdicts.json)
 */
export async function archive(
  date,
  signals,
  rationale,
  designBrief,
  changedFiles,
  weights = {},
  colorScheme = null,
  archetype = null,
  artifacts = {},
  // Where to write. Defaults to the repo, which is what the pipeline wants;
  // tests pass a temp dir so `pnpm test` stops creating archive/2099-01-01/
  // and public/archive/2099-01-01/ inside the working tree, and stops leaking
  // them when an assertion throws before the cleanup hook records the path.
  { root = ROOT } = {}
) {
  const dateStr = date instanceof Date ? date.toISOString().slice(0, 10) : String(date)
  const buildId = String(Date.now())
  const dir = path.join(root, 'archive', dateStr)
  const buildDir = path.join(dir, `build-${buildId}`)
  await mkdir(buildDir, { recursive: true })

  const content = [
    `# ${dateStr}`,
    '',
    `**Design Brief:** ${designBrief}`,
    '',
    '## Signals',
    '',
    formatSignalsMarkdown(signals),
    "## Claude's Rationale",
    '',
    rationale,
    '',
    '## Files Changed',
    '',
    changedFiles.map((f) => `- ${f}`).join('\n'),
    '',
  ].join('\n')

  // Save brief to the build-specific directory
  const briefPath = path.join(buildDir, 'brief.md')
  await writeFile(briefPath, content, 'utf8')

  // Save build metadata (weights, timestamp, brief) for the archive UI
  const buildMeta = {
    buildId,
    date: dateStr,
    timestamp: parseInt(buildId, 10),
    brief: designBrief,
    weights: {
      signals: weights.signals ?? 5,
      inspiration: weights.inspiration ?? 5,
      ratings: weights.ratings ?? 5,
      risk: weights.risk ?? 5,
    },
  }
  await writeFile(path.join(buildDir, 'build.json'), JSON.stringify(buildMeta, null, 2), 'utf8')
  console.log(`  archived to archive/${dateStr}/build-${buildId}/`)

  // What the run cost, per agent. Non-blocking: telemetry never fails a build.
  try {
    const cost = summarizeLedger()
    await writeFile(path.join(buildDir, 'cost.json'), JSON.stringify(cost, null, 2), 'utf8')
    const shown = cost.total_usd === null ? 'unpriced' : `$${cost.total_usd.toFixed(4)}`
    console.log(
      `  run cost: ${shown} across ${cost.calls} call(s)${cost.retries ? `, ${cost.retries} retr${cost.retries === 1 ? 'y' : 'ies'}` : ''}${cost.estimated ? ' (partly estimated)' : ''}`
    )
  } catch (err) {
    console.warn(`  warning: could not write cost.json: ${err.message}`)
  }

  // Save the interpreted signals brief if it exists
  const signalsBriefSrc = path.join(root, 'signals', 'today.brief.md')
  if (existsSync(signalsBriefSrc)) {
    try {
      const signalsBrief = await readFile(signalsBriefSrc, 'utf8')
      await writeFile(path.join(buildDir, 'signals-brief.md'), signalsBrief, 'utf8')
    } catch {
      /* signals brief read failed — non-blocking */
    }
  }

  // Save the design tokens preset
  const presetSrc = path.join(root, 'elements', 'preset.ts')
  if (existsSync(presetSrc)) {
    try {
      const preset = await readFile(presetSrc, 'utf8')
      await writeFile(path.join(buildDir, 'preset.ts'), preset, 'utf8')
    } catch {
      /* preset read failed — non-blocking */
    }
  }

  // Save the color scheme JSON artifact, if provided
  if (colorScheme && !colorScheme.__parse_error) {
    try {
      await writeFile(
        path.join(buildDir, 'color-scheme.json'),
        JSON.stringify(colorScheme, null, 2),
        'utf8'
      )
    } catch (err) {
      console.warn(`  warning: could not write color-scheme.json: ${err.message}`)
    }
  }

  // Also save/overwrite the top-level brief.md as the "latest" for backwards compatibility
  // (the Design Director reads archive/{date}/brief.md)
  const latestBriefPath = path.join(dir, 'brief.md')
  await writeFile(latestBriefPath, content, 'utf8')

  // Capture static HTML snapshot into the build directory (non-blocking)
  try {
    await captureSnapshot(dateStr, buildId, { root })
  } catch (err) {
    console.warn(`  snapshot failed (non-blocking): ${err.message}`)
  }

  // Write caller-supplied artifacts (screenshot.png, verdicts.json, etc.) into
  // the build dir BEFORE copyToPublic so screenshot.png is available for
  // public/archive/{date}.png copy.
  await writeArtifacts(buildDir, artifacts)

  // Responsive measurement — soft-fail, non-blocking.
  //
  // This used to probe 127.0.0.1:5173 with a raw socket and skip the whole
  // measurement when nothing answered — which was always, since the nightly
  // serves the built site on a different port and nothing runs a dev server
  // in CI at all. That made responsive-metrics.json empty for every build
  // this project has ever produced (#280). The measurement wants a URL, not
  // a port: `withPreviewServer` builds one by starting `vite preview` itself
  // against the same `dist/` the rest of `archive()` already assumes exists.
  //
  // A miss is now recorded rather than swallowed, so its absence is data the
  // dev panel can see instead of silence that looks identical to "the site
  // scored perfectly."
  try {
    const { withPreviewServer } = await import('./snapshot.js')
    const { chromium } = await import('@playwright/test')
    const { screenshotViewports } = await import('./viewport-screenshotter.js')
    const { scoreResponsive } = await import('./responsive-scorer.js')

    const viewports = [
      { name: 'mobile', width: 360, height: 640 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'laptop', width: 1024, height: 768 },
      { name: 'desktop', width: 1440, height: 900 },
    ]

    const metrics = await withPreviewServer(async (previewUrl) => {
      const browser = await chromium.launch({ headless: true })
      try {
        const vpDir = path.join(buildDir, 'viewports')
        await mkdir(vpDir, { recursive: true })
        await screenshotViewports(previewUrl, viewports, vpDir, { browser })
        return await scoreResponsive(previewUrl, viewports, { browser })
      } finally {
        await browser.close()
      }
    })

    // The achieved MEASURABLES numbers (#456), produced by the same browser
    // pass above at the desktop rung — pulled off before responsive-metrics.json
    // is written so that file's shape stays what it always was. Merged into
    // measurables.json, which archiveArtifacts() (design-agents.js) already
    // wrote with the declared half, so a build without a declared block (an
    // older build, or one where the Art Director step failed) does not gain
    // a measured-only file with nothing to compare it against.
    const measured = metrics.measured ?? null
    delete metrics.measured

    metrics.buildId = buildId
    metrics.date = dateStr
    metrics.archetype = archetype

    await writeFile(
      path.join(buildDir, 'responsive-metrics.json'),
      JSON.stringify(metrics, null, 2),
      'utf8'
    )
    console.log(`  responsive metrics written (overall ${metrics.overallScore}/5)`)

    const measurablesPath = path.join(buildDir, 'measurables.json')
    if (measured && existsSync(measurablesPath)) {
      try {
        const existing = JSON.parse(await readFile(measurablesPath, 'utf8'))
        await writeFile(
          measurablesPath,
          JSON.stringify(
            {
              ...existing,
              measured,
              measuredAt: new Date().toISOString(),
              method: DESIGN_FIDELITY_METHOD,
            },
            null,
            2
          ),
          'utf8'
        )
        const declared = existing.declared
        console.log(
          `  measurables — declared canvas>=${declared?.canvas_utilization_min ?? 'n/a'}% color>=${declared?.color_coverage_min ?? 'n/a'}% hero=${declared?.hero_scale ?? 'n/a'} | measured canvas=${measured.canvas_utilization}% color=${measured.color_coverage}% hero=${measured.hero_px}px`
        )
      } catch (err) {
        console.warn(`  measurables.json measured write failed (non-blocking): ${err.message}`)
      }
    }
  } catch (err) {
    console.warn(`  responsive scoring failed (non-blocking): ${err.message}`)
    try {
      const miss = {
        date: dateStr,
        buildId,
        error: err.message,
        measuredAt: new Date().toISOString(),
      }
      await writeFile(
        path.join(buildDir, 'responsive-metrics.json'),
        JSON.stringify(miss, null, 2),
        'utf8'
      )
    } catch (writeErr) {
      console.warn(`  could not record the responsive-metrics.json miss: ${writeErr.message}`)
    }
  }

  // The day's canonical record (#153). Written last, so every artifact above is
  // on disk by now. Signals are passed in rather than read back from trace.json,
  // which design-agents.js does not write until after this function returns.
  try {
    const record = buildRecord(dateStr, {
      archiveDir: path.join(root, 'archive'),
      signals,
    })
    if (record) {
      await writeFile(path.join(dir, 'record.json'), JSON.stringify(record, null, 2), 'utf8')
      console.log(`  wrote archive/${dateStr}/record.json`)
      for (const anomaly of anomaliesOf(record)) {
        console.warn(`  record anomaly (${dateStr}, ${record.era}): ${anomaly}`)
      }
    }
  } catch (err) {
    console.warn(`  record.json write failed (non-blocking): ${err.message}`)
  }

  // Uniqueness index (#Task 6). Deterministic, zero LLM. Written after the
  // artifacts above are on disk so today's inputs are read back from the build
  // dir rather than threaded through this function's already-long signature.
  // `before: dateStr` keeps today out of its own comparison window.
  try {
    const readJson = async (name) => {
      try {
        return JSON.parse(await readFile(path.join(buildDir, name), 'utf8'))
      } catch {
        return null
      }
    }
    const [composition, todayScheme, lane, shell, header, fingerprint, measurables] =
      await Promise.all([
        readJson('composition.json'),
        readJson('color-scheme.json'),
        readJson('lane.json'),
        readJson('shell.json'),
        readJson('header.json'),
        readJson('fingerprint.json'),
        readJson('measurables.json'),
      ])
    const history = await readUniquenessHistory({ root, limit: 7, before: dateStr })
    const index = computeUniqueness(
      {
        date: dateStr,
        composition,
        hue:
          typeof todayScheme?.primary_hue?.h === 'number'
            ? todayScheme.primary_hue.h
            : (colorScheme?.primary_hue?.h ?? null),
        lane: lane?.laneId ?? null,
        shell,
        header,
        fingerprint,
        // #456: declared and measured, so fidelity() stops returning null.
        // A build with no measurables.json — every one before this shipped —
        // passes null through both and fidelity() degrades the same way
        // every other metric here does for a build missing its artifact.
        declared: measurables?.declared ?? null,
        measured: measurables?.measured ?? null,
      },
      history
    )
    await writeFile(path.join(buildDir, 'uniqueness.json'), JSON.stringify(index, null, 2), 'utf8')
    const pct = index.composite === null ? 'n/a' : `${Math.round(index.composite * 100)}%`
    console.log(`  wrote uniqueness.json (composite ${pct} over ${index.window} builds)`)
    if (index.composite !== null && index.composite < 0.35) {
      console.warn(
        `  uniqueness LOW (${pct}) — nearest: composition ${index.metrics.composition.nearest ?? 'n/a'}, hue ${index.metrics.hue.nearest ?? 'n/a'}`
      )
    }
  } catch (err) {
    console.warn(`  uniqueness.json write failed (non-blocking): ${err.message}`)
  }

  // Copy artifacts to public/ for static serving
  try {
    await copyToPublic(dateStr, buildDir, root)
  } catch (err) {
    console.warn(`  public copy failed (non-blocking): ${err.message}`)
  }

  // Seal the snapshot: rewrite links that would walk a visitor onto today's
  // site, and put the frame on every page (#156, #158).
  //
  // The whole archive is resealed rather than just today, because today's
  // arrival is what gives yesterday a next arrow to point at. The pass is
  // idempotent and costs under a second for all 1,041 pages, so there is no
  // reason to be cleverer than this.
  //
  // Non-blocking, like every other deterministic step here: an unsealed
  // snapshot is worth more than a failed build.
  try {
    const { sealArchive } = await import('../seal-archive.js')
    const { changed, scanned, dates } = await sealArchive({
      archiveRoot: path.join(root, 'public', 'archive'),
    })
    console.log(`  sealed ${changed.length} of ${scanned} pages across ${dates} dates`)
  } catch (err) {
    console.warn(`  archive seal failed (non-blocking): ${err.message}`)
  }
}
