import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const smallCaps = css({
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'textMuted',
  fontWeight: 'bold',
})

// accent ink measured under 4.5:1 on surface; link set in text with an accent underline
const linkClass = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'text',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textDecorationThickness: '2px',
  textUnderlineOffset: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  gap: '6px',
  letterSpacing: '0.02em',
  _hover: { color: 'text', textDecorationColor: 'text' },
})

export function FeaturedEntry({ project }: { project: Project }) {
  const meta = [project.role, String(project.year)].filter(Boolean).join(' · ')
  const outbound = project.externalUrl ?? project.liveUrl
  return (
    <article
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '4',
        borderBottom: '1px solid',
        borderBottomColor: 'border',
        paddingBottom: '5',
        marginBottom: '28px',
      })}
    >
      <span className={smallCaps}>{project.type}</span>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontStyle: 'normal',
          fontSize: { base: '32px', lg: '44px' },
          lineHeight: '0.98',
          letterSpacing: '-0.01em',
          color: 'text',
        })}
      >
        {project.title}
      </h2>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          color: 'textMuted',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        })}
      >
        {meta}
      </span>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'lede',
          lineHeight: '1.55',
          color: 'text',
          maxWidth: '48ch',
        })}
      >
        {project.problem ?? project.description}
      </p>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '0' })}>
        <a href={`/work/${project.slug}`} className={linkClass}>
          Read the {project.title} case →
        </a>
        {outbound ? (
          <a href={outbound} className={linkClass}>
            Visit {project.title} →
          </a>
        ) : null}
      </div>
    </article>
  )
}
