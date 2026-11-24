import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100%',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <Colophon />
    </div>
  )
}
