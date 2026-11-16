import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '140px minmax(0, 1fr)' },
        columnGap: '5',
        rowGap: '2',
        paddingBlock: '20px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
      })}
    >
      <div
        className={css({
          textStyle: 'sm',
          fontWeight: 'bold',
          color: 'textFaint',
          fontVariantNumeric: 'tabular-nums',
          minWidth: { lg: '140px' },
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            textStyle: { base: 'base', lg: '2xl' },
            fontWeight: 'bold',
            color: 'text',
          })}
        >
          {entry.role}
        </div>
        <div
          className={css({
            marginTop: '1',
            textStyle: 'sm',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          {entry.company}
        </div>
        {entry.description !== '' && (
          <p
            className={css({
              marginTop: '3',
              textStyle: 'sm',
              lineHeight: 'normal',
              color: 'textMuted',
              maxWidth: '50ch',
            })}
          >
            {entry.description}
          </p>
        )}
      </div>
    </div>
  )
}
