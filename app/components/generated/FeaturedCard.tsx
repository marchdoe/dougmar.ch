import { css } from '../../../styled-system/css'
import type { featuredProject } from '../../content/projects'

type Project = NonNullable<typeof featuredProject>

export function FeaturedCard({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  const summary = project.problem ?? project.description
  return (
    <div
      className={css({
        bg: 'field',
        border: '1px solid',
        borderColor: 'fieldBorder',
        borderRadius: 'md',
        paddingTop: { base: '26px', md: '34px', lg: '44px' },
        paddingBottom: { base: '24px', md: '30px', lg: '38px' },
        paddingInline: { base: '22px', md: '34px', lg: '44px' },
        marginBottom: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      })}
    >
      {/* gold700 kicker substituted with fieldInkMuted for contrast */}
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'fieldInkMuted',
        })}
      >
        Featured · {project.type} · {project.year}
      </span>
      <h3
        className={css({
          fontFamily: 'display',
          fontSize: '22px',
          lineHeight: '1.1',
          fontWeight: 'normal',
          color: 'fieldInk',
          minWidth: '0',
        })}
      >
        {project.title}
      </h3>
      {summary ? (
        <p
          className={css({
            fontSize: 'base',
            lineHeight: '1.55',
            color: 'fieldInkMuted',
            maxWidth: '50ch',
            margin: '0',
          })}
        >
          {summary}
        </p>
      ) : null}
      <a
        href={href}
        className={css({
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2',
          fontSize: 'sm',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'accent',
          paddingBlock: '12px',
          paddingInline: '4px',
          minHeight: '44px',
          _hover: { color: 'accentAlt' },
        })}
      >
        Visit {project.title} →
      </a>
    </div>
  )
}
