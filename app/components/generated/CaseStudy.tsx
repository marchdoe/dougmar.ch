import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseFacts } from './CaseFacts'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  const parts = [
    { label: 'Overview', body: project.description },
    { label: 'Problem', body: project.problem },
    { label: 'Approach', body: project.approach },
    { label: 'Outcome', body: project.outcome },
  ].filter((p) => Boolean(p.body))
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 80px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1.5fr) minmax(240px, 1fr)' },
        gap: '7',
        alignItems: 'start',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          bg: 'surface',
          padding: 'clamp(20px, 3vw, 40px)',
          '& > div:first-child h2': { marginTop: '0' },
        })}
      >
        {parts.map((part) => (
          <div key={part.label}>
            <h2
              className={css({
                textStyle: 'sm',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'accent',
                fontWeight: 'bold',
                marginTop: '6',
                marginBottom: '3',
              })}
            >
              {part.label}
            </h2>
            <p
              className={css({
                textStyle: 'base',
                color: 'text',
                maxWidth: '50ch',
                lineHeight: 'loose',
              })}
            >
              {part.body}
            </p>
          </div>
        ))}
      </div>
      <CaseFacts project={project} />
    </section>
  )
}
