import { type CSSProperties, useEffect, useState } from 'react'
import { css, cva, cx } from '../../../../styled-system/css'
import { ResponsiveCard } from '../../../components/responsive-card'
import type { ArchiveEntry, ResponsiveMetrics } from '../../../server/archive'
import { readResponsiveMetrics } from '../../../server/archive'
import { fmtDuration } from '../../lib/format'
import type { Phase, RunResult } from '../../lib/pipeline'
import { blockLabel } from '../../styles'

const box = css({
  border: '1px solid',
  borderColor: 'devPanel.green/30',
  borderRadius: '4px',
  background: 'devPanel.green/4',
  overflow: 'hidden',
})
const header = css({
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderBottom: '1px solid',
  borderBottomColor: 'devPanel.green/15',
})
const badge = css({
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  background: 'devPanel.green',
  color: 'devPanel.bg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 700,
  flexShrink: 0,
})
const headline = css({ fontSize: '12px', fontWeight: 700, color: 'devPanel.green' })
const briefText = css({ fontSize: '11px', color: 'devPanel.secondary', fontStyle: 'italic' })
const headerRight = css({ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' })
const stamp = css({ textAlign: 'right' })
const time = css({ fontSize: '10px', color: 'devPanel.green' })
const total = css({ fontSize: '9px', color: 'devPanel.dim' })
const greenButton = cva({
  base: {
    background: 'devPanel.green',
    color: 'devPanel.bg',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '.05em',
  },
  variants: {
    size: {
      md: { padding: '5px 12px', fontSize: '10px', flexShrink: 0 },
      sm: { padding: '3px 10px', fontSize: '9px' },
    },
    cooling: {
      true: { background: 'devPanel.muted', cursor: 'default', opacity: 0.6 },
    },
  },
})

const section = cva({
  base: { padding: '10px 16px' },
  variants: {
    rule: {
      bottom: { borderBottom: '1px solid', borderBottomColor: 'devPanel.green/10' },
      none: {},
    },
  },
})
const timingsLabel = css({ marginBottom: '6px' })
const bar = css({ display: 'flex', gap: '3px', alignItems: 'center' })
// Each phase's share of the run arrives as --share. The six greens step up
// from faint to solid, first phase to last.
const segment = css({
  height: '18px',
  flex: 'var(--share) 0 0',
  borderRadius: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '9px',
  color: 'devPanel.green',
  fontWeight: 700,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '&:nth-child(1)': { background: 'devPanel.green/15' },
  '&:nth-child(2)': { background: 'devPanel.green/25' },
  '&:nth-child(3)': { background: 'devPanel.green/35' },
  '&:nth-child(4)': { background: 'devPanel.green/50' },
  '&:nth-child(5)': { background: 'devPanel.green/65', color: 'devPanel.bg' },
  '&:nth-child(6)': { background: 'devPanel.green', color: 'devPanel.bg' },
})
const segmentLabels = css({ display: 'flex', justifyContent: 'space-between', marginTop: '4px' })
const segmentLabel = css({ fontSize: '9px', color: 'devPanel.muted' })
const recentHeader = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
})
const recentRow = css({
  display: 'flex',
  gap: '10px',
  padding: '5px 0',
  '&:not(:last-child)': { borderBottom: '1px solid', borderBottomColor: 'devPanel.border' },
})
const recentDate = cva({
  base: { fontSize: '10px', fontWeight: 400, color: 'devPanel.dim', minWidth: '85px' },
  variants: { today: { true: { fontWeight: 700, color: 'devPanel.green' } } },
})
const recentBrief = cva({
  base: { fontSize: '10px', color: 'devPanel.muted', fontStyle: 'italic', fontWeight: 400 },
  variants: { today: { true: { color: 'devPanel.secondary', fontWeight: 700 } } },
})
const metrics = css({
  padding: '12px 16px',
  borderTop: '1px solid',
  borderTopColor: 'devPanel.green/10',
})

/** A finished run: its brief, phase timings, the recent builds, and the responsive check. */
export function SuccessSection({
  result,
  attemptNum,
  archive,
  phases,
  onRunAgain,
  cooldownLeft,
  isCooldown,
  signalDate,
}: {
  result: RunResult
  attemptNum: number
  archive: ArchiveEntry[]
  phases: Phase[]
  onRunAgain: () => void
  cooldownLeft: number
  isCooldown: boolean
  signalDate: string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const ratingDate = signalDate || today
  const brief = result.brief ?? ''
  const timestamp = result.timestamp ?? ''
  const totalMs = result.totalMs ?? 0
  const buildId = archive[0]?.buildId ?? ''

  const [responsiveMetrics, setResponsiveMetrics] = useState<ResponsiveMetrics | null>(null)

  useEffect(() => {
    if (!ratingDate || !buildId) return
    let cancelled = false
    readResponsiveMetrics({ data: { date: ratingDate, buildId } })
      .then((m) => {
        if (!cancelled) setResponsiveMetrics(m ?? null)
      })
      .catch(() => {
        if (!cancelled) setResponsiveMetrics(null)
      })
    return () => {
      cancelled = true
    }
  }, [ratingDate, buildId])

  const siteUrl = window.location.origin

  return (
    <div className={box}>
      <div className={header}>
        <div className={badge}>+</div>
        <div role="status" aria-live="polite">
          <div className={headline}>Build passed -- committed</div>
          <div className={briefText}>&ldquo;{brief}&rdquo;</div>
        </div>
        <div className={headerRight}>
          <div className={stamp}>
            <div className={time}>{timestamp}</div>
            <div className={total}>
              Total: {fmtDuration(totalMs)} &middot; {attemptNum} attempt
              {attemptNum !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.open(siteUrl, '_blank')}
            className={greenButton({ size: 'md' })}
          >
            OPEN SITE
          </button>
        </div>
      </div>

      <div className={section({ rule: 'bottom' })}>
        <div className={cx(blockLabel, timingsLabel)}>Step Timings</div>
        <div className={bar}>
          {phases.map((p) => {
            const pct = p.durationMs && totalMs ? Math.max(3, (p.durationMs / totalMs) * 100) : 3
            return (
              <div
                key={p.label}
                title={`${p.label}: ${p.durationMs ? fmtDuration(p.durationMs) : '--'}`}
                className={segment}
                style={{ '--share': pct } as CSSProperties}
              >
                {pct > 8 ? (p.durationMs ? fmtDuration(p.durationMs) : '') : ''}
              </div>
            )
          })}
        </div>
        <div className={segmentLabels}>
          {phases.map((p) => (
            <span key={p.label} className={segmentLabel}>
              {p.label.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      <div className={section({ rule: 'none' })}>
        <div className={recentHeader}>
          <div className={blockLabel}>Recent designs</div>
          <button
            type="button"
            onClick={onRunAgain}
            disabled={isCooldown}
            className={greenButton({ size: 'sm', cooling: isCooldown })}
          >
            {isCooldown ? `RUN AGAIN IN ${cooldownLeft}s` : 'RUN AGAIN'}
          </button>
        </div>
        {archive.map((entry, i) => {
          const isToday = entry.date === today
          return (
            <div key={entry.buildId || entry.date + i} className={recentRow}>
              <span className={recentDate({ today: isToday })}>
                {entry.date}
                {isToday ? ' *' : ''}
              </span>
              <span className={recentBrief({ today: isToday })}>{entry.brief}</span>
            </div>
          )
        })}
      </div>

      <div className={metrics}>
        <ResponsiveCard metrics={responsiveMetrics} date={ratingDate} />
      </div>
    </div>
  )
}
