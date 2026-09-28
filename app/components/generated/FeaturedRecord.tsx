import { css } from '../../../styled-system/css'
import { featuredProject, projects } from '../../content/projects'

type Project = (typeof projects)[number]

// The approved mockup features Fishsticks as the lead record; fall back to the flagged feature.
const lead: Project | undefined = projects.find((p) => p.slug === 'fishsticks') ?? featuredProject

function recordHref(p: Project): string {
  return p.liveUrl ?? p.externalUrl ?? `/work/${p.slug}`
}

function FeaturedMeta({ project }: { project: Project }) {
  return (
    <div
      className={css({
        fontFamily: 'body',
        fontSize: 'sm',
        color: 'textMuted',
        marginTop: '1',
        display: 'flex',
        columnGap: '14px',
        rowGap: '1',
        flexWrap: 'wrap',
      })}
    >
      <span>{project.type}</span>
      <span>{project.year}</span>
      {project.role ? <span>{project.role}</span> : null}
    </div>
  )
}

export function FeaturedRecord() {
  const project = lead
  if (!project) return null
  return (
    <article
      className={css({
        marginTop: '20px',
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'sm',
        padding: '20px',
        minWidth: '0',
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
          marginBottom: '6px',
        })}
      >
        Featured record
      </div>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xl',
          fontSize: { base: '34px', lg: '48px' },
          lineHeight: '0.95',
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
        })}
      >
        {project.title}
      </h3>
      <FeaturedMeta project={project} />
      {project.problem ? (
        <p
          className={css({
            fontFamily: 'body',
            fontSize: 'base',
            lineHeight: '1.5',
            color: 'text',
            marginTop: '12px',
            maxWidth: '50ch',
          })}
        >
          {project.problem}
        </p>
      ) : null}
      <a
        href={recordHref(project)}
        className={css({
          display: 'inline-flex',
          alignItems: 'flex-end',
          gap: '6px',
          minHeight: '44px',
          marginTop: '1',
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'sm',
          color: 'accent',
          paddingBottom: '2px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
          _hover: { color: 'accentAlt', borderBottomColor: 'accentAlt' },
        })}
      >
        Visit {project.title} <span aria-hidden="true">↗</span>
      </a>
    </article>
  )
}
