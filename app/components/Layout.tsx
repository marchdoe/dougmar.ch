import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

// Two-material scoreboard. A route that marks its hero with data-split
// places its sections straight into the shell grid (hero / rest), so at 360
// the bronze rail lands directly beneath the hero, and at 1440 the rail
// holds the right margin beside the gold reading field.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 320px' },
        gridTemplateRows: { lg: 'auto 1fr' },
        gridTemplateAreas: { base: '"mark" "main" "rail"', lg: '"main mark" "main rail"' },
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        '&:has([data-split])': {
          gridTemplateAreas: {
            base: '"mark" "hero" "rail" "rest"',
            lg: '"hero mark" "rest rail"',
          },
        },
      })}
    >
      <Sidebar />
      <main
        className={css({
          gridArea: 'main',
          minWidth: '0',
          '&:has([data-split])': { display: 'contents' },
        })}
      >
        {children}
      </main>
    </div>
  )
}
