import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { RuledList } from './RuledList'
import { SectionHead } from './SectionHead'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '4px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        _first: { borderTopWidth: '0' },
        paddingBlock: 'clamp(14px, 2.2vw, 22px)',
        lg: { gridTemplateColumns: '168px 1fr', columnGap: '24px' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariantNumeric: 'tabular-nums',
          textStyle: 'sm',
          color: 'textMuted',
          lg: { paddingTop: '6px' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontSize: { base: 'base', lg: 'xl' },
            lineHeight: 'snug',
            color: 'text',
          })}
        >
          {entry.role}
        </span>
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            textStyle: 'base',
            color: 'textMuted',
          })}
        >
          {entry.company}
        </span>
        {entry.description ? (
          <p
            className={css({
              marginTop: '6px',
              fontFamily: 'body',
              textStyle: 'sm',
              color: 'textMuted',
              maxWidth: '62ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineIndex() {
  return (
    <div className={css({ minWidth: '0' })}>
      <SectionHead label="Experience" aside={`${timeline.length} roles`} />
      <RuledList>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </RuledList>
    </div>
  )
}
