import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SigItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        paddingBlock: '16px',
        paddingInline: '12px',
        textAlign: 'center',
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          textTransform: 'lowercase',
          letterSpacing: '0.18em',
          color: 'textMuted',
        })}
      >
        {label}
      </span>
      <span className={css({ fontSize: 'sm', color: 'text', maxWidth: '40ch' })}>{children}</span>
    </div>
  )
}
