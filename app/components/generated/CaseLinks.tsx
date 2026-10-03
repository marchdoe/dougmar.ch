import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const link = css({
  fontSize: 'sm',
  color: 'text',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  _hover: { color: 'accentAlt', borderBottomColor: 'accentAlt' },
})

export function CaseLinks({ project }: { project: Project }) {
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      })}
    >
      <div
        className={css({
          fontSize: 'xs',
          fontWeight: '500',
          textTransform: 'lowercase',
          letterSpacing: '0.2em',
          color: 'textMuted',
        })}
      >
        in the bag
      </div>
      <ul
        className={css({
          listStyle: 'none',
          padding: '0',
          margin: '0',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '8px',
          columnGap: '20px',
        })}
      >
        {stack.map((s) => (
          <li
            key={s}
            className={css({ fontSize: 'sm', color: 'text', textTransform: 'lowercase' })}
          >
            {s}
          </li>
        ))}
      </ul>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '24px', rowGap: '8px' })}>
        {project.liveUrl ? (
          <a href={project.liveUrl} className={link}>
            visit the live site
          </a>
        ) : null}
        {project.githubUrl ? (
          <a href={project.githubUrl} className={link}>
            source on github
          </a>
        ) : null}
      </div>
    </section>
  )
}
