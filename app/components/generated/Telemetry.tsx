import { css } from '../../../styled-system/css'
import { LedgerRow } from './Ledger'
import { RevealSection } from './RevealSection'

const rows: { k: string; v: string; down?: string }[] = [
  { k: 'Location', v: 'Aldie, VA · 63°F patchy rain' },
  { k: 'Market', v: 'SPY 733.00', down: '▾ 4.41%' },
  { k: 'Golf', v: 'WWT Championship · Kirk −9' },
  { k: 'NHL', v: 'Red Wings 1–2', down: '▾ loss' },
  { k: 'NBA', v: 'Wembanyama 52 · 24 · 8' },
  { k: 'Moon', v: 'Waning crescent · 7%' },
  { k: 'Holiday', v: 'Veterans Day · in 5 days' },
  { k: 'In rotation', v: 'War on Drugs, Radiohead, Tobin Sprout' },
]

export function Telemetry() {
  return (
    <RevealSection title="Telemetry" sub="Readout · 2026.11.06">
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
          columnGap: { base: '0', md: '6' },
          rowGap: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'borderStrong',
        })}
      >
        {rows.map((r) => (
          <LedgerRow key={r.k} k={r.k}>
            {r.v}
            {/* Mockup red (#FF4D63) has no semantic token; accent is the nearest signal ink. */}
            {r.down ? <span className={css({ color: 'accent' })}> {r.down}</span> : null}
          </LedgerRow>
        ))}
      </div>
    </RevealSection>
  )
}
