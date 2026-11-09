import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Colophon } from './generated/Colophon'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={css({ minHeight: '100vh', bg: 'bg', color: 'text', fontFamily: 'body' })}>
      <Sidebar />
      <main>{children}</main>
      <Colophon />
    </div>
  )
}
