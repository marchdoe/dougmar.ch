import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'
import { Sidebar } from './Sidebar'
import { LogTail } from './generated/LogTail'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 72px' },
        gridTemplateRows: { base: 'auto 1fr auto auto', lg: '1fr auto' },
        gridTemplateAreas: {
          base: '"mark" "main" "rail" "footer"',
          lg: '"main rail" "footer rail"',
        },
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
      })}
    >
      <div
        className={css({
          gridArea: 'mark',
          display: { base: 'flex', lg: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3',
          paddingBlock: '18px',
          paddingInline: '3',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        <a
          href="/"
          aria-label={`${identity.name}, home`}
          className={css({
            display: 'flex',
            alignItems: 'center',
            minHeight: '44px',
            color: 'accent',
          })}
        >
          <BrandLockup variant="mark-only-md" mode="single-color" color="accent" />
        </a>
        <span
          className={css({
            fontFamily: 'display',
            fontSize: '2xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          Log · 27 Sep 2026
        </span>
      </div>
      <main className={css({ gridArea: 'main', minWidth: '0' })}>{children}</main>
      <Sidebar />
      <LogTail />
    </div>
  )
}
