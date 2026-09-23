import { css, cx } from '../../../../styled-system/css'
import type { Phase } from '../../lib/pipeline'
import { tracker } from '../../styles'
import { PhaseDot } from './PhaseDot'

const titleBar = css({ color: 'devPanel.muted' })
const phaseLabel = css({ fontSize: '10px', color: 'devPanel.muted', fontWeight: 400 })
const waiting = css({
  color: 'devPanel.ghost',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

/** The tracker before any run: every phase pending, an empty log. */
export function IdleTracker({ phases }: { phases: Phase[] }) {
  return (
    <div className={tracker.frame}>
      <div className={cx(tracker.titleBar, titleBar)}>// PIPELINE · Idle</div>
      <div className={tracker.body}>
        <div className={tracker.phases}>
          {phases.map((p) => (
            <div key={p.label} className={tracker.phaseRow}>
              <PhaseDot status="pending" />
              <span className={phaseLabel}>{p.label}</span>
            </div>
          ))}
        </div>
        <div className={cx(tracker.log, waiting)}>Waiting for pipeline start...</div>
      </div>
    </div>
  )
}
