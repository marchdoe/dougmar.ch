import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { SiteFooter } from './generated/SiteFooter'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className={css({
          display: { base: 'flex', lg: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { lg: '96px 1fr 1fr 1fr' },
          columnGap: 'clamp(26px, 3vw, 44px)',
          alignItems: { lg: 'start' },
          paddingTop: { base: '20px', lg: '28px' },
          paddingInline: { base: 'clamp(16px, 4vw, 44px)', lg: 'clamp(28px, 4vw, 56px)' },
          paddingBottom: '30px',
          bg: 'bg',
          color: 'text',
        })}
      >
        <Sidebar />
        <main
          className={css({
            display: { base: 'contents', lg: 'block' },
            gridColumn: { lg: '2 / 5' },
            gridRow: { lg: '2' },
            minWidth: '0',
          })}
        >
          {children}
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
