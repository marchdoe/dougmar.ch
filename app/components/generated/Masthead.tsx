import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

export function Masthead({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        minHeight: '46vh',
        paddingTop: 'clamp(20px, 5vw, 48px)',
        paddingBottom: 'clamp(28px, 5vw, 52px)',
        paddingInline: 'clamp(20px, 6vw, 96px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'clamp(28px, 5vw, 40px)',
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: 'field',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="halftone" seed={675647690} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '4',
          flexWrap: 'wrap',
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ display: 'block', color: 'fieldInk' })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
        {aside}
      </div>
      <div className={css({ position: 'relative', zIndex: 1 })}>{children}</div>
    </header>
  )
}
