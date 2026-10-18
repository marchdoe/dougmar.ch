import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', sm: '1fr 140px minmax(0, 520px)' },
        columnGap: { sm: '5' },
        rowGap: '2',
        paddingBlock: '5',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <span
        className={css({
          gridColumn: { sm: '2' },
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: 'sm',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
          textAlign: { sm: 'right' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ gridColumn: { sm: '3' }, minWidth: '0' })}>
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            fontWeight: 'bold',
            textStyle: 'sm',
            color: 'text',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {heading}
        </span>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              textStyle: 'base',
              color: 'textMuted',
              maxWidth: '52ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}
