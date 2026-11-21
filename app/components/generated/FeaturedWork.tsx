import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const linkClass = css({
  textStyle: 'sm',
  fontWeight: 'bold',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'accent',
})

export function FeaturedWork({ project }: { project: Project }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        flexWrap: { md: 'wrap' },
        alignItems: { md: 'flex-start' },
        rowGap: { base: '14px', md: '24px' },
        columnGap: { md: '48px' },
        paddingBlock: '28px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <div className={css({ flex: { md: '1 1 280px' } })}>
        <span
          className={css({
            display: 'block',
            fontSize: 'xs',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'accent',
          })}
        >
          Featured
        </span>
        <h3
          className={css({
            fontFamily: 'display',
            fontSize: 'clamp(44px, 8vw, 96px)',
            lineHeight: '0.9',
            letterSpacing: '.01em',
          })}
        >
          {project.title}
        </h3>
      </div>
      <div
        className={css({
          flex: { md: '1 1 320px' },
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        })}
      >
        <p
          className={css({
            textStyle: 'base',
            lineHeight: '1.55',
            color: 'textMuted',
            maxWidth: '58ch',
          })}
        >
          {project.problem ?? project.description}
        </p>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '24px' })}>
          <a className={linkClass} href={`/work/${project.slug}`}>
            Read the case →
          </a>
          {project.externalUrl ? (
            <a className={linkClass} href={project.externalUrl} rel="noreferrer">
              Visit the site ↗
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
