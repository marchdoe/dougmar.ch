import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { IndexLabel } from './IndexLabel'
import { SigRow } from './SigRow'

export function PersonalSigs() {
  const rows: [string, string][] = [
    ['Holes in one', String(personal.holesInOne)],
    ['Sport', personal.sport],
    ['Teams', personal.teams.join(', ')],
    ['Current focus', personal.currentFocus],
  ]
  return (
    <section
      className={css({
        marginTop: { base: '34px', md: '40px' },
        marginBottom: '48px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <IndexLabel>Off the clock</IndexLabel>
      <div
        className={css({
          marginTop: '8px',
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          columnGap: { md: '48px' },
        })}
      >
        {rows.map(([k, v]) => (
          <SigRow key={k} k={k}>
            {v}
          </SigRow>
        ))}
      </div>
    </section>
  )
}
