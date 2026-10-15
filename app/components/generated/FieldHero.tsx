import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { HeroNav } from './HeroNav'

// The wide jade field: lockup folded top-left, hero stack, numbered nav on the lower edge.
export function FieldHero({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingTop: '4',
        paddingBottom: '5',
        paddingInline: { base: '6vw', lg: '4vw', xl: '5vw' },
        gridColumn: { lg: '2' },
        gridRow: { lg: '1' },
        _before: {
          content: '""',
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          zIndex: 0,
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        },
      })}
    >
      <Ground material="dots" seed={893263869} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '6',
        })}
      >
        <div className={css({ color: 'textMuted' })}>
          <BrandLockup variant="horizontal-md" mode="single-color" roleLine />
        </div>
        {children}
        <HeroNav />
      </div>
    </div>
  )
}
