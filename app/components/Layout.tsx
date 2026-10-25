import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        overflowX: 'clip',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <Colophon />
    </div>
  )
}
