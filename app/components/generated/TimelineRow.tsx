import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineRow({ entry }: { entry: Entry }) {
  const title = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        paddingBlock: '5',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        display: { base: 'block', md: 'grid' },
        gridTemplateColumns: { md: '140px minmax(0, 1fr)' },
        columnGap: '6',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'semibold',
          fontSize: { base: 'sm', md: 'lg' },
          color: 'fieldInk',
          minWidth: { md: '140px' },
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'base', md: 'xl' },
            lineHeight: '1.1',
            letterSpacing: '-0.01em',
            color: 'fieldInk',
            marginTop: { base: '1', md: '0' },
          })}
        >
          {title}
        </div>
        {entry.description ? (
          <p
            className={css({
              margin: '0',
              marginTop: '2',
              fontSize: { base: 'sm', md: 'base' },
              color: 'fieldInkMuted',
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
