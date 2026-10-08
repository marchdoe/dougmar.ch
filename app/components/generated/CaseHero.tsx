import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

export function CaseHero({ project }: { project: CaseProject }) {
  const facts = [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
  ].filter((f) => Boolean(f.value))
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 6vw, 96px)',
        paddingTop: 'clamp(36px, 5vw, 72px)',
        paddingBottom: 'clamp(40px, 5vw, 80px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(40px, 5.4vw, 78px)',
          letterSpacing: 'tight',
          lineHeight: '0.95',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr 1fr', md: 'repeat(5, minmax(0, 1fr))' },
          columnGap: '5',
          marginTop: '6',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {facts.map((f) => (
          <div
            key={f.label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingBlock: '12px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              minWidth: '0',
            })}
          >
            <span
              className={css({
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'textMuted',
                fontWeight: 'bold',
              })}
            >
              {f.label}
            </span>
            <span className={css({ fontFamily: 'display', fontWeight: 'bold', fontSize: 'base' })}>
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
