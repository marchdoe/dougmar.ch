import { css, cx } from '../../../styled-system/css'
import { BandHead } from './BandHead'
import { DetroitCell, GolfCell, MarketCell } from './SignalCellsA'
import { MiscCell, QuoteCell, SkyCell } from './SignalCellsB'
import { band, reveal } from './styles'

export function SignalBand() {
  return (
    <section aria-label="Today's signals" className={cx(band, reveal)}>
      <BandHead
        title="Monday, in figures"
        sub="November 23, 2026 · a cloudy full-moon start to the week"
      />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(12, minmax(0, 1fr))' },
          gap: 'clamp(12px, 1.4vw, 24px)',
        })}
      >
        <GolfCell />
        <DetroitCell />
        <MarketCell />
        <SkyCell />
        <QuoteCell />
        <MiscCell />
      </div>
    </section>
  )
}
