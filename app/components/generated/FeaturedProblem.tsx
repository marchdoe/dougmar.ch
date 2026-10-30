import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

function hostOf(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function FeaturedProblem() {
  if (!featuredProject) return null
  const p = featuredProject
  const head = [p.title, p.role, String(p.year)].filter(Boolean).join(', ')
  const link = p.externalUrl ?? p.liveUrl ?? ''
  return (
    <section
      className={css({
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '260px 1fr' },
        gap: { base: '10px', lg: '30px' },
        alignItems: { lg: 'start' },
        paddingTop: '22px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: '16px',
          letterSpacing: '0.01em',
          color: 'text',
        })}
      >
        {head}
      </span>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px' })}>
        <p
          className={css({
            fontFamily: 'body',
            fontSize: '16px',
            lineHeight: '1.55',
            color: 'textMuted',
            maxWidth: '56ch',
          })}
        >
          {p.problem ?? p.description}
        </p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener"
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              minHeight: '44px',
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'accent',
            })}
          >
            {hostOf(link)} →
          </a>
        ) : null}
      </div>
    </section>
  )
}
