import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseNarrative({ project }: { project: Project }) {
  const parts = [
    { k: 'Problem', v: project.problem ?? project.description ?? '' },
    { k: 'Approach', v: project.approach ?? '' },
    { k: 'Outcome', v: project.outcome ?? '' },
  ].filter((part) => part.v !== '')
  return (
    <div className={css({ marginTop: '40px', display: 'flex', flexDirection: 'column' })}>
      {parts.map((part, i) => (
        <section
          key={part.k}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '260px 1fr' },
            gap: { base: '12px', lg: '30px' },
            paddingBlock: '28px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
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
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              minWidth: '0',
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'lg',
              color: 'text',
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontSize: '2xs',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {part.k}
          </h2>
          <p
            className={css({
              fontFamily: 'body',
              textStyle: 'lede',
              lineHeight: '1.6',
              color: 'text',
              maxWidth: '46ch',
            })}
          >
            {part.v}
          </p>
        </section>
      ))}
    </div>
  )
}
