import { css } from '../../../styled-system/css'

type Fact = { k: string; v: string }

export function FactRows({ rows }: { rows: Fact[] }) {
  return (
    <div
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      {rows
        .filter((row) => row.v !== '')
        .map((row) => (
          <div
            key={row.k}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
              paddingBlock: '9px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            {/* fieldInk in the dark scheme, where fieldInkMuted misses 4.5:1 on the gold field */}
            <span
              className={css({
                textStyle: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: { base: 'fieldInk', _light: 'fieldInkMuted' },
                flexShrink: 0,
              })}
            >
              {row.k}
            </span>
            <span
              className={css({
                textStyle: 'sm',
                color: 'fieldInk',
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'right',
                minWidth: '0',
              })}
            >
              {row.v}
            </span>
          </div>
        ))}
    </div>
  )
}
