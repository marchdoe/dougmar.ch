import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SecLabel({ children }: { children: ReactNode }) {
  return (
    <h2
      className={css({
        textStyle: '2xs',
        textTransform: 'uppercase',
        letterSpacing: 'widest',
        fontWeight: 'bold',
        color: 'text',
      })}
    >
      {children}
    </h2>
  )
}
