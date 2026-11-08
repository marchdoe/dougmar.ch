import { css } from '../../../styled-system/css'
import { FigurePanel } from './FigurePanel'
import { LeaderboardPanel } from './LeaderboardPanel'

export function HeroSplit() {
  return (
    <section
      className={css({
        position: 'relative',
        marginTop: 'calc(var(--tab) * -1)',
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1fr 1fr' },
        minHeight: { lg: '100vh' },
        alignItems: { lg: 'stretch' },
      })}
    >
      <FigurePanel />
      <LeaderboardPanel />
    </section>
  )
}
