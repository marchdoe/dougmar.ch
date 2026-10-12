import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SigRow({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '3',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        paddingBlock: '12px',
      })}
    >
      <span
        className={css({
          fontWeight: 'bold',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wide',
          fontSize: 'sm',
          color: 'textMuted',
          flex: '0 1 auto',
          maxWidth: '50%',
        })}
      >
        {k}
      </span>
      <span className={css({ fontSize: 'sm', color: 'text', textAlign: 'right', minWidth: '0' })}>
        {children}
      </span>
    </div>
  )
}
