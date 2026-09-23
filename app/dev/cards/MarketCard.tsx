import { css, cva } from '../../../styled-system/css'
import { readMarket } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading } from '../styles'
import { CardError } from './CardError'

const quoteRow = css({ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' })
const symbol = css({ fontSize: '9px', fontWeight: 700, color: 'devPanel.muted' })
const price = css({ fontSize: '20px', fontWeight: 700, color: 'devPanel.text' })
const changeRow = css({ display: 'flex', alignItems: 'center', gap: '6px' })

const direction = cva({
  base: { color: 'devPanel.dim' },
  variants: {
    dir: { up: { color: 'devPanel.green' }, down: { color: 'devPanel.red' }, flat: {} },
    part: {
      arrow: { fontSize: '14px' },
      figure: { fontSize: '13px', fontWeight: 700 },
    },
  },
})

export function MarketCard({ signals }: { signals: Signals }) {
  const market = readMarket(signals.market)
  if (!market) return <CardError label="// MARKET" reason="ALPHA_VANTAGE_API_KEY not set" />

  const dir = market.direction === 'up' ? 'up' : market.direction === 'down' ? 'down' : 'flat'
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—'

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// MARKET</span>
      </h3>
      <div className={quoteRow}>
        <span className={symbol}>{market.symbol}</span>
        <span className={price}>${Number.parseFloat(market.price ?? '0').toFixed(2)}</span>
      </div>
      <div className={changeRow}>
        <span className={direction({ dir, part: 'arrow' })}>{arrow}</span>
        <span className={direction({ dir, part: 'figure' })}>
          {market.change} ({market.change_percent})
        </span>
      </div>
    </div>
  )
}
