import { css } from '../../../styled-system/css'

type Education = { school: string; degree: string; concentration: string; years: string }

export function EducationSection({ education }: { education: Education }) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        borderTop: '1px solid',
        borderColor: 'border',
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
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'accent',
          paddingTop: { base: '6', md: '8' },
          paddingBottom: '4',
          paddingLeft: { base: '5', md: '6vw' },
          paddingRight: { base: '5', md: '6vw' },
        })}
      >
        education
      </div>
      <div
        className={css({
          paddingBottom: { base: '8', md: '10' },
          paddingLeft: { base: '5', md: '6vw' },
          paddingRight: { base: '5', md: '6vw' },
          display: 'flex',
          flexDirection: 'column',
          gap: '3',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            gap: '4',
            fontFamily: 'display',
            fontSize: 'base',
            color: 'text',
          })}
        >
          <span>{education.school}</span>
          <span className={css({ color: 'textMuted', fontSize: 'sm' })}>{education.years}</span>
        </div>
        <div className={css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })}>
          {education.degree}, {education.concentration}
        </div>
      </div>
    </section>
  )
}
