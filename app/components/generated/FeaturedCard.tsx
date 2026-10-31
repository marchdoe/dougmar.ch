import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

// accent (amber.400) reads 4.28:1 on the dark surface (teal.700), so dark takes accentAlt (amber.200).
// accent (amber.600) fails 4.5:1 on the light surface, so light takes fieldBorder (amber.700).
const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  fontSize: 'sm',
  fontWeight: 'bold',
  color: { base: 'accentAlt', _light: 'fieldBorder' },
})

export function FeaturedCard({ project }: { project: Project }) {
  const outbound = project.externalUrl ?? project.liveUrl
  return (
    <article
      id="work"
      className={css({
        gridArea: 'featured',
        position: 'relative',
        zIndex: 1,
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderRadius: 'sm',
        padding: { base: '5', lg: '6' },
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
        alignSelf: { base: 'stretch', lg: 'start' },
        marginTop: { base: '0', lg: '6' },
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'lowercase',
          color: { base: 'accentAlt', _light: 'fieldBorder' },
        })}
      >
        featured
      </span>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '22px', lg: '32px' },
          lineHeight: '0.95',
          letterSpacing: '-0.02em',
          color: 'text',
          textTransform: 'lowercase',
        })}
      >
        {project.title}
      </h2>
      <p
        className={css({
          fontSize: 'base',
          lineHeight: '1.5',
          color: 'textMuted',
          maxWidth: '46ch',
          margin: '0',
        })}
      >
        {project.problem ?? project.description}
      </p>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '2',
          columnGap: '5',
          alignItems: 'baseline',
          fontSize: 'sm',
          color: 'textMuted',
          paddingTop: '2',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
        })}
      >
        {project.role ? (
          <span className={css({ color: 'text', fontWeight: 'bold' })}>{project.role}</span>
        ) : null}
        <span>
          {project.year} {project.type}
        </span>
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '5',
          rowGap: '0',
          marginTop: 'auto',
        })}
      >
        <a href={`/work/${project.slug}`} className={linkClass}>
          read the case study →
        </a>
        {outbound ? (
          <a href={outbound} className={linkClass}>
            visit {project.title} ↗
          </a>
        ) : null}
      </div>
    </article>
  )
}
