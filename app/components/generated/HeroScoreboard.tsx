import { css } from '../../../styled-system/css'
import { HeroFigure } from './HeroFigure'
import { HeroSignals } from './HeroSignals'

export function HeroScoreboard() {
  return (
    <section
      className={css({
        paddingTop: '40px',
        paddingBottom: '48px',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        lg: {
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(12px, 1.5vw, 24px)',
          alignContent: 'center',
          minHeight: '84vh',
        },
      })}
    >
      <HeroFigure />
      <HeroSignals />
    </section>
  )
}
