import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

const outLink = css({
  fontFamily: 'body',
  fontWeight: '500',
  fontSize: 'sm',
  color: 'accentAlt',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
})

export function CaseStack({ project }: { project: Proj }) {
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(40px, 6vh, 88px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        display: 'grid',
        gap: '5',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(26px, 3.4vw, 38px)',
          color: 'text',
        })}
      >
        Stack
      </h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {stack.map((s) => (
          <li
            key={s}
            className={css({
              bg: 'surface',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
              fontFamily: 'body',
              fontSize: 'sm',
              color: 'text',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6', rowGap: '0' })}>
        {project.liveUrl && (
          <a href={project.liveUrl} className={outLink} target="_blank" rel="noreferrer">
            Visit the live site&nbsp;↗
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} className={outLink} target="_blank" rel="noreferrer">
            Source on GitHub&nbsp;↗
          </a>
        )}
      </div>
    </section>
  )
}
