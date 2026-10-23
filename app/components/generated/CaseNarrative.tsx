import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseNarrative({ project }: { project: Project }) {
  const parts = [
    { label: 'problem', body: project.problem },
    { label: 'approach', body: project.approach },
    { label: 'outcome', body: project.outcome },
  ].filter((part) => Boolean(part.body))
  return (
    <div>
      {parts.map((part) => (
        <div
          key={part.label}
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '6',
            paddingBottom: '3',
            _first: { borderTopWidth: '0', paddingTop: '0' },
          })}
        >
          <h2
            className={css({
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'accent',
              fontWeight: 'bold',
              marginBottom: '12px',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              maxWidth: '50ch',
              fontSize: 'clamp(16px, 1.6vw, 18px)',
              lineHeight: '1.55',
              color: 'textMuted',
            })}
          >
            {part.body}
          </p>
        </div>
      ))}
    </div>
  )
}
