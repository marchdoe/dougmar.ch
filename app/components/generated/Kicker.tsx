import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <h2
      className={css({
        textStyle: 'xs',
        fontWeight: 'bold',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'text',
        borderTop: '3px solid',
        borderTopColor: 'accent',
        paddingTop: '2',
        marginBottom: '4',
      })}
    >
      {children}
    </h2>
  )
}
