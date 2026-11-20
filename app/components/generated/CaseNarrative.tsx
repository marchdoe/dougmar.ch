import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type CaseProject = (typeof projects)[number]

export function CaseNarrative({ project }: { project: CaseProject }) {
  const parts = [
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((part) => part.body)
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: '4',
        paddingBottom: '8',
        paddingInline: 'clamp(40px, 6vw, 112px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
        columnGap: '7',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {parts.map((part) => (
        <div key={part.label} className={css({ marginTop: '7', minWidth: '0' })}>
          <h2
            className={css({
              fontFamily: 'body',
              fontSize: '2xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'textFaint',
              margin: '0',
              paddingBottom: '2',
              marginBottom: '3',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderColor: 'fieldBorder',
              maxWidth: '50ch',
            })}
          >
            {part.label}
          </h2>
          <p
            className={css({
              fontSize: 'base',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '50ch',
              margin: '0',
            })}
          >
            {part.body}
          </p>
        </div>
      ))}
    </section>
  )
}
