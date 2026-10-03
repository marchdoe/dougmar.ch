import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const parts = [
    { label: 'the problem', body: project.problem },
    { label: 'the approach', body: project.approach },
    { label: 'the outcome', body: project.outcome },
    { label: 'in short', body: project.description },
  ].filter((p) => Boolean(p.body))
  return (
    <div
      className={css({
        maxWidth: { base: '720px', lg: '920px' },
        marginInline: 'auto',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: '64px',
        boxSizing: 'content-box',
      })}
    >
      {parts.map((part) => (
        <section
          key={part.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '300px minmax(0, 1fr)' },
            columnGap: '48px',
            alignItems: 'start',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
            paddingTop: '24px',
            paddingBottom: '40px',
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
              textStyle: 'lg',
              textTransform: 'lowercase',
              color: 'text',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              fontSize: { base: 'base', lg: 'lede' },
              color: 'textMuted',
              maxWidth: '50ch',
              marginTop: { base: '12px', lg: '0' },
            })}
          >
            {part.body}
          </p>
        </section>
      ))}
      <CaseLinks project={project} />
    </div>
  )
}
