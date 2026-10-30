import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function HeroBand({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        paddingTop: { base: '22px', md: '36px', lg: '56px' },
        paddingBottom: { base: '24px', md: '40px', lg: '56px' },
        paddingInline: { base: '18px', md: '36px', lg: '54px' },
        minHeight: { lg: '480px' },
        display: { lg: 'flex' },
        flexDirection: { lg: 'column' },
        justifyContent: { lg: 'center' },
      })}
    >
      {/* the declared dots material, drifting on its own layer behind the type */}
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="dots" seed={608338536} />
      </div>
      <div className={css({ position: 'relative', zIndex: 1, minWidth: '0' })}>{children}</div>
    </div>
  )
}
