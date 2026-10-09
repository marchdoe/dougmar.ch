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
        fontSize: 'base',
        lineHeight: 'normal',
        minHeight: '100vh',
      })}
    >
      <main>{children}</main>
      <Sidebar />
    </div>
  )
}
