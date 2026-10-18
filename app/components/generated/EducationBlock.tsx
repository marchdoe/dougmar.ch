import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationBlock() {
  const detail = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(' · ')
  return (
    <section
      className={css({
        paddingTop: { base: '48px', lg: '96px' },
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
          fontSize: '13px',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textFaint',
          marginBottom: '20px',
        })}
      >
        Education
      </div>
      <div
        className={css({
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'border',
          paddingBlock: '20px',
        })}
      >
        <div
          className={css({
            fontFamily: 'display',
            fontSize: { base: '20px', lg: '26px' },
            lineHeight: '1.2',
            color: 'text',
          })}
        >
          {education.school}
        </div>
        <div className={css({ marginTop: '6px', fontSize: '15px', color: 'textMuted' })}>
          {detail}
        </div>
      </div>
    </section>
  )
}
