import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { SiteFooter } from './generated/SiteFooter'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
        overflowX: 'clip',
        fontVariantNumeric: 'tabular-nums',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
