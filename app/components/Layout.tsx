import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

const shellClass = css({
  minHeight: '100vh',
  bg: 'bg',
  color: 'text',
  fontFamily: 'body',
  fontVariantNumeric: 'tabular-nums',
  overflowX: 'clip',
})

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={shellClass}>
      <main>{children}</main>
      <Sidebar />
    </div>
  )
}
