import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Part = { label: string; body: string }

function isFilled(s: { label: string; body?: string }): s is Part {
  return Boolean(s.body)
}

function narrativeOf(p: Project): Part[] {
  const parts = [
    { label: 'Problem', body: p.problem },
    { label: 'Approach', body: p.approach },
    { label: 'Outcome', body: p.outcome },
  ].filter(isFilled)
  return parts.length > 0 ? parts : [{ label: 'Notes', body: p.description }].filter(isFilled)
}

export function CaseNarrative({ project }: { project: Project }) {
  return (
    <section
      aria-label="The case"
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(auto-fit, minmax(240px, 1fr))' },
        columnGap: 'clamp(24px, 3vw, 40px)',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        marginTop: { base: '0', lg: '6' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {narrativeOf(project).map((part) => (
        <article
          key={part.label}
          className={css({
            paddingTop: '6',
            paddingBottom: '6',
            paddingRight: { base: '0', lg: '24px' },
            borderBottom: { base: '1px solid', lg: 'none' },
            borderRight: { base: 'none', lg: '1px solid' },
            borderColor: 'border',
            minWidth: '0',
            _last: { borderRight: 'none' },
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              textStyle: 'md',
              color: 'accent',
              marginBottom: '3',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              fontFamily: 'display',
              textStyle: 'base',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '50ch',
            })}
          >
            {part.body}
          </p>
        </article>
      ))}
    </section>
  )
}
