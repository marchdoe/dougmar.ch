import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { Ground } from '../Material'
import { FeaturedCard } from './FeaturedCard'
import { HeroBrand } from './HeroBrand'

export function HomeHero() {
  return (
    <header className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
      <Ground material="rule" seed={625116155} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          paddingInline: { base: '5', md: '7', xl: '8' },
          paddingTop: { base: '4', lg: '6' },
          paddingBottom: { base: '7', lg: '8' },
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '0.9fr 1.1fr' },
          gridTemplateRows: { base: 'auto', lg: 'auto 1fr auto' },
          gridTemplateAreas: {
            base: '"brand" "title" "featured"',
            lg: '"brand title" "featured title" "featured title"',
          },
          rowGap: { base: '5', lg: '6' },
          columnGap: { base: '0', lg: '8' },
          minHeight: { base: 'auto', lg: '68vh' },
          alignItems: 'start',
        })}
      >
        <HeroBrand />
        <h1
          className={css({
            gridArea: 'title',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: { base: 'flex-start', lg: 'flex-end' },
            alignSelf: 'stretch',
            gap: '5',
            textAlign: { base: 'left', lg: 'right' },
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {/* accent fails 3:1 over the light ground's rules, so light takes fieldBorder (amber.700) */}
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'hero',
              fontSize: { base: '5xl', md: 'hero' },
              lineHeight: '0.8',
              letterSpacing: '-0.04em',
              textTransform: 'lowercase',
              color: { base: 'accent', _light: 'fieldBorder' },
            })}
          >
            one
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'semibold',
              fontSize: { base: '24px', lg: '44px' },
              lineHeight: '1.08',
              letterSpacing: '-0.01em',
              textTransform: 'lowercase',
              color: 'text',
              maxWidth: { base: '22ch', lg: '24ch' },
              textWrap: 'balance',
            })}
          >
            Design and engineering as one job, not two teams passing files.
          </span>
        </h1>
        {featuredProject ? <FeaturedCard project={featuredProject} /> : null}
      </div>
    </header>
  )
}
