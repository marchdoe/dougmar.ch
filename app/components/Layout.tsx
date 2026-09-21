import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { SiteFooter } from './generated/SiteFooter'
import { css } from '../../styled-system/css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={css({ position: 'relative', minHeight: '100vh', bg: 'bg', color: 'text' })}>
      <Sidebar />
      {children}
      <SiteFooter />
    </div>
  )
}
