import { useCallback, useEffect, useState } from 'react'
import { css } from '../../styled-system/css'
import type { ArchiveEntry } from '../server/archive'
import { type Meta, type Signals, collectSignals, fetchDevData, saveOverrides } from './api'
import { DevHeader } from './DevHeader'
import { type PaneName, isPaneName } from './lib/pipeline'
import { usePipelineRun } from './lib/usePipelineRun'
import { ArchivePane } from './panes/ArchivePane'
import { InspectorPane } from './panes/InspectorPane'
import { RunPane } from './panes/RunPane'
import { SignalsPane } from './panes/SignalsPane'
import { Sidebar } from './Sidebar'
import { page } from './styles'

const layout = css({
  display: 'grid',
  gridTemplateColumns: '190px 1fr',
  flex: 1,
  overflow: 'hidden',
})
const contentArea = css({ overflow: 'auto', padding: '24px 28px' })
const loadingText = css({ color: 'devPanel.dim', padding: '28px 32px' })
const emptyWrap = css({ padding: '2rem 28px 2rem 32px', maxWidth: '480px' })
const errorText = css({ color: 'devPanel.orange', marginBottom: '1rem', fontSize: '12px' })
const emptyLead = css({ color: 'devPanel.dim', marginBottom: '1rem' })
const emptyHelp = css({ color: 'devPanel.dim', fontSize: '0.85rem', lineHeight: 1.6 })
const code = css({ background: 'devPanel.card', padding: '2px 6px', borderRadius: '4px' })

const PANE_KEY = 'dev-panel-pane'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

/** The /dev panel: header, sidebar, and whichever of the four panes is open. */
export function DevPanel() {
  const [signals, setSignals] = useState<Signals | null>(null)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [archive, setArchive] = useState<ArchiveEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const [moodOverride, setMoodOverride] = useState('')
  const [notes, setNotes] = useState('')
  const [savingOverrides, setSavingOverrides] = useState(false)
  const [refreshingSignals, setRefreshingSignals] = useState(false)

  const pipeline = usePipelineRun(setArchive)

  // Pane navigation — persisted in sessionStorage so HMR reloads don't reset it
  const [activePane, setActivePaneRaw] = useState<PaneName>(() => {
    try {
      const stored = sessionStorage.getItem(PANE_KEY)
      return isPaneName(stored) ? stored : 'pipeline'
    } catch {
      return 'pipeline'
    }
  })
  const setActivePane = (pane: PaneName) => {
    setActivePaneRaw(pane)
    try {
      sessionStorage.setItem(PANE_KEY, pane)
    } catch {}
  }

  // ── Load initial data ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchDevData()
      .then((data) => {
        setSignals(data.signals)
        setMeta(data.meta)
        setArchive(data.archive)
        setMoodOverride(data.signals?.mood_override ?? '')
        setNotes(data.signals?.notes ?? '')
      })
      .catch((err: unknown) => setApiError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  // ── Refresh signals ───────────────────────────────────────────────────────
  const handleRefreshSignals = useCallback(async () => {
    setRefreshingSignals(true)
    try {
      await collectSignals()
      const data = await fetchDevData()
      setSignals(data.signals)
      setMeta(data.meta)
      setMoodOverride(data.signals?.mood_override ?? '')
      setNotes(data.signals?.notes ?? '')
    } catch (err: unknown) {
      setApiError(errorMessage(err))
    } finally {
      setRefreshingSignals(false)
    }
  }, [])

  // ── Save overrides ────────────────────────────────────────────────────────
  const handleSaveOverrides = async () => {
    setSavingOverrides(true)
    try {
      await saveOverrides({ moodOverride: moodOverride || null, notes: notes || null })
    } catch (err: unknown) {
      setApiError(errorMessage(err))
    } finally {
      setSavingOverrides(false)
    }
  }

  if (loading)
    return (
      <main className={page}>
        <p className={loadingText}>Loading...</p>
      </main>
    )
  if (!signals)
    return (
      <main className={page}>
        <div className={emptyWrap}>
          {apiError && <p className={errorText}>{apiError}</p>}
          <p className={emptyLead}>No signals collected yet.</p>
          <p className={emptyHelp}>
            Run <code className={code}>node scripts/collect-signals.js</code> to collect today's
            signals, then refresh this page.
          </p>
        </div>
      </main>
    )

  return (
    <div className={page}>
      <DevHeader meta={meta} pipelineStatus={pipeline.status} />

      <div className={layout}>
        <Sidebar
          activePane={activePane}
          onSelect={setActivePane}
          pipelineStatus={pipeline.status}
          meta={meta}
          refreshingSignals={refreshingSignals}
          onRefreshSignals={handleRefreshSignals}
          archiveCount={archive.length}
          traceCount={pipeline.traceSteps.length}
        />

        <div className={contentArea}>
          {activePane === 'pipeline' && (
            <SignalsPane
              signals={signals}
              meta={meta}
              archive={archive}
              moodOverride={moodOverride}
              setMoodOverride={setMoodOverride}
              notes={notes}
              setNotes={setNotes}
              savingOverrides={savingOverrides}
              onSaveOverrides={handleSaveOverrides}
            />
          )}
          {activePane === 'archive' && <ArchivePane archive={archive} />}
          {activePane === 'inspector' && (
            <InspectorPane traceSteps={pipeline.traceSteps} archive={archive} />
          )}
          {activePane === 'run' && (
            <RunPane pipeline={pipeline} archive={archive} signalDate={signals.date ?? ''} />
          )}
        </div>
      </div>
    </div>
  )
}
