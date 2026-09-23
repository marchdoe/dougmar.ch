import { useState } from 'react'
import { css, cva } from '../../../styled-system/css'
import type { ArchiveEntry } from '../../server/archive'
import { readArchiveDetail } from '../../server/archive'
import { TraceStepCard } from '../cards/TraceStepCard'
import type { TraceStep } from '../lib/pipeline'
import { dot, paneHeading } from '../styles'

const picker = css({ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' })
const pickerButton = cva({
  base: {
    background: 'devPanel.card',
    border: '1px solid',
    borderColor: 'devPanel.border',
    borderRadius: '3px',
    padding: '4px 10px',
    fontSize: '10px',
    color: 'devPanel.secondary',
    cursor: 'pointer',
  },
  variants: {
    active: {
      true: { background: 'devPanel.cyan/8', borderColor: 'devPanel.cyan', color: 'devPanel.cyan' },
    },
  },
})
const streaming = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '10px',
  color: 'devPanel.orange',
  marginBottom: '16px',
})
const empty = css({
  background: 'devPanel.card',
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
  padding: '40px',
  textAlign: 'center',
  fontSize: '11px',
  color: 'devPanel.muted',
})

/** The live run's trace, or a saved build's, one expandable step at a time. */
export function InspectorPane({
  traceSteps,
  archive,
}: {
  traceSteps: TraceStep[]
  archive: ArchiveEntry[]
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [savedTrace, setSavedTrace] = useState<TraceStep[] | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  // One button per date (archive lists every build; traces load per date)
  const dates = [...new Set(archive.map((e) => e.date))].slice(0, 10)

  const loadTrace = async (date: string) => {
    setSelectedDate(date)
    setExpandedSteps(new Set())
    try {
      const detail = await readArchiveDetail({ data: date })
      if (detail?.trace) {
        const parsed = JSON.parse(detail.trace) as { steps?: TraceStep[] }
        setSavedTrace(parsed.steps || [])
      } else {
        setSavedTrace([])
      }
    } catch {
      setSavedTrace([])
    }
  }

  const displaySteps = selectedDate ? savedTrace || [] : traceSteps
  const isLive = !selectedDate && traceSteps.length > 0

  const toggleStep = (idx: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <>
      <h2 className={paneHeading}>// PROMPT INSPECTOR</h2>

      {/* Source selector: live stream vs saved traces */}
      <div className={picker}>
        <button
          type="button"
          onClick={() => {
            setSelectedDate(null)
            setSavedTrace(null)
            setExpandedSteps(new Set())
          }}
          className={pickerButton({ active: selectedDate === null })}
        >
          Live
        </button>
        {dates.map((date) => (
          <button
            type="button"
            key={date}
            onClick={() => loadTrace(date)}
            className={pickerButton({ active: selectedDate === date })}
          >
            {date}
          </button>
        ))}
      </div>

      {isLive && (
        <div className={streaming}>
          <span className={dot({ tone: 'orange' })} />
          streaming {traceSteps.length} steps
        </div>
      )}

      {displaySteps.length === 0 ? (
        <div className={empty}>
          {selectedDate
            ? 'No trace data available for this build.'
            : 'Run the pipeline to see trace data here.'}
        </div>
      ) : (
        displaySteps.map((step, i) => (
          <TraceStepCard
            // biome-ignore lint/suspicious/noArrayIndexKey: TraceStep has no unique id; displaySteps is append-only/static, never reordered.
            key={`${step.name}-${i}`}
            step={step}
            expanded={expandedSteps.has(i)}
            onToggle={() => toggleStep(i)}
          />
        ))
      )}
    </>
  )
}
