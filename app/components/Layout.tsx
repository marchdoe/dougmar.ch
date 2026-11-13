import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Colophon } from './generated/Colophon'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
        overflowX: 'hidden',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <Colophon />
    </div>
  )
}
