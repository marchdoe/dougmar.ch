import { css } from '../../../styled-system/css'
import { card, cardHeading, dot } from '../styles'

const status = css({ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' })
const statusText = css({ fontSize: '11px', color: 'devPanel.redSoft', fontWeight: 700 })
const reasonText = css({ fontSize: '9px', color: 'devPanel.muted', marginTop: '4px' })

/** A live-data card whose provider returned nothing, with the reason why. */
export function CardError({ label, reason }: { label: string; reason: string }) {
  return (
    <div className={card({ unavailable: true })}>
      <h3 className={cardHeading}>
        <span>{label}</span>
      </h3>
      <div className={status}>
        <span className={dot({ tone: 'red' })} />
        <span className={statusText}>API unavailable</span>
      </div>
      <div className={reasonText}>{reason}</div>
    </div>
  )
}
