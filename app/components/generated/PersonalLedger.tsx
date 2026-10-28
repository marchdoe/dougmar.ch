import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

const rows = [
  { key: 'Holes in one', value: String(personal.holesInOne) },
  { key: 'Sport', value: personal.sport },
  { key: 'Teams', value: personal.teams.join(', ') },
  { key: 'Current focus', value: personal.currentFocus },
].filter((r) => r.value !== '')

export function PersonalLedger() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(48px, 6vw, 112px)',
        paddingInline: 'clamp(24px, 5vw, 80px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'fieldBorder',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'fieldInkMuted',
          marginBottom: '4',
        })}
      >
        Off the clock
      </h2>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0', maxWidth: '720px' })}>
        {rows.map((r) => (
          <li
            key={r.key}
            className={css({
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: '4',
              alignItems: 'baseline',
              paddingBlock: '3',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderColor: 'fieldBorder',
              fontSize: 'base',
              _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
            })}
          >
            <span
              className={css({
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wider',
                color: 'fieldInkMuted',
              })}
            >
              {r.key}
            </span>
            <span className={css({ color: 'fieldInk', minWidth: '0' })}>{r.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
