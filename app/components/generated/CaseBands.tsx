import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

export function CaseBands({ project }: { project: Proj }) {
  const bands = [
    { label: 'Problem', text: project.problem ?? '' },
    { label: 'Approach', text: project.approach ?? '' },
    { label: 'Outcome', text: project.outcome ?? '' },
  ].filter((b) => b.text !== '')
  return (
    <div
      className={css({
        display: 'grid',
        gap: '4',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        paddingBottom: '7',
        bg: 'bg',
      })}
    >
      {bands.map((b) => (
        <section
          key={b.label}
          className={css({
            bg: 'surface',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingTop: '7',
            paddingBottom: '6',
            paddingInline: 'clamp(24px, 4vw, 44px)',
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '200px 1fr' },
            columnGap: '6',
            rowGap: '3',
            alignItems: 'baseline',
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
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '2xs',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'accent',
            })}
          >
            {b.label}
          </h2>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'lede',
              lineHeight: '1.6',
              color: 'text',
              maxWidth: '48ch',
            })}
          >
            {b.text}
          </p>
        </section>
      ))}
    </div>
  )
}
