import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const rowFixed = css({
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  gap: '4',
  alignItems: 'baseline',
  paddingBlock: '3',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderColor: 'border',
})

const rowStacked = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
  rowGap: '1',
  columnGap: '4',
  alignItems: 'baseline',
  paddingBlock: '3',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderColor: 'border',
})

const keyClass = css({
  textStyle: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textFaint',
})

const valClass = css({
  textStyle: 'sm',
  color: 'text',
  fontVariantNumeric: 'tabular-nums',
  minWidth: '0',
})

export function LedgerRow({
  k,
  stacked,
  children,
}: {
  k: string
  stacked?: boolean
  children: ReactNode
}) {
  return (
    <div className={stacked ? rowStacked : rowFixed}>
      <span className={keyClass}>{k}</span>
      <div className={valClass}>{children}</div>
    </div>
  )
}

export function Ledger({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
        columnGap: '6',
        rowGap: '0',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'borderStrong',
        maxWidth: { base: '66ch', lg: 'none' },
      })}
    >
      {rows
        .filter((r) => r.v !== '')
        .map((r) => (
          <LedgerRow key={r.k} k={r.k}>
            {r.v}
          </LedgerRow>
        ))}
    </div>
  )
}
