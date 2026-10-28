import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
        columnGap: '5',
        rowGap: '1',
        paddingBlock: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wide',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <span className={css({ display: 'block', fontSize: 'base', color: 'text' })}>
          {entry.role}
        </span>
        <span className={css({ display: 'block', fontSize: 'sm', color: 'textMuted' })}>
          {entry.company}
        </span>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              fontSize: 'sm',
              lineHeight: 'normal',
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
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '3',
        })}
      >
        Experience
      </h2>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </div>
  )
}
