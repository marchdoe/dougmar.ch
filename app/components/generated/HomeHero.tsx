import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { Evidence } from './Evidence'
import { Thesis } from './Thesis'

export function HomeHero() {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        minHeight: '92vh',
        paddingTop: { base: '4', lg: '6' },
        paddingInline: { base: '20px', lg: '6vw' },
        paddingBottom: { base: '6', lg: '7' },
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          top: '-4%',
          left: '-4%',
          bottom: '-4%',
          right: { base: '-4%', lg: '50%' },
          zIndex: 0,
          bg: 'bg',
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="halftone" seed={977299059} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: {
            base: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1fr) minmax(0, 1fr)',
          },
          rowGap: '44px',
          columnGap: { base: '0', lg: '4vw' },
          alignItems: 'start',
        })}
      >
        <Thesis />
        <Evidence />
      </div>
    </header>
  )
}
