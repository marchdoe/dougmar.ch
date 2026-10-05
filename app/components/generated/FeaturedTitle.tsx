import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedTitle({ project }: { project: Project | undefined }) {
  if (!project) return null
  const line = [project.role, String(project.year), project.type].filter(Boolean).join(' · ')
  return (
    <div
      className={css({
        gridColumn: { lg: '1 / 9' },
        gridRow: { lg: '3' },
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '0',
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      {/* eyebrow set in text ink on a flat bg box so it clears 4.5:1 over the ruled ground; coral kept as the rule */}
      <span
        className={css({
          display: 'block',
          width: 'fit-content',
          alignSelf: 'flex-start',
          bg: 'bg',
          paddingBlock: '2px',
          paddingInline: '8px',
          borderLeftWidth: '3px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'accent',
          fontSize: 'sm',
          fontWeight: 'bold',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'text',
        })}
      >
        Featured, the proof
      </span>
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'all-small-caps',
          letterSpacing: '0.015em',
          lineHeight: '0.92',
          fontSize: { base: 'hero', xl: '118px' },
          color: 'text',
        })}
      >
        <a href={`/work/${project.slug}`}>{project.title}</a>
      </div>
      <div
        className={css({
          width: 'fit-content',
          maxWidth: '100%',
          bg: 'bg',
          fontFamily: 'body',
          fontSize: 'md',
          color: 'textMuted',
          letterSpacing: '0.02em',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {line}
      </div>
    </div>
  )
}
