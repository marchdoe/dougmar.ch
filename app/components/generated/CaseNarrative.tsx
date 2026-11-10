import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseNarrative({ project }: { project: Project }) {
  const rows: Array<[string, string]> = [
    ['Problem', project.problem ?? ''],
    ['Approach', project.approach ?? ''],
    ['Outcome', project.outcome ?? ''],
  ]
  const shown = rows.filter((r) => r[1] !== '')
  return (
    <section
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
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
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {shown.map((r) => (
          <div
            key={r[0]}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '1fr 2fr' },
              columnGap: 'clamp(24px, 4vw, 64px)',
              rowGap: '8px',
              alignItems: 'baseline',
              paddingBlock: 'clamp(20px, 3vw, 40px)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <h2
              className={css({
                fontFamily: { base: 'body', lg: 'display' },
                fontSize: { base: '2xs', lg: '3xl' },
                lineHeight: { base: 'normal', lg: 'tight' },
                letterSpacing: { base: '0.18em', lg: '-0.01em' },
                textTransform: { base: 'uppercase', lg: 'lowercase' },
                color: 'accentAlt',
                fontWeight: 'bold',
              })}
            >
              {r[0]}
            </h2>
            <p
              className={css({
                fontSize: { base: 'base', lg: 'lede' },
                color: 'text',
                maxWidth: '50ch',
                lineHeight: '1.55',
              })}
            >
              {r[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
