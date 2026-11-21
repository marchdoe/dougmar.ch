import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        maxWidth: '100%',
        overflowX: 'clip',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      })}
    >
      <main className={css({ flex: '1 1 auto' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
