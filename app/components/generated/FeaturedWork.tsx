import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedWork() {
  const p = featuredProject
  if (!p) return null
  const href = p.externalUrl ?? p.liveUrl ?? `/work/${p.slug}`
  return (
    <section
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
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
          fontSize: '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
          marginBottom: '28px',
        })}
      >
        featured work
      </div>
      <div
        className={css({
          display: 'grid',
          gap: 'clamp(24px, 4vw, 56px)',
          gridTemplateColumns: { lg: 'minmax(0, 1.5fr) minmax(0, 1fr)' },
          alignItems: 'start',
        })}
      >
        <div>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: '600',
              fontSize: 'clamp(34px, 6vw, 64px)',
              letterSpacing: '-0.03em',
              lineHeight: '1',
              color: 'text',
              textTransform: 'lowercase',
            })}
          >
            {p.title}
          </h2>
          <div
            className={css({
              fontSize: '13px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'textFaint',
              marginTop: '14px',
            })}
          >
            {p.type} · {p.year}
          </div>
          <a
            href={href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              minHeight: '44px',
              marginTop: '18px',
              fontSize: '15px',
              fontWeight: 'bold',
              color: 'accent',
              textTransform: 'lowercase',
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'accent',
              transition: 'gap 0.2s ease',
              _hover: { gap: '14px' },
            })}
          >
            visit {p.title} <span aria-hidden="true">→</span>
          </a>
        </div>
        <p
          className={css({
            maxWidth: '50ch',
            fontSize: 'clamp(16px, 1.6vw, 18px)',
            lineHeight: '1.55',
            color: 'textMuted',
          })}
        >
          {p.problem}
        </p>
      </div>
    </section>
  )
}
