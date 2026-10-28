import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedProject({ project }: { project: Project }) {
  const summary = project.problem ?? project.description ?? ''
  const external = project.externalUrl ?? project.liveUrl
  const linkStyle = css({
    fontSize: 'sm',
    color: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    textDecorationLine: 'underline',
    textDecorationColor: { base: 'accent', _light: 'accentAlt' },
    textUnderlineOffset: '5px',
    transition: 'color .2s ease',
    _hover: { color: { base: 'accent', _light: 'accentAlt' } },
  })
  return (
    <div
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderColor: 'borderStrong',
        paddingTop: '22px',
      })}
    >
      <span
        className={css({
          display: 'block',
          fontSize: 'xs',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: { base: 'accent', _light: 'accentAlt' },
          marginBottom: '2',
        })}
      >
        Featured
      </span>
      <h2
        className={css({
          fontFamily: 'display',
          textStyle: '2xl',
          lineHeight: '1',
          marginBottom: '3',
        })}
      >
        {project.title}
      </h2>
      {summary ? (
        <p
          className={css({
            fontSize: 'base',
            lineHeight: 'normal',
            color: { base: 'textMuted', _light: 'fieldInkMuted' },
            maxWidth: '46ch',
            marginBottom: '2',
          })}
        >
          {summary}
        </p>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '0' })}>
        <a href={`/work/${project.slug}`} className={linkStyle}>
          Read the project →
        </a>
        {external ? (
          <a href={external} target="_blank" rel="noreferrer" className={linkStyle}>
            Visit {project.title} ↗
          </a>
        ) : null}
      </div>
    </div>
  )
}
