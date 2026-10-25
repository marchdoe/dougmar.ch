import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { RevealSection } from './RevealSection'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const who = [entry.role, entry.company].filter((part) => part.length > 0).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '140px minmax(0, 1fr)' },
        columnGap: '6',
        rowGap: '2',
        paddingBlock: '5',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          color: 'accentAlt',
          fontVariantNumeric: 'tabular-nums',
          minWidth: { lg: '140px' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <p
          className={css({
            fontFamily: 'body',
            fontSize: { base: 'base', lg: 'lede' },
            color: 'text',
            maxWidth: '48ch',
          })}
        >
          {who}
        </p>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              fontSize: 'base',
              color: 'textMuted',
              maxWidth: '48ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineSection() {
  return (
    <RevealSection label="Experience">
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ol>
    </RevealSection>
  )
}
