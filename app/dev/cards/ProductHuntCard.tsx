import { css } from '../../../styled-system/css'
import { readProductHunt } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading, emptyText, listRow } from '../styles'
import { CardError } from './CardError'

const votes = css({
  fontSize: '10px',
  fontWeight: 700,
  color: 'devPanel.productHunt',
  minWidth: '28px',
  textAlign: 'right',
})
const name = css({ fontSize: '11px', color: 'devPanel.text', flex: 1 })

export function ProductHuntCard({ signals }: { signals: Signals }) {
  const ph = readProductHunt(signals.product_hunt)
  if (!ph)
    return (
      <CardError
        label="// PRODUCT HUNT"
        reason="PRODUCT_HUNT_CLIENT_ID and PRODUCT_HUNT_CLIENT_SECRET not set"
      />
    )

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// PRODUCT HUNT</span>
      </h3>
      {ph.products.map((p) => (
        <div key={p.name} className={listRow({ align: 'baseline' })}>
          <span className={votes}>{p.votes}</span>
          <span className={name}>{p.name}</span>
        </div>
      ))}
      {ph.products.length === 0 && <div className={emptyText}>No products</div>}
    </div>
  )
}
