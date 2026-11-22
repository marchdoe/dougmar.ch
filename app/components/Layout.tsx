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
        fontWeight: 'normal',
        overflowX: 'clip',
      })}
    >
      <div className={css({ flex: '1' })}>{children}</div>
      <Sidebar />
    </div>
  )
}
