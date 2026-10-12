import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function IndexLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className={css({
        fontFamily: 'body',
        fontWeight: 'bold',
        fontVariantCaps: 'all-small-caps',
        letterSpacing: 'wider',
        fontSize: 'sm',
        color: 'textFaint',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '12px',
        paddingBottom: '2px',
      })}
    >
      {children}
    </p>
  )
}
