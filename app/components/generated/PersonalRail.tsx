import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

const rows = [
  { k: 'Holes in one', v: String(personal.holesInOne) },
  { k: 'Sport', v: personal.sport },
  { k: 'Teams', v: personal.teams.join(', ') },
  { k: 'Current focus', v: personal.currentFocus },
].filter((r) => r.v)

export function PersonalRail() {
  return (
    <aside
      aria-label="Personal"
      className={css({
        gridArea: { lg: 'personal' },
        bg: 'surface',
        paddingTop: { base: '34px', lg: '8px' },
        paddingBottom: { base: '42px', lg: '56px' },
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
      {rows.map((r) => (
        <div key={r.k} className={css({ display: 'flex', flexDirection: 'column', gap: '2px' })}>
          <span
            className={css({
              textStyle: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {r.k}
          </span>
          <span className={css({ textStyle: 'base', color: 'text', maxWidth: '46ch' })}>{r.v}</span>
        </div>
      ))}
    </aside>
  )
}
