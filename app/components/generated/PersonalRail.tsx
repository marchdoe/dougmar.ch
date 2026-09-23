import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalRail() {
  const pairs = [
    { label: 'Holes in one', value: String(personal.holesInOne), big: true },
    { label: 'Sport', value: personal.sport, big: false },
    { label: 'Teams', value: personal.teams.join(', '), big: false },
    { label: 'Current focus', value: personal.currentFocus, big: false },
  ]
  return (
    <aside aria-label="Off the clock">
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          fontWeight: 'bold',
          marginBottom: '3',
        })}
      >
        Off the clock
      </h2>
      <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2' })}>
        {pairs.map((p) => (
          <div
            key={p.label}
            className={css({
              bg: 'bgAlt',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'sm',
              padding: '3',
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              minWidth: '0',
            })}
          >
            <span
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              {p.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: p.big ? '3xl' : 'base',
                lineHeight: '1.1',
                color: p.big ? 'accentAlt' : 'text',
              })}
            >
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
