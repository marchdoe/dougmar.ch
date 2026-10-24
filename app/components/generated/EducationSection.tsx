import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { Kicker } from './Kicker'

export function EducationSection() {
  return (
    <section
      className={css({
        paddingInline: '5vw',
        paddingBottom: '8',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '1180px', marginInline: 'auto' })}>
        <Kicker>Education</Kicker>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
            paddingBlock: '5',
            borderTop: '1px solid',
            borderTopColor: 'border',
            borderBottom: '1px solid',
            borderBottomColor: 'border',
          })}
        >
          <span className={css({ fontFamily: 'display', textStyle: 'lg', color: 'text' })}>
            {education.school}
          </span>
          <span className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>
            {education.degree}
          </span>
          <span className={css({ textStyle: 'sm', color: 'textMuted' })}>
            {education.concentration}
          </span>
          {education.years ? (
            <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{education.years}</span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
