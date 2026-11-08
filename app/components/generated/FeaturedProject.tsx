import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedProject() {
  if (!featuredProject) return null
  const project = featuredProject
  const body = [project.problem, project.description].find(Boolean)
  const links = [
    { label: 'Read the project →', href: `/work/${project.slug}` },
    { label: 'See it live →', href: [project.liveUrl, project.externalUrl].find(Boolean) },
  ].filter((link) => link.href)

  return (
    <article
      className={css({
        bg: 'field',
        color: 'surface',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gap: '18px',
        gridTemplateColumns: { lg: '1.1fr 1fr' },
        alignItems: { lg: 'center' },
        padding: 'clamp(32px,4vw,56px)',
        marginTop: '28px',
        marginBottom: '36px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'bold',
          color: 'fieldInk',
        })}
      >
        Featured
      </span>
      <div>
        <h3
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            fontSize: 'clamp(40px,7vw,86px)',
            lineHeight: '0.88',
            color: 'fieldInk',
            letterSpacing: '0.005em',
          })}
        >
          {project.title}
        </h3>
        <div
          className={css({
            textStyle: 'sm',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'fieldInkMuted',
          })}
        >
          {project.type} · {project.year}
        </div>
      </div>
      <p
        className={css({
          fontSize: 'clamp(20px,2.6vw,28px)',
          lineHeight: '1.5',
          maxWidth: '52ch',
          color: 'surface',
        })}
      >
        {body}
      </p>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '28px',
          gridColumn: { lg: '1 / -1' },
        })}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={css({
              fontFamily: 'display',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              textStyle: 'lg',
              color: 'fieldInk',
              display: 'inline-flex',
              alignItems: 'center',
              paddingBlock: '6px',
              minHeight: '44px',
            })}
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  )
}
