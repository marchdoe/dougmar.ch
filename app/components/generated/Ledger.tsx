import { css } from '../../../styled-system/css'

type Row = { k: string; v: string }

export function Ledger({ rows }: { rows: Row[] }) {
  const shown = rows.filter((row) => row.v !== '')
  return (
    <div
      className={css({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      {shown.map((row) => (
        <div
          key={row.k}
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            columnGap: '3',
            rowGap: '1',
            paddingBlock: '3',
            borderBottom: '1px solid',
            borderColor: 'fieldBorder',
          })}
        >
          <span
            className={css({
              textStyle: 'xs',
              fontVariant: 'small-caps',
              letterSpacing: 'wider',
              color: 'textMuted',
            })}
          >
            {row.k}
          </span>
          <span
            className={css({
              textStyle: 'sm',
              color: 'text',
              textAlign: 'right',
              maxWidth: '100%',
            })}
          >
            {row.v}
          </span>
        </div>
      ))}
    </div>
  )
}
