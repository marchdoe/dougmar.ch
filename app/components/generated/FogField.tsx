import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

type FogFieldProps = { children: ReactNode; full?: boolean; atmos?: string }

export function FogField({ children, full = false, atmos }: FogFieldProps) {
  return (
    <div
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        padding: 'clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        minHeight: full ? '92vh' : '64vh',
        minWidth: '0',
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow="true"
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="mesh" seed={843423880} />
      </div>
      {atmos ? (
        <span
          aria-hidden="true"
          className={css({
            position: 'absolute',
            top: '28%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'display',
            fontWeight: 'light',
            fontSize: 'clamp(52px, 7.4vw, 107px)',
            lineHeight: '1',
            letterSpacing: 'wider',
            color: 'transparent',
            WebkitTextStroke: '1px token(colors.borderStrong)',
            zIndex: 1,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          })}
        >
          {atmos}
        </span>
      ) : null}
      {/* flat bg ground behind the lockup so the wordmark never sits on the mesh's pale blooms */}
      <div
        className={css({
          position: 'relative',
          zIndex: 2,
          justifySelf: 'start',
          color: 'text',
          bg: 'bg',
          paddingInline: '3',
          paddingBlock: '2',
          marginInline: '-12px',
          marginBlock: '-8px',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
      </div>
      <div />
      <div className={css({ position: 'relative', zIndex: 1, alignSelf: 'end', minWidth: '0' })}>
        {children}
      </div>
    </div>
  )
}
