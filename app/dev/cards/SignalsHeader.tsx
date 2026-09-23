import { css } from '../../../styled-system/css'
import type { Meta } from '../api'
import { dot, healthCapsule } from '../styles'

const row = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  padding: '8px 0',
})
const left = css({ display: 'flex', alignItems: 'center', gap: '16px' })
const heading = css({
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.dim',
  margin: 0,
})
const quiet = css({ fontSize: '11px', color: 'devPanel.muted' })

/** Zone 1: the pane heading, provider health, collection time and date. */
export function SignalsHeader({ meta, date }: { meta: Meta | null; date: string }) {
  return (
    <div className={row}>
      <div className={left}>
        <h2 data-testid="signals-heading" className={heading}>
          // SIGNALS
        </h2>

        {meta && (
          <>
            <span className={healthCapsule}>
              <span className={dot({ tone: 'green', pulse: 'slow' })} />
              {meta.providers_ok} / {meta.providers_total}
            </span>
            <span className={quiet}>{meta.duration_ms}ms</span>
          </>
        )}
      </div>

      <span data-testid="signals-date" className={quiet}>
        {date}
      </span>
    </div>
  )
}
