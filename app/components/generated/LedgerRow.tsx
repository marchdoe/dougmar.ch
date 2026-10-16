import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const valClass = css({ fontSize: 'sm', color: 'text' })
const leadClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'lede',
  color: 'text',
})

export function LedgerRow({
  label,
  children,
  lead = false,
}: {
  label: string
  children: ReactNode
  lead?: boolean
}) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '14px',
        rowGap: '4px',
        alignItems: 'baseline',
        paddingBlock: '12px',
        borderBottom: '1px solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          flex: '0 0 7.5em',
        })}
      >
        {label}
      </span>
      <span className={lead ? leadClass : valClass}>{children}</span>
    </div>
  )
}
