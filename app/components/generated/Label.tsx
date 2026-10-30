import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Label({ children }: { children: ReactNode }) {
  return (
    <span
      className={css({
        display: 'block',
        fontFamily: 'body',
        fontWeight: 'bold',
        fontSize: '2xs',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'textMuted',
      })}
    >
      {children}
    </span>
  )
}
