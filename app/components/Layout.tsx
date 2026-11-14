import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

const shellCls = css({
  bg: 'bg',
  color: 'text',
  fontFamily: 'body',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

const mainCls = css({ flex: '1', minWidth: '0' })

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={shellCls}>
      <div className={mainCls}>{children}</div>
      <Sidebar />
    </div>
  )
}
