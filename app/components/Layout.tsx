import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { TickerFooter } from './generated/TickerFooter'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        lineHeight: '1.5',
        minHeight: '100vh',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <TickerFooter />
    </div>
  )
}
