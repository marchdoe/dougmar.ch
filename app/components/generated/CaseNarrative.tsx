import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Part = { label: string; body: string }

export function CaseNarrative({ project }: { project: Project }) {
  const parts = [
    { label: 'problem', body: project.problem },
    { label: 'approach', body: project.approach },
    { label: 'outcome', body: project.outcome },
  ].filter((part): part is Part => typeof part.body === 'string' && part.body !== '')
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {parts.map((part) => (
        <div
          key={part.label}
          className={css({
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
            paddingTop: '5',
            display: 'grid',
            gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '200px minmax(0, 1fr)' },
            gap: '4',
          })}
        >
          <h2
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'lowercase',
              color: 'accent',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              margin: '0',
              fontSize: { base: 'base', lg: 'lede' },
              lineHeight: '1.55',
              color: 'text',
              maxWidth: '56ch',
            })}
          >
            {part.body}
          </p>
        </div>
      ))}
    </section>
  )
}
