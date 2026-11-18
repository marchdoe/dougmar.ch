import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedWork({ project }: { project: Project }) {
  const outbound = project.externalUrl ?? project.liveUrl
  return (
    <article
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: 'clamp(20px, 3vw, 32px)',
        marginBottom: 'clamp(40px, 6vw, 72px)',
        display: 'grid',
        gap: 'clamp(16px, 2.4vw, 24px)',
        gridTemplateColumns: { lg: '1.1fr 0.9fr' },
        alignItems: { lg: 'end' },
        columnGap: { lg: 'clamp(32px, 4vw, 64px)' },
      })}
    >
      <a
        href={`/work/${project.slug}`}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '48px',
          paddingBlock: '1',
          justifySelf: 'start',
          fontFamily: 'display',
          fontWeight: 'medium',
          fontSize: 'clamp(40px, 8vw, 88px)',
          lineHeight: '0.98',
          letterSpacing: '-0.015em',
          gridColumn: { lg: '1' },
          gridRow: { lg: '1 / span 2' },
        })}
      >
        {project.title}
      </a>
      <span
        className={css({
          textStyle: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          gridColumn: { lg: '2' },
          gridRow: { lg: '1' },
          alignSelf: { lg: 'start' },
        })}
      >
        {project.type} · {project.year}
      </span>
      <p
        className={css({
          margin: '0',
          fontFamily: 'display',
          textStyle: 'lede',
          lineHeight: 'normal',
          // mockup --textSoft #46391F has no token; nearest semantic ink is textMuted
          color: 'textMuted',
          maxWidth: '46ch',
          gridColumn: { lg: '2' },
          gridRow: { lg: '2' },
        })}
      >
        {project.problem ?? project.description}
      </p>
      {outbound ? (
        <a
          href={outbound}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            minHeight: '44px',
            textStyle: 'sm',
            fontWeight: 'semibold',
            color: 'text',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'field',
            alignSelf: 'start',
            justifySelf: 'start',
            paddingTop: '1',
            gridColumn: { lg: '2' },
            gridRow: { lg: '3' },
            _hover: { color: 'fieldBorder' },
          })}
        >
          Visit {project.title} ↗
        </a>
      ) : null}
    </article>
  )
}
