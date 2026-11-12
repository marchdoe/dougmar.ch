import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { LedgerTail } from './generated/LedgerTail'
import { Sidebar } from './Sidebar'

const page = css({
  display: { lg: 'grid' },
  gridTemplateColumns: { lg: '220px minmax(0, 1fr)' },
  minHeight: { lg: '100vh' },
  bg: 'bg',
  color: 'text',
  fontFamily: 'body',
  textStyle: 'base',
  lineHeight: '1.55',
})

const content = css({
  minWidth: 0,
  paddingTop: { base: '24px', md: '40px', lg: '48px' },
  paddingBottom: { base: '64px', md: '80px', lg: '96px' },
  paddingLeft: { base: '16px', md: '4vw' },
  paddingRight: { base: '16px', md: '4vw' },
})

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={page}>
      <Sidebar />
      <main className={content}>
        {children}
        <LedgerTail />
      </main>
    </div>
  )
}
