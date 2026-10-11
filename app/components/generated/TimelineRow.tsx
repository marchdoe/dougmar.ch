import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'
import { Lab } from './Lab'

type Entry = (typeof timeline)[number]

export function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter((part) => part !== '').join(', ')
  return (
    <div
      className={css({
        display: 'block',
        paddingBlock: '5',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
        lg: { display: 'grid', gridTemplateColumns: '160px 1fr', columnGap: '24px' },
      })}
    >
      <div className={css({ minWidth: 0 })}>
        <Lab>{entry.year}</Lab>
      </div>
      <div className={css({ minWidth: 0 })}>
        <div
          className={css({
            fontFamily: 'body',
            fontSize: 'base',
            color: 'text',
            lg: { fontFamily: 'display', fontStyle: 'italic', fontSize: 'xl', lineHeight: 'snug' },
          })}
        >
          {heading}
        </div>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              marginBottom: '0',
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
