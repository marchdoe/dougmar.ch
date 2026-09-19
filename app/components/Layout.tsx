import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { FooterLedger } from './generated/FooterLedger'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      {children}
      <FooterLedger />
    </>
  )
}
