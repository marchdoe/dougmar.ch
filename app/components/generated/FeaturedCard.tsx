import { css } from '../../../styled-system/css'
import type { featuredProject } from '../../content/projects'

type Featured = NonNullable<typeof featuredProject>

const linkStyle = css({
  fontFamily: 'body',
  fontWeight: '500',
  fontSize: 'sm',
  color: 'accentAlt',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  minHeight: '44px',
})

export function FeaturedCard({ project }: { project: Featured }) {
  const summary = project.problem ?? project.description
  const outbound = project.externalUrl ?? project.liveUrl
  return (
    <article
      className={css({
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'sm',
        padding: 'clamp(24px, 4vw, 44px)',
        marginBottom: 'clamp(28px, 4vh, 48px)',
        display: 'grid',
        gap: '18px',
      })}
    >
      <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '3' })}>
        <h3
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: 'clamp(30px, 4.6vw, 52px)',
            lineHeight: '1',
            color: 'text',
          })}
        >
          {project.title}
        </h3>
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: '500',
            fontSize: '2xs',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'textMuted',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingBlock: '1',
            paddingInline: '9px',
            whiteSpace: 'nowrap',
          })}
        >
          {project.type} · {project.year}
        </span>
      </div>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'clamp(15px, 1.6vw, 18px)',
          color: 'textMuted',
          maxWidth: '60ch',
          lineHeight: '1.6',
        })}
      >
        {summary}
      </p>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6', rowGap: '0' })}>
        <a href={`/work/${project.slug}`} className={linkStyle}>
          Read the case study&nbsp;↗
        </a>
        {outbound && (
          <a href={outbound} className={linkStyle} target="_blank" rel="noreferrer">
            Visit {project.title}&nbsp;↗
          </a>
        )}
      </div>
    </article>
  )
}
