import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

type Props = { children: ReactNode; meta?: ReactNode; tall?: boolean }

export function HeroField({ children, meta, tall }: Props) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        contain: 'paint',
        bg: 'bg',
        color: 'text',
        display: 'flex',
        flexDirection: 'column',
        minHeight: tall ? '100vh' : 'auto',
        paddingTop: { base: '5', lg: '7' },
        paddingBottom: { base: '6', lg: '8' },
        paddingInline: { base: '4', lg: '7', xl: '8' },
      })}
    >
      {/* The material paints at -100% of this layer, so the layer sits inset 30%:
          the ground then spans -10% to 110% of the header, enough bleed for the
          drift without reaching the sections below. The header clips it. */}
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '30%',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="halftone" seed={1875152797} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          rowGap: { base: '5', lg: '6' },
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: { base: 'column', sm: 'row' },
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '5',
          })}
        >
          <a
            href="/"
            aria-label="Doug March, home"
            className={css({ display: 'inline-flex', color: 'text' })}
          >
            <BrandLockup variant="stacked-lg" mode="single-color" />
          </a>
          {meta}
        </div>
        {children}
      </div>
    </header>
  )
}
