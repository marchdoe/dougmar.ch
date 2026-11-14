import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

// The flooded indigo hero plane. Left track at lg, first at base.
export function HeroField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section
      data-hero=""
      aria-label={label}
      className={css({
        gridColumn: { lg: '1' },
        gridRow: { lg: '1' },
        order: { base: -1, lg: 0 },
        position: 'relative',
        bg: 'field',
        color: 'fieldInk',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { base: 'center', md: 'flex-start', lg: 'center' },
        minHeight: { base: '100svh', md: 'auto', lg: '92vh' },
        paddingTop: { base: '160px', md: '180px', lg: '7' },
        paddingBottom: { base: '6', md: '7', lg: '7' },
        paddingInline: { base: '4', md: '5vw', lg: 'clamp(48px, 5vw, 88px)' },
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: '20px',
          left: '24px',
          display: { base: 'flex', lg: 'none' },
          justifyContent: 'flex-start',
          color: 'fieldInk',
        })}
      >
        <BrandLockup
          variant="stacked-md"
          mode="original"
          className={css({ alignItems: 'flex-start', textAlign: 'left', marginInline: '0' })}
        />
      </div>
      {children}
    </section>
  )
}
