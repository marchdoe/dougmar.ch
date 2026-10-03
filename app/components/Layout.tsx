import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { SiteFooter } from './generated/SiteFooter'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        fontSize: 'base',
        lineHeight: 'normal',
        overflowX: 'hidden',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
