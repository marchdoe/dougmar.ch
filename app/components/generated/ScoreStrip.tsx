import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Item = { k: string; v: ReactNode }

export function ScoreStrip({ items }: { items: Item[] }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
        rowGap: { base: '14px', md: '22px', lg: '26px' },
        columnGap: { base: '14px', md: '22px', lg: '26px' },
      })}
    >
      {items.map((item) => (
        <div
          key={item.k}
          className={css({ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' })}
        >
          {/* gold700 substituted with fieldInkMuted for contrast on field */}
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'fieldInkMuted',
            })}
          >
            {item.k}
          </span>
          <span
            className={css({
              fontSize: 'sm',
              color: 'fieldInkMuted',
              fontVariantNumeric: 'tabular-nums',
              '& b': { color: 'fieldInk', fontWeight: 'bold' },
            })}
          >
            {item.v}
          </span>
        </div>
      ))}
    </div>
  )
}
