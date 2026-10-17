import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        maxWidth: '100%',
        overflowX: 'clip',
      })}
    >
      <main className={css({ flex: '1', display: 'block' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
