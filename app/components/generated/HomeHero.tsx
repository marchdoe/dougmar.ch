import { css } from '../../../styled-system/css'
import { DayPanel } from './DayPanel'
import { NightPanel } from './NightPanel'

export function HomeHero() {
  return (
    <section>
      <h1
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
          minHeight: { lg: 'calc(100dvh - 120px)' },
          textStyle: 'sm',
          fontWeight: 'normal',
        })}
      >
        <DayPanel />
        <NightPanel />
      </h1>
    </section>
  )
}
