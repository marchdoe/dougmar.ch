import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

const fullCss = css({
  position: 'relative',
  overflow: 'hidden',
  bg: 'bg',
  color: 'text',
  paddingBlock: '7vh',
  paddingInline: '6vw',
  minHeight: '100dvh',
})

const bannerCss = css({
  position: 'relative',
  overflow: 'hidden',
  bg: 'bg',
  color: 'text',
  paddingBlock: '7vh',
  paddingInline: '6vw',
})

const driftCss = css({
  position: 'absolute',
  inset: '-4%',
  zIndex: 0,
  bg: 'bg',
  pointerEvents: 'none',
  animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
})

const contentCss = css({ position: 'relative', zIndex: 1 })

type Props = { children: ReactNode; banner?: boolean }

export function HeroField({ children, banner = false }: Props) {
  return (
    <header className={banner ? bannerCss : fullCss}>
      <div aria-hidden="true" data-allow-x-overflow className={driftCss}>
        <Ground material="mesh" seed={993929583} />
      </div>
      <div className={contentCss}>{children}</div>
    </header>
  )
}
