import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'
import { EvLabel } from './Panel'

type Entry = (typeof timeline)[number]

function Row({ entry, n }: { entry: Entry; n: string }) {
  const who = [entry.role, entry.company].filter((s) => s !== '').join(', ')
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
        paddingBlock: '3',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
        lg: {
          display: 'grid',
          gridTemplateColumns: '170px minmax(0, 1fr)',
          columnGap: '3',
          alignItems: 'baseline',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          fontFamily: 'body',
          fontWeight: 'bold',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        <span className={css({ fontSize: '2xs' })}>{n}</span>
        <span className={css({ fontSize: 'sm' })}>{entry.year}</span>
      </div>
      <div className={css({ minWidth: 0 })}>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'base', lg: 'lg' },
            lineHeight: 'snug',
            color: 'text',
          })}
        >
          {who}
        </div>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              fontFamily: 'body',
              fontSize: 'sm',
              lineHeight: 'normal',
              color: 'textMuted',
              maxWidth: '56ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineList({ entries }: { entries: Entry[] }) {
  return (
    <div>
      <EvLabel>Experience, 2006 to present</EvLabel>
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'borderStrong',
        })}
      >
        {entries.map((entry, i) => (
          <Row
            key={`${entry.year}-${entry.role}-${entry.company}`}
            entry={entry}
            n={String(i + 1).padStart(2, '0')}
          />
        ))}
      </div>
    </div>
  )
}
