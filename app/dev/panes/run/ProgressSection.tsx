import { Progress } from '@base-ui/react/progress'
import type { RefObject } from 'react'
import { css, cva, cx } from '../../../../styled-system/css'
import { fmtDuration, fmtElapsed } from '../../lib/format'
import type { Phase } from '../../lib/pipeline'
import { tracker } from '../../styles'
import { PhaseDot } from './PhaseDot'

const ESTIMATED_CLAUDE_MS = 120000

const frame = css({ marginBottom: '16px' })
const titleBar = css({ color: 'devPanel.dim', display: 'flex', justifyContent: 'space-between' })
const titleRight = css({ display: 'flex', gap: '12px', alignItems: 'center' })
const clock = css({ color: 'devPanel.muted', fontSize: '11px' })
const runningTag = css({ color: 'devPanel.cyan' })

const progressTrack = css({ height: '2px', background: 'devPanel.border' })
const progressIndicator = css({
  display: 'block',
  height: '100%',
  background: 'linear-gradient(90deg, {colors.devPanel.cyan}, {colors.devPanel.blue})',
  transition: 'width 0.5s ease',
})

const phaseLabel = cva({
  base: { fontSize: '10px', flex: 1, color: 'devPanel.muted', fontWeight: 400 },
  variants: {
    status: {
      pending: {},
      active: { color: 'devPanel.text', fontWeight: 700 },
      done: { textDecoration: 'line-through' },
    },
  },
})
const timing = cva({
  base: { fontSize: '9px', padding: '1px 5px', borderRadius: '3px' },
  variants: {
    status: {
      done: { color: 'devPanel.muted', background: 'devPanel.border' },
      active: { color: 'devPanel.cyan', background: 'devPanel.cyan/8' },
    },
  },
})
const estimate = css({
  marginTop: '6px',
  padding: '6px 8px',
  background: 'devPanel.cyan/6',
  border: '1px solid',
  borderColor: 'devPanel.cyan/12',
  borderRadius: '4px',
  fontSize: '9px',
  color: 'devPanel.cyan',
})
const log = css({ color: 'devPanel.muted', maxHeight: '220px', overflowY: 'auto' })
const logLine = cva({
  variants: { highlight: { true: { color: 'devPanel.cyan' }, false: { color: 'devPanel.muted' } } },
})
const cursor = css({ color: 'devPanel.cyan' })

function isHighlighted(line: string): boolean {
  return line.includes('===') || line.includes('calling claude') || line.includes('claude CLI')
}

/** The running tracker: attempt, clock, phase timings and the live log. */
export function ProgressSection({
  phases,
  logLines,
  attemptNum,
  logEndRef,
  elapsedMs,
}: {
  phases: Phase[]
  logLines: string[]
  attemptNum: number
  logEndRef: RefObject<HTMLDivElement | null>
  elapsedMs: number
}) {
  const activePhase = phases.find((p) => p.status === 'active')
  const isClaudePhase = Boolean(activePhase?.estimated)
  const claudeElapsed =
    isClaudePhase && activePhase?.startedAt ? Date.now() - activePhase.startedAt : 0
  const claudeProgress = isClaudePhase
    ? Math.min(95, (claudeElapsed / ESTIMATED_CLAUDE_MS) * 100)
    : 0

  return (
    <div className={cx(tracker.frame, frame)}>
      <div className={cx(tracker.titleBar, titleBar)}>
        <span>// PIPELINE &middot; Attempt {attemptNum} of 3</span>
        <div className={titleRight}>
          <span className={clock}>{fmtElapsed(elapsedMs)}</span>
          <span className={runningTag}>&#9679; running</span>
        </div>
      </div>

      {/* Progress bar for the Claude phase: an estimate against two minutes */}
      {isClaudePhase && (
        <Progress.Root value={claudeProgress} aria-label="Claude designing, estimated progress">
          <Progress.Track className={progressTrack}>
            <Progress.Indicator className={progressIndicator} />
          </Progress.Track>
        </Progress.Root>
      )}

      <div className={tracker.body}>
        <div className={tracker.phases}>
          {phases.map((p) => (
            <div key={p.label} className={tracker.phaseRow}>
              <PhaseDot status={p.status} />
              <span className={phaseLabel({ status: p.status })}>{p.label}</span>
              {p.status === 'done' && p.durationMs != null && (
                <span className={timing({ status: 'done' })}>{fmtDuration(p.durationMs)}</span>
              )}
              {p.status === 'active' && p.startedAt && (
                <span className={timing({ status: 'active' })}>
                  {fmtDuration(Date.now() - p.startedAt)}
                </span>
              )}
            </div>
          ))}

          {isClaudePhase && claudeElapsed > 5000 && (
            <div className={estimate}>
              Est. remaining: ~{fmtDuration(Math.max(0, ESTIMATED_CLAUDE_MS - claudeElapsed))}
            </div>
          )}
        </div>

        <div className={cx(tracker.log, log)}>
          {logLines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: log lines have no unique id and can repeat; array is append-only, never reordered.
            <div key={i} className={logLine({ highlight: isHighlighted(line) })}>
              {line}
            </div>
          ))}
          <span className={cursor}>_</span>
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  )
}
