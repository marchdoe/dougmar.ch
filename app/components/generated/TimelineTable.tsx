import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const who = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', sm: '120px 1fr' },
        columnGap: '4',
        rowGap: '1',
        paddingBlock: '12px',
        paddingInline: '1',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'textFaint',
          fontVariantNumeric: 'tabular-nums',
          minWidth: { sm: '120px' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({ fontFamily: 'body', fontSize: 'sm', fontWeight: 'bold', color: 'text' })}
        >
          {who}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'sm',
              color: 'textMuted',
              marginTop: '1',
              maxWidth: '48ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineTable() {
  return (
    <div className={css({ marginTop: '2px' })}>
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.role}-${entry.company}`} entry={entry} />
      ))}
    </div>
  )
}
