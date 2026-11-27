import { css } from '../../../styled-system/css'

const signals = [
  { k: 'Detroit Lions', v: 'Lost 35–39.' },
  { k: 'Aldie, VA', v: 'Cloudy, 45°F.' },
  { k: 'Market', v: 'SPY 716.70, down 0.3%.' },
  { k: 'Moon', v: 'Waning gibbous, 85% lit.' },
]

export function SignalRail() {
  return (
    <aside
      aria-label="Today"
      className={css({
        gridArea: { lg: 'signals' },
        bg: 'surface',
        paddingTop: { base: '34px', lg: '8px' },
        paddingBottom: { base: '42px', lg: '36px' },
        paddingLeft: { base: '20px', lg: '5vw' },
        paddingRight: { base: '20px', lg: '0' },
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {signals.map((s) => (
        <div key={s.k} className={css({ display: 'flex', flexDirection: 'column', gap: '2px' })}>
          <span
            className={css({
              textStyle: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {s.k}
          </span>
          <span className={css({ textStyle: 'base', color: 'text' })}>{s.v}</span>
        </div>
      ))}
      <div
        className={css({
          marginTop: '14px',
          paddingTop: '18px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          maxWidth: '38ch',
        })}
      >
        <p
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            textStyle: 'base',
            lineHeight: '1.5',
            color: 'textMuted',
          })}
        >
          If you correct your mind, the rest of your life will fall into place.
        </p>
        <cite
          className={css({
            display: 'block',
            marginTop: '2',
            fontStyle: 'normal',
            fontFamily: 'body',
            textStyle: 'xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          Lao Tzu
        </cite>
      </div>
    </aside>
  )
}
