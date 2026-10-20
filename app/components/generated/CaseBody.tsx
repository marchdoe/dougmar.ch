import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const lead = project.problem ?? project.description
  const rows = [
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ].filter((r) => Boolean(r.text))
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: 'clamp(48px, 6vw, 88px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {lead ? (
        <div className={css({ marginBottom: 'clamp(28px, 4vw, 48px)' })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: '13px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
              marginBottom: '10px',
            })}
          >
            Problem
          </h2>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'md',
              color: 'text',
              lineHeight: '1.5',
              maxWidth: '48ch',
            })}
          >
            {lead}
          </p>
        </div>
      ) : null}
      {rows.map((row) => (
        <div
          key={row.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '140px minmax(0, 1fr)' },
            columnGap: '24px',
            rowGap: '6px',
            paddingBlock: '18px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: '13px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {row.label}
          </h2>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'base',
              color: 'text',
              lineHeight: '1.55',
              maxWidth: '50ch',
            })}
          >
            {row.text}
          </p>
        </div>
      ))}
    </section>
  )
}
