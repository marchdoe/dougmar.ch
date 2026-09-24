import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function blocksFor(project: Project) {
  return [
    { label: 'Problem', text: project.problem ?? '' },
    { label: 'Approach', text: project.approach ?? '' },
    { label: 'Outcome', text: project.outcome ?? '' },
    { label: 'Notes', text: project.description ?? '' },
  ].filter((block) => block.text !== '')
}

export function CaseBody({ project }: { project: Project }) {
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        paddingTop: { base: '72px', xl: '96px' },
        paddingBottom: { base: '72px', xl: '96px' },
        paddingInline: '6vw',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        display: 'grid',
        gap: '48px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {blocksFor(project).map((block) => (
        <div key={block.label} className={css({ display: 'grid', gap: '12px' })}>
          <h2
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              fontWeight: 600,
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wide',
              color: 'accent',
            })}
          >
            {block.label}
          </h2>
          <p
            className={css({
              fontFamily: 'display',
              fontSize: { base: 'base', md: 'md' },
              lineHeight: '1.5',
              color: 'text',
              maxWidth: '46ch',
            })}
          >
            {block.text}
          </p>
        </div>
      ))}
      {stack.length > 0 ? (
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '8px' })}>
          {stack.map((item) => (
            <span
              key={item}
              className={css({
                paddingBlock: '6px',
                paddingInline: '12px',
                borderRadius: 'sm',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'borderStrong',
                bg: 'surface',
                fontFamily: 'body',
                fontSize: 'sm',
                fontWeight: 600,
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wide',
                color: 'text',
              })}
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
