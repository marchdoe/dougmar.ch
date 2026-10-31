import { css } from '../../../styled-system/css'
import { capabilities, education, timeline } from '../../content/timeline'
import { TimelineRow } from './TimelineRow'

const labelClass = css({
  display: 'block',
  fontSize: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'lowercase',
  color: 'fieldInkMuted',
  marginBottom: '3',
})

export function TimelinePlane() {
  const degreeLine = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(' · ')
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '3',
          paddingBottom: '4',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <div>
          <span className={labelClass}>experience</span>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: '2xl',
              lineHeight: '1',
              letterSpacing: '-0.02em',
              textTransform: 'lowercase',
              color: 'fieldInk',
            })}
          >
            the record
          </h2>
        </div>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'semibold',
            fontSize: 'sm',
            color: 'fieldInkMuted',
          })}
        >
          {timeline.length} roles
        </span>
      </div>
      <div className={css({ marginBottom: '7' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '1.4fr 1fr' },
          gap: '7',
        })}
      >
        <div>
          <span className={labelClass}>capabilities</span>
          <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
            {capabilities.map((cap) => (
              <span
                key={cap}
                className={css({
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  color: 'fieldInk',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'fieldBorder',
                  borderRadius: 'sm',
                  paddingInline: '3',
                  paddingBlock: '1',
                })}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
        <div
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'fieldBorder',
            paddingTop: '4',
          })}
        >
          <span className={labelClass}>education</span>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'fieldInk',
            })}
          >
            {education.school}
          </div>
          <div className={css({ fontSize: 'sm', color: 'fieldInkMuted', marginTop: '1' })}>
            {degreeLine}
          </div>
        </div>
      </div>
    </section>
  )
}
