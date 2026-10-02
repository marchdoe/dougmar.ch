import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number] & { status?: string }

export function FeaturedWork({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  const meta = [project.role, String(project.year), project.status].filter(Boolean)
  return (
    <div>
      <div
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          textStyle: 'xs',
          fontWeight: 'bold',
          color: 'accent',
          marginBottom: '10px',
        })}
      >
        Featured
      </div>
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: 'clamp(24px, 3vw, 40px)',
          marginBottom: 'clamp(48px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1.2fr 1fr' },
          gridTemplateAreas: { base: 'none', lg: '"title title" "meta problem" "link problem"' },
          alignItems: 'start',
          columnGap: '48px',
          rowGap: { base: '18px', lg: '20px' },
        })}
      >
        <h2
          className={css({
            gridArea: { lg: 'title' },
            fontFamily: 'display',
            fontWeight: 'bold',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: 'clamp(40px, 7vw, 96px)',
            lineHeight: '0.95',
            letterSpacing: '-0.01em',
            color: 'text',
          })}
        >
          {project.title}
        </h2>
        <div
          className={css({
            gridArea: { lg: 'meta' },
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '4',
            rowGap: '1',
            fontFamily: 'body',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textStyle: 'xs',
            color: 'textMuted',
          })}
        >
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        {project.problem && (
          <p
            className={css({
              gridArea: { lg: 'problem' },
              textStyle: 'lede',
              lineHeight: '1.55',
              color: 'textMuted',
              maxWidth: '50ch',
            })}
          >
            {project.problem}
          </p>
        )}
        <a
          href={href}
          className={css({
            gridArea: { lg: 'link' },
            fontWeight: 'bold',
            textStyle: 'sm',
            color: 'accent',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            _hover: { color: 'accentAlt' },
          })}
        >
          View {project.title} →
        </a>
      </div>
    </div>
  )
}
