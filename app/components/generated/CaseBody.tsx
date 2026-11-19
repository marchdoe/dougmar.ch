import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const blocks = [
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((b) => b.body !== '')
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        paddingInline: '6vw',
        paddingTop: '6',
        paddingBottom: { base: '44px', lg: '60px' },
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
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
          columnGap: '48px',
        })}
      >
        {blocks.map((b) => (
          <div key={b.label} className={css({ minWidth: '0' })}>
            <h2
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: 'lg',
                letterSpacing: '0.02em',
                color: 'text',
                marginTop: '7',
                marginBottom: '3',
                borderBottom: '1px solid',
                borderColor: 'borderStrong',
                paddingBottom: '2',
              })}
            >
              {b.label}
            </h2>
            <p
              className={css({
                fontSize: 'base',
                lineHeight: 'normal',
                color: 'text',
                maxWidth: '50ch',
              })}
            >
              {b.body}
            </p>
          </div>
        ))}
      </div>
      <CaseLinks project={project} />
    </section>
  )
}
