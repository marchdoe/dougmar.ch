import { css } from '../../../styled-system/css'
import { LedgerCell } from './LedgerCell'

const signals = [
  { label: 'Lions', value: '20–17', up: 'W', sub: 'NFL · Final' },
  { label: 'Red Wings', value: '4–3', up: 'W', sub: 'NHL · Final' },
  { label: 'Golf', value: 'Smotherman −16', sub: 'Butterfield Bermuda · over Séamus Power −15' },
  { label: 'SPY', value: '765.37', up: '▲ 0.71%', sub: 'Close' },
  { label: 'In rotation', value: 'Radiohead', sub: 'Tobin Sprout · Guided by Voices' },
  { label: 'Moon', value: '95%', sub: 'Waning gibbous' },
  { label: 'Weather · Aldie', value: '51°F', sub: 'Clear' },
  { label: 'Halloween', value: 'In 4 days', sub: 'Oct 31' },
]

const baseLabel = css({
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  color: 'fieldInkMuted',
})

export function LedgerFooter() {
  return (
    <footer className={css({ bg: 'field', color: 'fieldInk' })}>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
          borderTop: '1px solid',
          borderTopColor: 'fieldBorder',
          borderLeft: '1px solid',
          borderLeftColor: 'fieldBorder',
        })}
      >
        {signals.map((s) => (
          <LedgerCell key={s.label} label={s.label} value={s.value} up={s.up} sub={s.sub} />
        ))}
        <div
          className={css({
            gridColumn: { base: '1 / -1', lg: '1 / 3' },
            borderRight: '1px solid',
            borderRightColor: 'fieldBorder',
            borderBottom: '1px solid',
            borderBottomColor: 'fieldBorder',
            paddingBlock: '16px',
            paddingInline: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            minHeight: '96px',
          })}
        >
          <p
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontSize: 'base',
              lineHeight: '1.4',
              color: 'fieldInkMuted',
              maxWidth: '46ch',
            })}
          >
            Two games, two finishes. The kind of weekend that makes a whole city feel bulletproof.
          </p>
          <span className={baseLabel}>James Allen</span>
        </div>
      </div>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2',
          paddingBlock: '14px',
          paddingInline: '18px',
        })}
      >
        <span className={baseLabel}>Aldie, Virginia</span>
        <span className={baseLabel}>Monday, October 27, 2026</span>
      </div>
    </footer>
  )
}
