import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function buildMeta(project: Project): string {
  const extra = project as unknown as Record<string, unknown>
  const parts = [
    project.type,
    String(project.year),
    str(extra.role),
    str(extra.timeline),
    str(extra.status),
  ]
    .map((v) => v.replace(/\s*[\u2014\u2013]\s*/g, ' to ').trim())
    .filter(Boolean)
  return Array.from(new Set(parts)).join(' · ')
}

export function CaseHeader({ project }: { project: Project }) {
  const meta = buildMeta(project)
  return (
    <section
      className={css({
        position: 'relative',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: 'clamp(32px, 5vw, 64px)',
      })}
    >
      <div
        className={css({
          fontSize: '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
          marginBottom: '20px',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        case study
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: '600',
          fontSize: 'clamp(34px, 6vw, 64px)',
          letterSpacing: '-0.03em',
          lineHeight: '1',
          color: 'text',
          textTransform: 'lowercase',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          fontSize: '13px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginTop: '14px',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {meta}
      </div>
      <hr
        className={css({
          height: '2px',
          bg: 'borderStrong',
          borderWidth: '0',
          marginTop: 'clamp(32px, 4vw, 48px)',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      />
    </section>
  )
}
