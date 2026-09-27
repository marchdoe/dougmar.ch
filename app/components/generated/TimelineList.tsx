import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineList({ entries }: { entries: Entry[] }) {
  return (
    <ul
      className={css({
        listStyle: 'none',
        margin: '0',
        padding: '0',
        fontVariantNumeric: 'tabular-nums',
      })}
    >
      {entries.map((entry) => (
        <li
          key={`${entry.year}-${entry.role}-${entry.company}`}
          className={css({
            display: { base: 'block', lg: 'grid' },
            gridTemplateColumns: { lg: '140px minmax(0, 1fr)' },
            columnGap: { lg: '5' },
            alignItems: 'baseline',
            paddingBlock: '3',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontSize: 'sm',
              color: 'accent',
              textAlign: { lg: 'right' },
            })}
          >
            {entry.year}
          </span>
          <div>
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: { base: 'base', lg: 'lg' },
                lineHeight: 'snug',
                color: 'text',
                marginTop: { base: '1', lg: '0' },
              })}
            >
              {[entry.role, entry.company].filter(Boolean).join(', ')}
            </span>
            {entry.description ? (
              <p
                className={css({
                  fontFamily: 'body',
                  fontSize: 'sm',
                  color: 'textMuted',
                  maxWidth: '52ch',
                  marginTop: '2',
                })}
              >
                {entry.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
