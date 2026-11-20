import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2
      className={css({
        fontFamily: 'body',
        fontSize: '2xs',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 'widest',
        color: 'textFaint',
        marginTop: '0',
        marginBottom: '3',
      })}
    >
      {children}
    </h2>
  )
}
