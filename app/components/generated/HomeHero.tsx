import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { ScoreFigure } from './ScoreFigure'
import { SignalRail } from './SignalRail'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '82vh',
        paddingTop: { base: '30px', lg: '48px' },
        paddingBottom: { base: '56px', lg: '72px' },
        paddingInline: { base: '6vw', lg: '5vw' },
        _before: {
          content: '""',
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        },
      })}
    >
      <Ground material="grain" seed={1432709416} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          flex: '1',
          display: { base: 'flex', lg: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
          rowGap: { base: '34px', lg: '0' },
          columnGap: { base: '0', lg: '2vw' },
          alignContent: { lg: 'center' },
        })}
      >
        <ScoreFigure />
        <SignalRail />
      </div>
    </section>
  )
}
