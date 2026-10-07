import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '2',
        paddingBlock: '5',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
        lg: { gridTemplateColumns: '220px 1fr', columnGap: '6' },
      })}
    >
      {/* steel #72819f maps to textFaint */}
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'sm', lg: 'lg' },
          lineHeight: 'tight',
          color: 'textFaint',
          minWidth: '0',
          whiteSpace: 'normal',
          textWrap: 'balance',
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'body',
            textStyle: 'base',
            fontWeight: 'bold',
            color: 'text',
          })}
        >
          {entry.role}
        </div>
        <div className={css({ fontFamily: 'body', textStyle: 'sm', color: 'textMuted' })}>
          {entry.company}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontFamily: 'body',
              textStyle: 'sm',
              color: 'textMuted',
              maxWidth: '60ch',
              marginTop: '2',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function Timeline() {
  return (
    <section
      aria-label="Experience"
      className={css({
        width: '100%',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel>Experience</SectionLabel>
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.role}-${entry.company}`} entry={entry} />
      ))}
    </section>
  )
}
