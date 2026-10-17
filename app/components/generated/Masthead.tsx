import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

export function Masthead({ children, tall }: { children: ReactNode; tall?: boolean }) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(32px, 5vw, 64px)',
        minHeight: tall ? '48vh' : '0',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingTop: 'clamp(22px, 5vw, 60px)',
        paddingBottom: 'clamp(22px, 4vw, 56px)',
        bg: 'field',
        color: 'fieldInk',
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow
        className={css({
          position: 'absolute',
          inset: '-4%',
          zIndex: 0,
          bg: 'field',
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="halftone" seed={926819107} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 2,
          alignSelf: 'flex-start',
          color: 'fieldInk',
        })}
      >
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          marginTop: 'auto',
          alignSelf: 'flex-end',
          textAlign: 'right',
          maxWidth: 'min(100%, 900px)',
          minWidth: '0',
        })}
      >
        {children}
      </div>
    </header>
  )
}
