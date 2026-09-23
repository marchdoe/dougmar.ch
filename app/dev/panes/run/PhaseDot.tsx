import { css, cva } from '../../../../styled-system/css'
import type { PhaseStatus } from '../../lib/pipeline'

const phaseDot = cva({
  base: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
  },
  variants: {
    status: {
      done: { background: 'devPanel.green', color: 'devPanel.bg' },
      active: {
        background: 'devPanel.cyan',
        animation: 'devPanelPulse 1.5s ease-in-out infinite',
      },
      pending: {
        background: 'devPanel.border',
        border: '1px solid',
        borderColor: 'devPanel.ghost',
      },
    },
  },
})

const plus = css({ lineHeight: 1 })

/** A phase's marker in the tracker: a tick when done, a pulse while active. */
export function PhaseDot({ status }: { status: PhaseStatus }) {
  return (
    <div className={phaseDot({ status })}>
      {status === 'done' && <span className={plus}>+</span>}
    </div>
  )
}
