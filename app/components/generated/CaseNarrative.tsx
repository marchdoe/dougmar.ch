import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Entry = (typeof projects)[number]
type Part = [string, string | undefined]

function isPart(p: Part): p is [string, string] {
  return typeof p[1] === 'string' && p[1] !== ''
}

export function CaseNarrative({ project }: { project: Entry }) {
  const parts: Part[] = [
    ['Overview', project.description],
    ['Problem', project.problem],
    ['Approach', project.approach],
    ['Outcome', project.outcome],
  ]
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          lg: 'repeat(auto-fit, minmax(280px, 1fr))',
        },
        columnGap: '7',
        rowGap: '6',
      })}
    >
      {parts.filter(isPart).map(([label, text]) => (
        <div
          key={label}
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '4',
          })}
        >
          <h2
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: { base: 'accent', _light: 'accentAlt' },
              marginBottom: '3',
            })}
          >
            {label}
          </h2>
          <p
            className={css({
              fontFamily: 'display',
              fontSize: 'lede',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '50ch',
            })}
          >
            {text}
          </p>
        </div>
      ))}
    </div>
  )
}
