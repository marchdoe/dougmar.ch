import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedCard({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  const meta = [project.role, project.type, String(project.year)].filter(Boolean).join(' · ')
  return (
    <article
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.1fr 1fr' },
        alignItems: { lg: 'center' },
        gap: 'clamp(20px, 3vw, 48px)',
        bg: 'bg',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderRadius: 'sm',
        padding: 'clamp(24px, 3.4vw, 44px)',
        marginBottom: 'clamp(24px, 3vw, 40px)',
      })}
    >
      <div>
        <div
          className={css({
            fontSize: '2xs',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'accentAlt',
            fontWeight: 'bold',
            marginBottom: '14px',
          })}
        >
          Featured
        </div>
        <h3
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(30px, 5vw, 56px)',
            lineHeight: '0.98',
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            marginBottom: '8px',
          })}
        >
          {project.title}
        </h3>
        <div
          className={css({
            fontSize: '2xs',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'textFaint',
            fontWeight: 'bold',
          })}
        >
          {meta}
        </div>
      </div>
      <div>
        <p
          className={css({
            fontSize: 'base',
            color: 'textMuted',
            maxWidth: '50ch',
            marginBottom: '20px',
          })}
        >
          {project.problem ?? project.description}
        </p>
        <a
          href={href}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '44px',
            fontWeight: 'bold',
            color: 'accentAlt',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'accent',
            paddingBlock: '6px',
            fontSize: '15px',
          })}
        >
          Read the case ↗
        </a>
      </div>
    </article>
  )
}
