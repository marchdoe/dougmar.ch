import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const stats = [
  { label: 'Red Wings', value: 'W, 2–0', down: '' },
  { label: 'SPY', value: '754.37', down: '↓ 0.36%' },
  { label: 'Moon', value: 'First qtr · 40%', down: '' },
  { label: 'Aldie, VA', value: '43°F · cloudy', down: '' },
  { label: 'Pistons', value: 'L, 117–137', down: '' },
]

export function FooterStrip() {
  return (
    <footer
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        bg: 'bgAlt',
        paddingBlock: '24px',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '18px',
        sm: { gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', alignItems: 'end' },
      })}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className={css({ display: 'flex', flexDirection: 'column', gap: '3px' })}
        >
          <span
            className={css({
              fontSize: '2xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textFaint',
              fontWeight: 'bold',
            })}
          >
            {s.label}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'text',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {s.value}
            {s.down ? (
              <span
                className={css({
                  color: 'textMuted',
                  fontWeight: 'normal',
                  fontSize: 'sm',
                  marginLeft: '6px',
                })}
              >
                {s.down}
              </span>
            ) : null}
          </span>
        </div>
      ))}
      <div
        className={css({
          gridColumn: '1 / -1',
          fontSize: 'xs',
          color: 'textFaint',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '4',
          rowGap: '1',
        })}
      >
        <span>{identity.name}</span>
        <span>{identity.role}</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            color: 'text',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          })}
        >
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
