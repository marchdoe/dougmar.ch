import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'

const panel = css({
  bg: 'field',
  color: 'fieldInk',
  padding: 'clamp(20px, 3vw, 40px)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'fieldBorder',
})
const label = css({
  textStyle: 'xs',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'fieldInkMuted',
})
const value = css({ textStyle: 'sm', color: 'fieldInk', maxWidth: '50ch', marginTop: '1' })

export function EducationPersonal() {
  const study = [education.degree, education.concentration].filter(Boolean).join(', ')
  const facts = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 80px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
        gap: '5',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={panel}>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: 'clamp(18px, 1.5vw, 22px)',
            marginBottom: '4',
          })}
        >
          Education
        </h2>
        <div className={css({ textStyle: 'lg', fontFamily: 'display', fontWeight: 'bold' })}>
          {education.school}
        </div>
        <div className={value}>{study}</div>
        {education.years && <div className={label}>{education.years}</div>}
      </div>
      <div className={panel}>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: 'clamp(18px, 1.5vw, 22px)',
            marginBottom: '4',
          })}
        >
          Off the clock
        </h2>
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={css({
              paddingBlock: '3',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
              _last: { borderBottomWidth: '0' },
            })}
          >
            <div className={label}>{fact.label}</div>
            <div className={value}>{fact.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
