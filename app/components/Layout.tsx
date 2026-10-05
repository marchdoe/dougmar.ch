import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
