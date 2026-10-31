import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseLinks({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: { base: '6', lg: '7' },
        paddingInline: { base: '5', md: '7', xl: '8' },
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
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
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'lowercase',
          color: 'accent',
        })}
      >
        stack
      </span>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {stack.map((item) => (
          <span
            key={item}
            className={css({
              fontSize: 'sm',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
              paddingInline: '3',
              paddingBlock: '1',
            })}
          >
            {item}
          </span>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '4',
        })}
      >
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontSize: 'sm',
              fontWeight: 'bold',
              color: 'accent',
            })}
          >
            visit the live build ↗
          </a>
        ) : null}
        {next ? (
          <a
            href={`/work/${next.slug}`}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'accent',
              textTransform: 'lowercase',
            })}
          >
            next: {next.title} →
          </a>
        ) : null}
      </div>
    </section>
  )
}
