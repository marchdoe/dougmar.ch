import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { DriftGround } from './DriftGround'

export function VoidHero({ children }: { children: ReactNode }) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        marginTop: { base: '-96px', md: '-120px' },
      })}
    >
      <DriftGround />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          paddingTop: { base: '128px', md: '176px' },
          paddingBottom: 'clamp(40px, 6vw, 80px)',
          paddingLeft: { base: 'clamp(18px, 4vw, 56px)', lg: 'clamp(32px, 3.5vw, 60px)' },
          paddingRight: 'clamp(18px, 4vw, 56px)',
        })}
      >
        {/* Flat knockout panel so the type never sits directly on the mesh */}
        <div
          className={css({
            bg: 'bg',
            width: 'fit-content',
            maxWidth: '100%',
            paddingBlock: 'clamp(16px, 3vw, 32px)',
            paddingInline: 'clamp(16px, 3vw, 32px)',
          })}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
