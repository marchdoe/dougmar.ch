import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]
type Part = { label: string; text: string }

export function CaseNarrative({ project }: { project: Proj }) {
  const parts = [
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
    { label: 'Summary', text: project.description },
  ].filter((p): p is Part => Boolean(p.text))
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {parts.map((part) => (
        <div key={part.label}>
          <h2
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              textTransform: 'lowercase',
              textStyle: 'xl',
              lineHeight: 'tight',
              color: 'text',
              marginBottom: '2',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              margin: '0',
              maxWidth: '46ch',
              fontSize: { base: 'sm', lg: 'base' },
              lineHeight: 'normal',
              color: 'text',
            })}
          >
            {part.text}
          </p>
        </div>
      ))}
    </div>
  )
}
