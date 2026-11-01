import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedCard({ project }: { project: Project }) {
  const external = project.liveUrl ?? project.externalUrl
  const linkClass = css({
    alignSelf: 'flex-start',
    fontSize: 'sm',
    fontWeight: 'bold',
    letterSpacing: 'wide',
    textTransform: 'uppercase',
    color: 'text',
    paddingBlock: '3',
    paddingInline: '5',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'borderStrong',
    minHeight: '44px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background 0.2s ease, color 0.2s ease',
    _hover: { bg: 'accent', color: 'accentText', borderColor: 'accent' },
  })
  return (
    <article
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
        padding: { base: '5', lg: '6' },
        bg: 'surface',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'lg',
        marginBottom: { base: '6', lg: '7' },
        minWidth: '0',
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
        })}
      >
        {project.type} · {project.year}
      </span>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: '36px', lg: '46px' },
          lineHeight: 'tight',
          color: 'text',
        })}
      >
        {project.title}
      </h3>
      {project.problem ? (
        <p
          className={css({
            fontSize: 'lede',
            lineHeight: 'loose',
            color: 'textMuted',
            maxWidth: '50ch',
          })}
        >
          {project.problem}
        </p>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3', marginTop: '1' })}>
        <a href={`/work/${project.slug}`} className={linkClass}>
          Open case →
        </a>
        {external ? (
          <a href={external} className={linkClass}>
            Visit site ↗
          </a>
        ) : null}
      </div>
    </article>
  )
}
