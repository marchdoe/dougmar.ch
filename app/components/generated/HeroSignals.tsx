import { css } from '../../../styled-system/css'
import { SignalCard } from './SignalCard'

const terse = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'md',
  lineHeight: '1.2',
})
const meta = css({ fontSize: 'sm', color: 'textMuted', marginTop: '12px', lineHeight: '1.45' })
const strong = css({ color: 'text', fontWeight: 'bold' })
const rot = css({
  margin: '0',
  marginBottom: '6px',
  fontSize: 'sm',
  color: 'text',
  fontWeight: 'bold',
})

export function HeroSignals() {
  return (
    <>
      <SignalCard
        label="NBA · Pistons, a loss"
        className={css({ lg: { gridColumn: '8 / 13', gridRow: '1' } })}
      >
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '32px',
            lineHeight: '1',
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          <span className={css({ color: 'textMuted' })}>117</span> - 137
        </div>
        <div className={meta}>
          Detroit dropped this one. <strong className={strong}>No spin.</strong> They got run off
          the floor.
        </div>
      </SignalCard>
      <SignalCard
        label="Golf · Austin Championship"
        className={css({ lg: { gridColumn: '8 / 11', gridRow: '2' } })}
      >
        <div className={terse}>Trace Crowe, −14</div>
        <div className={meta}>
          <strong className={strong}>Leads</strong> into the weekend.
        </div>
      </SignalCard>
      <SignalCard
        label="Engineering note"
        className={css({ lg: { gridColumn: '11 / 13', gridRow: '2' } })}
      >
        <div className={terse}>Starship caught on Flight 15.</div>
        <div className={meta}>The arms held.</div>
      </SignalCard>
      <SignalCard
        label="In rotation"
        className={css({ lg: { gridColumn: '8 / 11', gridRow: '3' } })}
      >
        <p className={rot}>Tobin Sprout</p>
        <p className={rot}>The War on Drugs</p>
        <p className={rot}>Wet Leg</p>
      </SignalCard>
      <SignalCard
        label="Overhead, Aldie"
        flood
        className={css({ lg: { gridColumn: '11 / 13', gridRow: '3' } })}
      >
        <div className={terse}>First quarter, 40% lit.</div>
        <div
          className={css({
            fontSize: 'sm',
            color: 'fieldInkMuted',
            marginTop: '12px',
            lineHeight: '1.45',
          })}
        >
          43°F, partly cloudy, feels like 38°.
        </div>
      </SignalCard>
    </>
  )
}
