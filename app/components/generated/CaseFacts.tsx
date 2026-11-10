import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function extra(p: Project, key: string): string {
  const v: unknown = (p as unknown as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

export function CaseFacts({ project }: { project: Project }) {
  const rows = [
    ['Type', project.type],
    ['Year', String(project.year)],
    ['Role', project.role ?? ''],
    ['Timeline', extra(project, 'timeline')],
    ['Status', extra(project, 'status')],
    ['Stack', (project.stack ?? []).join(', ')],
  ].filter((r) => r[1] !== '')
  return (
    <section
      className={css({
        paddingBottom: 'clamp(48px, 7vw, 112px)',
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
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
          columnGap: 'clamp(20px, 3vw, 36px)',
          bg: 'bg',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          borderRadius: 'sm',
          padding: 'clamp(24px, 3.4vw, 44px)',
        })}
      >
        {rows.map((r) => (
          <div
            key={r[0]}
            className={css({
              paddingBlock: '12px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <div
              className={css({
                fontSize: '2xs',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'textFaint',
                fontWeight: 'bold',
                marginBottom: '4px',
              })}
            >
              {r[0]}
            </div>
            <div className={css({ fontSize: 'base', color: 'text', fontWeight: 'bold' })}>
              {r[1]}
            </div>
          </div>
        ))}
      </div>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '24px',
            fontWeight: 'bold',
            color: 'accentAlt',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'accent',
            fontSize: '15px',
          })}
        >
          Visit the live site ↗
        </a>
      ) : null}
    </section>
  )
}
