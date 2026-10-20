import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationBlock() {
  const lines = [
    education.school,
    education.degree,
    education.concentration,
    education.years,
  ].filter(Boolean)
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: 'clamp(36px, 5vw, 64px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
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
          fontSize: '13px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
          marginBottom: '8px',
        })}
      >
        Education
      </h2>
      {lines.map((line) => (
        <div
          key={line}
          className={css({
            fontFamily: 'body',
            fontSize: { base: 'base', md: 'lg' },
            color: 'text',
            paddingBlock: '10px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          {line}
        </div>
      ))}
    </section>
  )
}
