import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { FeaturedArtifact } from './FeaturedArtifact'
import { HeroRail } from './HeroRail'

export function HomeHero() {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        minHeight: '92vh',
        bg: 'bg',
        paddingTop: 'clamp(34px, 6vw, 76px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 6vw, 96px)',
      })}
    >
      <Ground material="rule" seed={709202928} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          rowGap: 'clamp(28px, 5vw, 60px)',
          columnGap: { base: '0', lg: 'clamp(32px, 5vw, 88px)' },
          gridTemplateColumns: {
            base: 'minmax(0, 1fr)',
            lg: 'minmax(260px, 0.9fr) minmax(0, 2.6fr)',
          },
          gridTemplateAreas: { base: '"brand" "stage" "rail"', lg: '"brand stage" "rail stage"' },
          gridTemplateRows: { lg: 'auto 1fr' },
          alignItems: 'start',
        })}
      >
        <div className={css({ gridArea: 'brand', minWidth: '0' })}>
          <BrandLockup variant="stacked-lg" mode="original" />
        </div>
        <div className={css({ gridArea: 'stage', minWidth: '0' })}>
          <FeaturedArtifact project={featuredProject} />
        </div>
        <div
          className={css({
            gridArea: 'rail',
            minWidth: '0',
            marginTop: { lg: 'clamp(28px, 4vw, 56px)' },
          })}
        >
          <HeroRail />
        </div>
      </div>
    </header>
  )
}
