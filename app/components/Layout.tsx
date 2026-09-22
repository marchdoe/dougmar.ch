import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { identity } from '../content/about'
import { css } from '../../styled-system/css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        xl: { display: 'grid', gridTemplateColumns: '88px 1fr' },
      })}
    >
      <Sidebar />
      <div className={css({ display: 'flex', flexDirection: 'column', minWidth: '0' })}>
        <main className={css({ display: 'flex', flexDirection: 'column' })}>{children}</main>
        <footer
          id="contact"
          className={css({
            bg: 'field',
            color: 'fieldInk',
            paddingInline: '6vw',
            paddingBlock: '9',
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
          })}
        >
          <div>
            <div
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'xl',
                color: 'fieldInk',
              })}
            >
              {identity.name}
            </div>
            <div className={css({ fontSize: 'sm', color: 'fieldInkMuted', marginTop: '1' })}>
              {identity.role}
            </div>
          </div>
          <nav className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '2' })}>
            <a
              href="/"
              className={css({
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'fieldInk',
              })}
            >
              Work
            </a>
            <a
              href="/about"
              className={css({
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'fieldInk',
              })}
            >
              About
            </a>
            <a
              href={`mailto:${identity.email}`}
              className={css({
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'fieldInk',
              })}
            >
              Contact
            </a>
          </nav>
          <p
            className={css({
              fontSize: 'xs',
              color: 'fieldInkMuted',
              borderTop: '1px solid',
              borderColor: 'fieldBorder',
              paddingTop: '4',
            })}
          >
            © 2026 {identity.name}. Set in Bitter and Mulish.
          </p>
        </footer>
      </div>
    </div>
  )
}
