import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { Reveal } from './Reveal'
import { TimelineRow } from './TimelineRow'

export function TimelineSection() {
  return (
    <Reveal label="Experience">
      <div
        className={css({
          bg: 'bg',
          paddingInline: 'clamp(24px, 6vw, 112px)',
          paddingTop: 'clamp(26px, 6vw, 88px)',
          paddingBottom: 'clamp(32px, 4vw, 56px)',
        })}
      >
        <h2
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            textStyle: '2xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textMuted',
            marginBottom: '4',
          })}
        >
          Experience
        </h2>
        <div
          className={css({
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
          })}
        >
          {timeline.map((entry) => (
            <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
          ))}
        </div>
      </div>
    </Reveal>
  )
}
