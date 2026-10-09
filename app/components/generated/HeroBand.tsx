import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

const bandBase = css({
  position: 'relative',
  bg: 'field',
  color: 'fieldInk',
  paddingTop: '34px',
  paddingBottom: '30px',
  paddingInline: '22px',
})

const bandHome = css({
  lg: {
    gridColumn: '1 / 6',
    gridRow: '1 / 5',
    paddingTop: '48px',
    paddingInline: '36px',
    paddingBottom: '44px',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
})

const bandFull = css({
  lg: { paddingTop: '56px', paddingInline: '48px', paddingBottom: '52px' },
})

export function HeroBand({ children, home }: { children: ReactNode; home: boolean }) {
  return (
    <div className={cx(bandBase, home ? bandHome : bandFull)}>
      <Ground material="rule" seed={893410964} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flexGrow: 1,
        })}
      >
        <div
          className={css({
            marginBottom: '26px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
            lg: { marginBottom: '34px' },
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
        </div>
        {children}
      </div>
    </div>
  )
}
