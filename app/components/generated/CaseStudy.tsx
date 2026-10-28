import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  const narrative = [
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((n) => n.body !== '')
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 6vw, 112px)',
        paddingInline: 'clamp(24px, 5vw, 80px)',
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
      {narrative.map((n) => (
        <article
          key={n.label}
          className={css({ bg: 'surface', padding: 'clamp(24px, 4vw, 56px)' })}
        >
          <h2
            className={css({
              fontSize: 'sm',
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'widest',
              color: 'textMuted',
              marginBottom: '3',
            })}
          >
            {n.label}
          </h2>
          <p
            className={css({
              fontSize: 'lede',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '58ch',
            })}
          >
            {n.body}
          </p>
        </article>
      ))}
      {stack.length > 0 ? (
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
                fontSize: 'sm',
                color: 'textMuted',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                paddingBlock: '1',
                paddingInline: '3',
              })}
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className={css({
            alignSelf: 'flex-start',
            fontSize: 'base',
            color: 'text',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'accent',
            _hover: { color: 'accent' },
          })}
        >
          Visit {project.title} ↗
        </a>
      ) : null}
    </section>
  )
}
