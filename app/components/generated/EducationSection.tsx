import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { SectionHeading } from './SectionHeading'

const row = css({
  paddingBlock: '14px',
  paddingInline: '8px',
  fontSize: 'sm',
  color: 'text',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
})

export function EducationSection() {
  const detail = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(', ')
  return (
    <section
      className={css({
        maxWidth: '720px',
        marginInline: 'auto',
        paddingTop: '64px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        boxSizing: 'content-box',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="schooling" title="education" flush />
      <div
        className={css({
          marginTop: '20px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        <div className={row}>{education.school}</div>
        <div className={`${row} ${css({ color: 'textMuted' })}`}>{detail}</div>
      </div>
    </section>
  )
}
