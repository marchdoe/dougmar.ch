import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { LedgerCell } from './LedgerCell'

export function AboutLedger() {
  const cells = [
    {
      label: 'Education',
      value: education.school,
      sub: [education.degree, education.concentration, education.years].filter(Boolean).join(', '),
    },
    { label: 'Holes in one', value: String(personal.holesInOne), sub: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          borderTop: '1px solid',
          borderTopColor: 'fieldBorder',
          borderLeft: '1px solid',
          borderLeftColor: 'fieldBorder',
        })}
      >
        {cells.map((c) => (
          <LedgerCell key={c.label} label={c.label} value={c.value} sub={c.sub} />
        ))}
      </div>
    </section>
  )
}
