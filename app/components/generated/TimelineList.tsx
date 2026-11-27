import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const head = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '120px minmax(0, 1fr)' },
        rowGap: '1',
        columnGap: '4',
        paddingBlock: '15px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <span
        className={css({
          textStyle: 'sm',
          letterSpacing: 'wide',
          color: 'textMuted',
          minWidth: { lg: '120px' },
        })}
      >
        {entry.year}
      </span>
      <div>
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: { base: 'base', lg: 'lg' },
            lineHeight: 'snug',
            color: 'text',
          })}
        >
          {head}
        </p>
        {entry.description ? (
          <p
            className={css({
              textStyle: 'sm',
              color: 'textMuted',
              maxWidth: '48ch',
              marginTop: '2',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineList() {
  return (
    <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
      {timeline.map((e) => (
        <TimelineRow key={`${e.year}-${e.company}-${e.role}`} entry={e} />
      ))}
    </ol>
  )
}
