import { css } from '../../../styled-system/css'
import { HomeHero } from './HomeHero'
import { NightRail } from './NightRail'

export function HomeStage() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1.55fr) minmax(220px, 0.45fr)' },
        minHeight: { lg: 'calc(100vh - 72px)' },
      })}
    >
      <HomeHero />
      <NightRail />
    </div>
  )
}
