import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { HomeStatement } from './HomeStatement'
import { LockupBadge } from './LockupBadge'
import { SignalOrbit } from './SignalOrbit'

const stageCss = css({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: { lg: 'center' },
  gap: { base: '7', lg: '8' },
  paddingTop: { base: '6', lg: '0' },
  minHeight: { lg: '86vh' },
})

export function HomeHero() {
  return (
    <HeroField>
      <LockupBadge floating />
      <div className={stageCss}>
        <HomeStatement />
        <SignalOrbit />
      </div>
    </HeroField>
  )
}
