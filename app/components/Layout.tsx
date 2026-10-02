import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { Sidebar } from './Sidebar'

const footLink = css({
  color: 'text',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'accent' },
})

const strong = css({ color: 'text', fontWeight: 'bold' })

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        overflowX: 'clip',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <footer
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingBlock: '22px',
          paddingInline: 'clamp(24px, 5vw, 88px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          columnGap: '5',
          rowGap: '2',
          fontFamily: 'body',
          textStyle: 'xs',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        <span>
          <span className={strong}>Aldie, Virginia</span> · 2026
        </span>
        <span className={css({ display: 'inline-flex', flexWrap: 'wrap', columnGap: '5' })}>
          <a href="/about" className={footLink}>
            About
          </a>
          <a href="/work" className={footLink}>
            Work
          </a>
          <a
            href={`mailto:${identity.email}`}
            className={css({
              color: 'text',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              textTransform: 'none',
              letterSpacing: 'normal',
              _hover: { color: 'accent' },
            })}
          >
            {identity.email}
          </a>
        </span>
        <span>
          In rotation: <span className={strong}>The War on Drugs</span>,{' '}
          <span className={strong}>Wet Leg</span>
        </span>
      </footer>
    </div>
  )
}
