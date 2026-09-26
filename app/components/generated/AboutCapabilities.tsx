import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'
import { SectionHead } from './SectionHead'

const cell = css({
  bg: 'field',
  border: '1px solid',
  borderColor: 'fieldBorder',
  borderRadius: 'md',
  padding: '4',
  color: 'fieldInk',
  minWidth: '0',
})

function EducationCell() {
  return (
    <div className={cell}>
      <div
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'fieldInkMuted',
        })}
      >
        Education
      </div>
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '20px',
          lineHeight: 'snug',
          marginTop: '2',
        })}
      >
        {education.school}
      </div>
      <div className={css({ fontSize: 'sm', color: 'fieldInkMuted' })}>{education.degree}</div>
      <div className={css({ fontSize: 'sm', color: 'fieldInkMuted' })}>
        {education.concentration}
      </div>
      {education.years ? (
        <div
          className={css({
            fontSize: 'sm',
            color: 'fieldInkMuted',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {education.years}
        </div>
      ) : null}
    </div>
  )
}

export function AboutCapabilities() {
  return (
    <section
      className={css({
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="Capabilities" meta="What the work draws on" />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gridAutoFlow: 'dense',
          gap: { base: '1px', md: '14px' },
        })}
      >
        {capabilities.map((c) => (
          <div key={c} className={cell}>
            <span className={css({ fontSize: 'sm', lineHeight: 'snug' })}>{c}</span>
          </div>
        ))}
        <EducationCell />
      </div>
    </section>
  )
}
