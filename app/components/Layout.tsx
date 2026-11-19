import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { FootStrip } from './generated/FootStrip'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'clip',
      })}
    >
      <Sidebar />
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <FootStrip />
    </div>
  )
}
