import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

const shellCss = css({
  bg: 'bg',
  color: 'text',
  fontFamily: 'body',
  minHeight: '100vh',
})

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={shellCss}>
      <div>{children}</div>
      <Sidebar />
    </div>
  )
}
