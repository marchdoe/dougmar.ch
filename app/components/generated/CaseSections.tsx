import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseSections({ project }: { project: Project }) {
  const sections = [
    { head: 'Summary', body: project.description },
    { head: 'Problem', body: project.problem },
    { head: 'Approach', body: project.approach },
    { head: 'Outcome', body: project.outcome },
  ].filter((s) => Boolean(s.body))
  return (
    <div>
      {sections.map((s) => (
        <section
          key={s.head}
          className={css({
            marginTop: '5',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '3',
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: '2xl',
              lineHeight: '1',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
            })}
          >
            {s.head}
          </h2>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'base',
              lineHeight: '1.55',
              color: 'text',
              marginTop: '3',
              maxWidth: '48ch',
            })}
          >
            {s.body}
          </p>
        </section>
      ))}
    </div>
  )
}

export function CaseLinks({ project }: { project: Project }) {
  const stack = project.stack ?? []
  return (
    <div className={css({ marginTop: '6' })}>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {stack.map((s) => (
          <span
            key={s}
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              bg: 'surface',
              paddingInline: '2',
              paddingBlock: '1',
            })}
          >
            {s}
          </span>
        ))}
      </div>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'flex-end',
            gap: '6px',
            minHeight: '44px',
            marginTop: '3',
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
      ) : null}
    </div>
  )
}
