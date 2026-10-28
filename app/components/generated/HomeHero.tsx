import { css } from '../../../styled-system/css'
import { FogField } from './FogField'
import { HeroFigure } from './HeroFigure'
import { WorkIndex } from './WorkIndex'

export function HomeHero() {
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
        minHeight: '92vh',
        position: 'relative',
      })}
    >
      <FogField full atmos="ALDIE">
        <HeroFigure />
      </FogField>
      <WorkIndex />
    </section>
  )
}
