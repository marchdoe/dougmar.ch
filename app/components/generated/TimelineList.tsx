import { css } from '../../../styled-system/css'
import type { timeline as Timeline } from '../../content/timeline'
import { timeline } from '../../content/timeline'

type Entry = (typeof Timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const title = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '140px minmax(0, 1fr)' },
        columnGap: '4',
        rowGap: '1',
        paddingBlock: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          letterSpacing: 'wide',
          color: { base: 'accent', _light: 'accentAlt' },
        })}
      >
        {entry.year}
      </span>
      <div>
        <div className={css({ fontFamily: 'body', fontSize: 'base', color: 'text' })}>{title}</div>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              fontSize: 'sm',
              color: 'textMuted',
              maxWidth: '50ch',
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
    <div>
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: '2xl',
          fontStyle: 'italic',
          fontWeight: 'light',
          marginBottom: '5',
        })}
      >
        Experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((e) => (
          <TimelineRow key={`${e.year}-${e.role}-${e.company}`} entry={e} />
        ))}
      </ol>
    </div>
  )
}
