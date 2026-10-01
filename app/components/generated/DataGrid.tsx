import { css } from '../../../styled-system/css'

export type Datum = { lbl: string; val: string }

export function DataGrid({ items }: { items: Datum[] }) {
  return (
    <div
      className={css({
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '20px',
        columnGap: '40px',
        md: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
      })}
    >
      {items.map((d) => (
        <div
          key={d.lbl}
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'fieldBorder',
            paddingTop: '12px',
          })}
        >
          <div
            className={css({
              fontSize: '12px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
              fontWeight: 'bold',
              marginBottom: '6px',
            })}
          >
            {d.lbl}
          </div>
          <div
            className={css({
              fontSize: '14px',
              color: 'fieldInk',
              lineHeight: 'normal',
              fontVariantNumeric: 'tabular-nums lining-nums',
            })}
          >
            {d.val}
          </div>
        </div>
      ))}
    </div>
  )
}
