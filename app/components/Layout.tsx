import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
      })}
    >
      <Sidebar />
      <main className={css({ display: 'block', minWidth: '0' })}>{children}</main>
      <Colophon />
    </div>
  )
}
