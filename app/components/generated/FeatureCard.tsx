import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const goLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginTop: '5',
  marginRight: '6',
  textStyle: 'sm',
  fontWeight: 'bold',
  letterSpacing: 'wide',
  color: 'accentAlt',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

export function FeatureCard({ project }: { project: Project }) {
  const meta = [project.role, String(project.year), project.type].filter(Boolean).join(' · ')
  return (
    <div
      className={css({
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'sm',
        padding: 'clamp(22px, 3vw, 42px)',
        marginBottom: 'clamp(12px, 1.4vw, 24px)',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '4xl',
          lineHeight: '0.98',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        {project.title}
      </div>
      <div
        className={css({
          textStyle: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginTop: '3',
        })}
      >
        {meta}
      </div>
      <p
        className={css({
          textStyle: 'lede',
          color: 'textMuted',
          maxWidth: '58ch',
          marginTop: '4',
          lineHeight: 'normal',
        })}
      >
        {project.problem}
      </p>
      <div className={css({ display: 'flex', flexWrap: 'wrap' })}>
        <a href={`/work/${project.slug}`} className={goLink}>
          Read the {project.title} case →
        </a>
        {project.externalUrl ? (
          <a href={project.externalUrl} className={goLink}>
            Open {project.title} ↗
          </a>
        ) : null}
      </div>
    </div>
  )
}
