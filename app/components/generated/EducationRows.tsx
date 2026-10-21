import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationRows() {
  const metaLine = css({
    fontSize: '14px',
    letterSpacing: 'wider',
    textTransform: 'uppercase',
    color: 'textFaint',
  })
  return (
    <section
      aria-label="Education"
      className={css({
        paddingInline: '5vw',
        paddingBlock: 'clamp(30px, 4vw, 56px)',
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
          paddingBottom: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'borderStrong',
          fontSize: '14px',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Education
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'minmax(150px, auto) 1fr' },
          alignItems: 'baseline',
          columnGap: 'clamp(14px, 2.4vw, 40px)',
          rowGap: '6px',
          paddingBlock: 'clamp(14px, 1.8vw, 26px)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
        })}
      >
        <div
          className={css({
            order: { base: 2, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingTop: '8px',
          })}
        >
          <span className={css({ fontSize: '16px', color: 'textMuted' })}>{education.degree}</span>
          <span className={metaLine}>{education.concentration}</span>
          {education.years ? <span className={metaLine}>{education.years}</span> : null}
        </div>
        <span
          className={css({
            order: { base: 1, md: 0 },
            display: 'block',
            minWidth: '0',
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: 'clamp(40px, 10vw, 64px)', md: 'clamp(56px, 7vw, 104px)' },
            lineHeight: '0.9',
            color: 'accent',
            textAlign: { base: 'left', md: 'right' },
            justifySelf: { base: 'start', md: 'end' },
          })}
        >
          {education.school}
        </span>
      </div>
    </section>
  )
}
