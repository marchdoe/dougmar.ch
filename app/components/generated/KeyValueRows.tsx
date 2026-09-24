import { css } from '../../../styled-system/css'
import { ColumnTitle } from './ColumnTitle'

type Row = { label: string; value: string }

export function KeyValueRows({ title, rows }: { title: string; rows: Row[] }) {
  const shown = rows.filter((row) => row.value !== '')
  return (
    <div>
      <ColumnTitle label={title} />
      {shown.map((row) => (
        <div
          key={row.label}
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingBlock: '14px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              fontWeight: 600,
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wide',
              color: 'textFaint',
            })}
          >
            {row.label}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontSize: 'lede',
              color: 'text',
              maxWidth: '46ch',
            })}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}
