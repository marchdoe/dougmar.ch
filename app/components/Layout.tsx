import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { SiteFooter } from './generated/SiteFooter'
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
        overflowX: 'hidden',
      })}
    >
      <Sidebar />
      <main className={css({ flex: '1' })}>{children}</main>
      <SiteFooter />
    </div>
  )
}
