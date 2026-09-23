import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { Sidebar } from './Sidebar'

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '1',
  color: 'text',
  fontWeight: 'bold',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
  _hover: { color: 'accent' },
})

function ClosingLine() {
  return (
    <div
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(22px, 4vw, 30px)',
        paddingBottom: 'clamp(34px, 6vw, 52px)',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <p
        className={css({
          fontFamily: 'display',
          textStyle: 'lg',
          color: 'textMuted',
          lineHeight: '1.6',
          maxWidth: '44ch',
        })}
      >
        {identity.name}
        {identity.role ? `, ${identity.role}` : ''}. Elsewhere:{' '}
        <a href="/work" className={linkClass}>
          Work
        </a>
        ,{' '}
        <a href="/about" className={linkClass}>
          About
        </a>
        ,{' '}
        <a href={`mailto:${identity.email}`} className={linkClass}>
          Contact
        </a>
        .
      </p>
    </div>
  )
}

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
      <ClosingLine />
    </div>
  )
}
