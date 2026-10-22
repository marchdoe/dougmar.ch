import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const signals = [
  { k: 'Aldie', v: '44°F · clear' },
  { k: 'Moon', v: 'waxing gibbous 90%' },
  { k: 'SPY', v: '773.09 ▲0.53%' },
  { k: 'AQI', v: 'good' },
  { k: 'Detroit', v: 'all four off-season' },
  { k: 'On the tee', v: 'Butterfield Bermuda Championship' },
  { k: 'On rotation', v: 'My Morning Jacket, Wet Leg' },
]

const item = css({ display: 'flex', alignItems: 'baseline', gap: '6px', minWidth: 0 })
const key = css({
  flexShrink: 0,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  fontSize: '2xs',
  color: 'textFaint',
})
const value = css({
  fontSize: 'xs',
  fontWeight: 'normal',
  color: 'textMuted',
  fontVariantNumeric: 'tabular-nums',
})

export function SignalFooter() {
  return (
    <footer
      className={css({
        bg: 'bg',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
        paddingBlock: '18px',
        paddingInline: '24px',
        lg: { gridColumn: '1 / 3', gridRow: '2' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '6px',
          columnGap: '18px',
          fontFamily: 'body',
        })}
      >
        <div className={item}>
          <span className={key}>{identity.name}</span>
          <span className={value}>{identity.role}</span>
        </div>
        {signals.map((s) => (
          <div key={s.k} className={item}>
            <span className={key}>{s.k}</span>
            <span className={value}>{s.v}</span>
          </div>
        ))}
        <div className={item}>
          <span className={key}>Write</span>
          <a
            href={`mailto:${identity.email}`}
            className={css({
              fontSize: 'xs',
              fontWeight: 'bold',
              color: 'textMuted',
              _hover: { color: 'accent' },
            })}
          >
            {identity.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
