import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { TimelineRow } from './TimelineRow'

export function TimelineSection() {
  return (
    <RevealSection
      aria-label="Experience"
      className={css({
        bg: 'bg',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '40px', lg: '56px' },
        paddingBottom: { base: '44px', lg: '48px' },
        paddingInline: { base: '24px', lg: '6vw' },
      })}
    >
      <h2
        className={css({
          textStyle: '3xl',
          fontWeight: 'bold',
          color: 'text',
          marginBottom: '28px',
        })}
      >
        Experience
      </h2>
      <div>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.role}-${entry.company}`} entry={entry} />
        ))}
      </div>
    </RevealSection>
  )
}
