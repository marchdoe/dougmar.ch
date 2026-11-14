import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { FooterStrip } from './generated/FooterStrip'
import { Sidebar } from './Sidebar'

// Two-asymmetric shell: the route's field hero (data-hero) takes the left
// track at lg, the margin (Sidebar) the right. Everything else spans both.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          lg: 'minmax(0, 2.3fr) minmax(300px, 1fr)',
        },
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
        '&:not(:has([data-hero])) > [data-margin]': {
          gridColumn: '1 / -1',
          gridRow: 'auto',
          position: 'static',
          borderLeftWidth: '0',
        },
        '&:has([data-hero]) [data-margin-lockup]': {
          display: { base: 'none', lg: 'flex' },
        },
      })}
    >
      <Sidebar />
      <div
        className={css({
          display: 'contents',
          '& > :not([data-hero])': { gridColumn: '1 / -1' },
        })}
      >
        {children}
      </div>
      <FooterStrip />
    </div>
  )
}
