import { css } from '../../../styled-system/css'
import { SignalRow } from './SignalRow'

const signals = [
  {
    label: 'Golf · Mexico Open',
    fig: 'Novak',
    figAccent: '−25',
    sub: 'Ventura and Fisk −20',
    micro: 'VidantaWorld · Final',
  },
  { label: 'Market · SPY', fig: '755.72', figNote: '▼ 1.77%', micro: 'Close' },
  { label: 'Moon', fig: '42%', sub: 'Last quarter, illuminated' },
  { label: 'Weather · Aldie, VA', fig: '51°F', sub: 'Overcast' },
]

export function SignalRail() {
  return (
    <aside
      aria-label="Today's signals"
      className={css({
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderRadius: 'sm',
        paddingTop: '8px',
        paddingBottom: '14px',
        paddingInline: '20px',
        gridColumn: { lg: '9 / 13' },
        alignSelf: { lg: 'center' },
        animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 240ms both',
        animationDelay: '240ms',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textMuted',
          paddingTop: '12px',
          paddingBottom: '10px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        The Rest of the Day
      </div>
      {signals.map((s) => (
        <SignalRow key={s.label} {...s} />
      ))}
    </aside>
  )
}
