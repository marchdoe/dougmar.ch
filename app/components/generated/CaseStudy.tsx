import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseFacts } from './CaseFacts'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  const story = [
    { label: 'Problem', text: project.problem ?? '' },
    { label: 'Approach', text: project.approach ?? '' },
    { label: 'Outcome', text: project.outcome ?? '' },
    { label: 'Summary', text: project.description ?? '' },
  ].filter((s) => s.text !== '')
  return (
    <section
      className={css({
        paddingBlock: '6',
        paddingInline: '24px',
        lg: { paddingBlock: '7', paddingInline: '4vw' },
        xl: { paddingInline: '5vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {story.map((s) => (
        <div
          key={s.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            rowGap: '3',
            columnGap: '2vw',
            paddingBlock: '26px',
            borderTop: '1px solid',
            borderColor: 'border',
            lg: { gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' },
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: { base: 'xl', lg: '3xl' },
              lineHeight: 'snug',
              color: 'text',
            })}
          >
            {s.label}
          </h2>
          <p
            className={css({
              maxWidth: '48ch',
              fontSize: 'base',
              lineHeight: 'normal',
              color: 'textMuted',
            })}
          >
            {s.text}
          </p>
        </div>
      ))}
      <CaseFacts project={project} />
    </section>
  )
}
