import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function ArtifactHead({ project }: { project: Project }) {
  const fields = [String(project.year), project.role, project.description, project.type]
  const meta = Array.from(new Set(fields.filter((f): f is string => Boolean(f))))
    .slice(0, 3)
    .join(' · ')
  return (
    <>
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '13px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          bg: 'bg',
          width: 'fit-content',
          marginBottom: '10px',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        Featured work · {project.title}
      </div>
      {/* type-as-texture: recessed oversized title set in the border azure */}
      <div
        aria-hidden="true"
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: 'border',
          lineHeight: { base: '0.84', md: '0.82' },
          letterSpacing: '-0.03em',
          fontSize: { base: 'clamp(50px, 12vw, 62px)', md: 'clamp(72px, 9.5vw, 148px)' },
          marginLeft: '-0.03em',
          marginBottom: { base: '-0.12em', md: '-0.14em' },
          whiteSpace: 'nowrap',
          position: 'relative',
          zIndex: 0,
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {project.title}
      </div>
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '14px',
          color: 'text',
          bg: 'bg',
          width: 'fit-content',
          letterSpacing: '0.02em',
          marginBottom: 'clamp(24px, 4vw, 38px)',
          position: 'relative',
          zIndex: 1,
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {meta}
      </div>
    </>
  )
}
