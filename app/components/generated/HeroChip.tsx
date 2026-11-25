import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function HeroChip({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        alignSelf: 'flex-start',
        fontFamily: 'body',
        textTransform: 'uppercase',
        letterSpacing: 'wider',
        fontWeight: 'bold',
        textStyle: '2xs',
        color: 'fieldInk',
        // accentAlt lightens to crimson.200 in dark; the chip keeps a dark ground there so fieldInk still reads
        bg: { base: 'accentAlt', _dark: 'bg' },
        paddingBlock: '8px',
        paddingInline: '13px',
        borderRadius: 'sm',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      {children}
    </div>
  )
}
