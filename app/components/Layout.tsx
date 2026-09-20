import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { css } from '../../styled-system/css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={css({ position: 'relative', width: '100%', overflowX: 'hidden', bg: 'bg' })}>
      <Sidebar />
      {children}
    </div>
  )
}
