import { css } from '../../../styled-system/css'
import { LedgerRow, Worksheet, WorksheetHead } from './Worksheet'

const missClass = css({ color: 'accent', fontWeight: 'bold' })
/* The mockup's up-tick green is green.600, which is the fieldBorder token. */
const gainClass = css({ color: 'fieldBorder', fontWeight: 'bold' })
const quietClass = css({ color: 'borderStrong' })

export function DayLedger() {
  return (
    <Worksheet label="The day">
      <WorksheetHead title="the day · ledger" detail="wed, 04 nov 2026 · detroit" />
      <div>
        <LedgerRow label="weather">mist · 52°F · 95% rh</LedgerRow>
        <LedgerRow label="market">
          SPY 754.35 <span className={gainClass}>▲ 0.30%</span>
        </LedgerRow>
        <LedgerRow label="moon">waning crescent · 22%</LedgerRow>
        <LedgerRow label="hockey">
          Red Wings <span className={missClass}>L 2–4</span>
        </LedgerRow>
        <LedgerRow label="golf">WWT Championship · scheduled</LedgerRow>
        <LedgerRow label="rotation">Radiohead · The War on Drugs · Tobin Sprout</LedgerRow>
        <LedgerRow label="upcoming">
          <span className={quietClass}>nov 11 · veterans day · +7</span>
        </LedgerRow>
      </div>
    </Worksheet>
  )
}
