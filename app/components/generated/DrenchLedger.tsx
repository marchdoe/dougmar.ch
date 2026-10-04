import { css } from '../../../styled-system/css'

type Row = { label: string; value: string }

export function DrenchLedger({ rows }: { rows: Row[] }) {
  return (
    <div
      className={css({ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'border' })}
    >
      {rows
        .filter((r) => r.value !== '')
        .map((r) => (
          <div
            key={r.label}
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              columnGap: '12px',
              rowGap: '1',
              paddingBlock: '12px',
              paddingInline: '2px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <span className={css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })}>
              {r.label}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontSize: 'sm',
                fontWeight: 'bold',
                color: 'text',
                textAlign: 'right',
                maxWidth: '40ch',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {r.value}
            </span>
          </div>
        ))}
    </div>
  )
}
