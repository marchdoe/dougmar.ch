import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

type Props = { children: ReactNode; rail?: ReactNode }

const splitClass = css({
  position: 'relative',
  display: { base: 'block', lg: 'grid' },
  gridTemplateColumns: { lg: 'minmax(0, 1.55fr) minmax(300px, 0.9fr)' },
  minHeight: '92vh',
})

const soloClass = css({ position: 'relative', minHeight: '92vh' })

const fieldClass = css({
  position: 'relative',
  bg: 'bg',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '92vh',
  paddingTop: { base: '16px', lg: '24px' },
  paddingBottom: { base: '24px', lg: '40px' },
  paddingInline: { base: 'clamp(20px, 5vw, 88px)', lg: 'clamp(40px, 5vw, 88px)' },
  overflow: 'hidden',
})

const driftClass = css({
  position: 'absolute',
  inset: '-4%',
  bg: 'bg',
  zIndex: 0,
  pointerEvents: 'none',
  animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
})

const contentClass = css({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
})

const lockupClass = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '72px',
  color: 'text',
})

const spacerClass = css({ flex: '1 1 auto', minHeight: '40px' })

// The text block sits on its own flat bg plate so the mesh stops short of the type.
const bodyClass = css({
  position: 'relative',
  bg: 'bg',
  paddingTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(18px, 2.6vh, 30px)',
})

export function SplitHero({ children, rail }: Props) {
  return (
    <section className={rail ? splitClass : soloClass}>
      <div className={fieldClass}>
        <div aria-hidden="true" data-allow-x-overflow className={driftClass}>
          <Ground material="mesh" seed={943743821} />
        </div>
        <div className={contentClass}>
          <div className={lockupClass}>
            <BrandLockup variant="horizontal-md" mode="original" roleLine />
          </div>
          <div aria-hidden="true" className={spacerClass} />
          <div className={bodyClass}>{children}</div>
        </div>
      </div>
      {rail}
    </section>
  )
}
