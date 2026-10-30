import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'minmax(108px, 0.2fr) 1fr' },
          gridTemplateRows: { lg: 'auto 1fr' },
          columnGap: { lg: '4vw' },
          paddingTop: { base: '26px', md: '40px', lg: '52px' },
          paddingInline: { base: '20px', md: '40px', lg: '5vw' },
          paddingBottom: '0',
          minHeight: { lg: '92vh' },
          bg: 'bg',
          color: 'text',
          fontFamily: 'body',
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({
            display: 'block',
            justifySelf: 'start',
            alignSelf: 'start',
            marginBottom: { base: '18px', lg: '22px' },
            gridColumn: { lg: '2' },
            gridRow: { lg: '1' },
            color: 'text',
            _hover: { textDecoration: 'none' },
          })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
        <Sidebar />
        <div
          className={css({
            position: 'relative',
            minWidth: '0',
            gridColumn: { lg: '2' },
            gridRow: { lg: '2' },
          })}
        >
          {children}
        </div>
      </div>
      <Colophon />
    </>
  )
}
