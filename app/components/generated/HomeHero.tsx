import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { GhostChase } from './GhostChase'
import { FigureBlock } from './FigureBlock'
import { LeaderboardBoard } from './LeaderboardBoard'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'field',
        minHeight: '100vh',
        overflow: 'hidden',
        paddingTop: { base: '6', lg: '8' },
        paddingInline: { base: '6vw', lg: '5vw' },
        paddingBottom: '9',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Ground material="grain" seed={1959187987} />
      <GhostChase />
      <div
        className={css({
          position: 'relative',
          zIndex: 2,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: { base: 'column', lg: 'row' },
          justifyContent: { base: 'flex-end', lg: 'space-between' },
          alignItems: { base: 'stretch', lg: 'flex-end' },
          rowGap: { base: '9', lg: '0' },
          columnGap: { lg: '10' },
          paddingTop: { base: '8', lg: '0' },
        })}
      >
        <div
          className={css({
            order: { base: 2, lg: 1 },
            flex: { lg: '1 1 55%' },
            minWidth: '0',
          })}
        >
          <LeaderboardBoard />
        </div>
        <div
          className={css({
            order: { base: 1, lg: 2 },
            flex: { lg: '0 0 40%' },
            minWidth: '0',
          })}
        >
          <FigureBlock />
        </div>
      </div>
    </section>
  )
}
