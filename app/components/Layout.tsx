import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        lineHeight: 'normal',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Sidebar />
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <Colophon />
    </div>
  )
}
