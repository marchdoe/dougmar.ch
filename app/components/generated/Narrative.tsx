import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function Narrative({ project }: { project: Project }) {
  const parts = [
    { label: 'Overview', text: project.description ?? '' },
    { label: 'Problem', text: project.problem ?? '' },
    { label: 'Approach', text: project.approach ?? '' },
    { label: 'Outcome', text: project.outcome ?? '' },
  ].filter((p) => p.text !== '')
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '7', minWidth: '0' })}>
      {parts.map((part) => (
        <div key={part.label}>
          <h2
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: 'xl',
              lineHeight: '1.05',
              letterSpacing: '-0.015em',
              color: 'text',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              marginTop: '3',
              maxWidth: '56ch',
              fontFamily: 'body',
              fontSize: 'base',
              lineHeight: '1.6',
              color: 'textMuted',
            })}
          >
            {part.text}
          </p>
        </div>
      ))}
    </div>
  )
}
