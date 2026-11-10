import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bgAlt',
        color: 'text',
        fontFamily: 'body',
        lineHeight: '1.5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <main className={css({ flex: '1 0 auto', minWidth: '0' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
