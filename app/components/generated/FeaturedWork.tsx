import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { FeaturedLinks } from './FeaturedLinks'
import { field } from './fields'

export function FeaturedWork() {
  const p = featuredProject
  if (!p) return null
  const meta = [field(p, 'role'), field(p, 'status')].filter(Boolean).join(' · ')
  return (
    <section
      aria-labelledby="feat"
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        bg: 'surface',
        paddingBlock: '7',
        paddingInline: { base: '24px', sm: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: { base: 'block', lg: 'grid' },
          gridTemplateColumns: { lg: '1.1fr 1fr' },
          columnGap: { lg: '7' },
          alignItems: 'start',
        })}
      >
        <div>
          <div
            className={css({
              fontSize: 'xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'accent',
              fontWeight: 'bold',
              marginBottom: '20px',
            })}
          >
            Featured · {p.type} · {p.year}
          </div>
          <h2
            id="feat"
            className={css({
              fontSize: { base: '28px', lg: '44px' },
              fontFamily: 'display',
              fontWeight: 'bold',
              lineHeight: 'tight',
              letterSpacing: 'tight',
              textTransform: 'lowercase',
              color: 'text',
            })}
          >
            {p.title}
          </h2>
          <div
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              marginTop: '10px',
              letterSpacing: 'wide',
            })}
          >
            {meta}
          </div>
        </div>
        <div className={css({ marginTop: { base: '5', lg: '0' } })}>
          <p
            className={css({
              fontSize: '17px',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '56ch',
            })}
          >
            {field(p, 'problem') || field(p, 'description')}
          </p>
          <FeaturedLinks project={p} slug={p.slug} title={p.title} />
        </div>
      </div>
    </section>
  )
}
