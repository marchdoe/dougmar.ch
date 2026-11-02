import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionHead } from './SectionHead'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const line = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: '160px 1fr' },
        columnGap: { lg: '24px' },
        paddingBlock: '16px',
        paddingInline: '2px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'sm', lg: 'lg' },
          letterSpacing: 'wide',
          color: 'accent',
          marginBottom: { base: '4px', lg: '0' },
        })}
      >
        {entry.year}
      </span>
      <div>
        <p
          className={css({
            fontSize: 'base',
            fontWeight: 'bold',
            color: 'text',
            margin: '0',
            maxWidth: '60ch',
          })}
        >
          {line}
        </p>
        {entry.description ? (
          <p
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              marginTop: '6px',
              marginBottom: '0',
              maxWidth: '60ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineIndex() {
  return (
    <section aria-label="Timeline">
      <SectionHead>The Record</SectionHead>
      <ul className={css({ listStyle: 'none', marginTop: '8px', marginBottom: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
