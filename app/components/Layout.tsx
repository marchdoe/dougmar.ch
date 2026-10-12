import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

// The md gutter is a fixed 32px rather than 6vw: at 820 the 6vw gutter narrowed
// every row in the column far enough to cut a line short. 6vw returns from lg.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        fontSize: 'base',
        lineHeight: '1.55',
        fontVariantNumeric: 'tabular-nums',
        paddingTop: { base: '44px', md: '52px' },
        paddingInline: { base: '16px', md: '32px', lg: '6vw', xl: '7vw' },
        overflowX: 'clip',
      })}
    >
      <Sidebar />
      <div>{children}</div>
      <Colophon />
    </div>
  )
}
