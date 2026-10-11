import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Lab({ children, alt = false }: { children: ReactNode; alt?: boolean }) {
  return (
    <span
      className={css({
        display: 'inline-block',
        fontFamily: 'body',
        textStyle: 'xs',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontVariant: 'small-caps',
        letterSpacing: 'wider',
        fontVariantNumeric: 'tabular-nums',
        color: alt ? 'accentAlt' : 'textMuted',
      })}
    >
      {children}
    </span>
  )
}
