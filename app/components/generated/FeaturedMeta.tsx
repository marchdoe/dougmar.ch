import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5ch',
  color: 'text',
  bg: 'bg',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
  paddingBlock: '8px',
  minHeight: '44px',
  marginRight: '24px',
  _hover: { color: 'accentAlt' },
})

function OutboundLink({ url }: { url: string | undefined }) {
  if (!url) return null
  return (
    <a href={url} className={linkClass}>
      Visit the live site <span aria-hidden="true">↗</span>
    </a>
  )
}

export function FeaturedMeta({ project }: { project: Project | undefined }) {
  if (!project) return null
  const summary = project.problem ?? project.description
  return (
    <div
      className={css({
        gridColumn: { lg: '1 / 5' },
        gridRow: { lg: '4' },
        marginTop: { lg: 'clamp(30px, 5vh, 52px)' },
        maxWidth: '60ch',
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      <p
        className={css({
          margin: '0',
          marginBottom: '14px',
          fontSize: 'base',
          color: 'text',
          lineHeight: '1.55',
          maxWidth: '48ch',
        })}
      >
        {/* eyebrow in text ink on a flat bg box; accentAlt on bg reads under 4.5:1 */}
        <span
          className={css({
            display: 'block',
            width: 'fit-content',
            bg: 'bg',
            paddingBlock: '2px',
            paddingInline: '8px',
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'accent',
            fontSize: 'sm',
            fontWeight: 'bold',
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: 'text',
            marginBottom: '12px',
          })}
        >
          The practice
        </span>
        {summary}
      </p>
      <a href={`/work/${project.slug}`} className={linkClass}>
        Open the case study <span aria-hidden="true">↗</span>
      </a>
      <OutboundLink url={project.externalUrl ?? project.liveUrl} />
    </div>
  )
}
