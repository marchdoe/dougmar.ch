import { css } from '../../../styled-system/css'

export function KeyValueList({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl className={css({ margin: '0', fontVariantNumeric: 'tabular-nums' })}>
      {rows.map((row) => (
        <div
          key={row.k}
          className={css({
            display: { base: 'block', lg: 'grid' },
            gridTemplateColumns: { lg: '180px minmax(0, 1fr)' },
            columnGap: { lg: '5' },
            alignItems: 'baseline',
            paddingBlock: '3',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <dt
            className={css({
              fontFamily: 'display',
              fontSize: '2xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            {row.k}
          </dt>
          <dd
            className={css({
              margin: '0',
              marginTop: { base: '1', lg: '0' },
              fontFamily: 'display',
              fontSize: 'sm',
              color: 'text',
            })}
          >
            {row.v}
          </dd>
        </div>
      ))}
    </dl>
  )
}
