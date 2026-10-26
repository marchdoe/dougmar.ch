import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { css } from '../../../styled-system/css'

export function AboutLedger() {
  const cells = [
    { label: 'School', value: education.school },
    { label: 'Degree', value: education.degree },
    { label: 'Concentration', value: education.concentration },
    { label: 'Years', value: education.years },
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ].filter((c) => c.value !== '')
  return (
    <section
      aria-label="Education and personal"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingInline: 'clamp(20px, 6vw, 96px)',
        paddingBlock: 'clamp(28px, 4vw, 48px)',
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
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          textStyle: 'lg',
          letterSpacing: 'wider',
          marginBottom: '22px',
          paddingBottom: '3',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Education and the rest
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          rowGap: '20px',
          columnGap: '40px',
        })}
      >
        {cells.map((c) => (
          <div key={c.label} className={css({ textStyle: 'sm' })}>
            <span
              className={css({
                display: 'block',
                fontSize: '12px',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                marginBottom: '5px',
              })}
            >
              {c.label}
            </span>
            <span className={css({ color: 'fieldInk' })}>{c.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
