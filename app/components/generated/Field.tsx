import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function Field({ children }: { children: ReactNode }) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingInline: '7vw',
        paddingTop: { base: '6', lg: '7' },
        paddingBottom: { base: '56px', lg: '6' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          zIndex: 0,
          bg: 'bg',
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="dots" seed={926966202} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })}
      >
        {children}
      </div>
    </section>
  )
}
