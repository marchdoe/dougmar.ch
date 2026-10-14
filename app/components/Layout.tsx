import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { Sidebar } from './Sidebar'

const nameLine = [identity.name, identity.role].filter(Boolean).join(', ')

// Repair note: the 820px overflow on the top rail's span (div.d_flex.ai_stretch.gap_4px)
// is not in this file or in any file this agent may write. That span is part of the
// [data-live-frame] rail that __root.tsx renders above <Layout>, as a sibling of this
// tree. Layout, Sidebar and the routes have no selector that reaches it, and the
// contract forbids styling, hiding or moving the rail. The fix has to land in
// __root.tsx, which the orchestrator owns.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '96px minmax(0, 1fr)' },
        width: '100%',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
      })}
    >
      <Sidebar />
      <div className={css({ minWidth: '0' })}>
        <main>{children}</main>
        <footer
          className={css({
            bg: 'bg',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
            paddingTop: { base: '26px', lg: '36px' },
            paddingBottom: { base: '40px', lg: '56px' },
            paddingLeft: { base: '20px', lg: '48px' },
            paddingRight: { base: '20px', lg: '6vw' },
          })}
        >
          <p
            className={css({
              margin: '0',
              maxWidth: '60ch',
              fontSize: 'sm',
              lineHeight: 'normal',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {nameLine}. Aldie, Virginia, October 14, 2026. Clear, 63.8°F, eleven hours of daylight,
            a waxing crescent. On rotation: The War on Drugs, Tobin Sprout, Wet Leg.
          </p>
        </footer>
      </div>
    </div>
  )
}
