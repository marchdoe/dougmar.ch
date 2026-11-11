import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { SignalStrip } from './generated/SignalStrip'

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
      })}
    >
      <Sidebar />
      <main className={css({ flex: '1', display: 'flex', flexDirection: 'column' })}>
        {children}
      </main>
      <SignalStrip />
    </div>
  )
}
