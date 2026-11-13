import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { label } from './styles'

type Project = (typeof projects)[number]

export function CaseLinks({ project }: { project: Project }) {
  const stack = project.stack ?? []
  return (
    <div
      className={css({
        gridColumn: '1 / -1',
        bg: 'surface',
        paddingBlock: '22px',
        paddingInline: '22px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4',
      })}
    >
      <div className={css({ minWidth: '0' })}>
        <span
          className={cx(label, css({ color: 'textMuted', display: 'block', marginBottom: '2' }))}
        >
          Stack
        </span>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '4',
            rowGap: '1',
          })}
        >
          {stack.map((s) => (
            <li key={s} className={css({ fontSize: 'sm', color: 'text' })}>
              {s}
            </li>
          ))}
        </ul>
      </div>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            paddingInline: '5',
            bg: 'accent',
            color: 'accentText',
            fontSize: '15px',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            _hover: { textDecoration: 'none', bg: 'accentAlt' },
          })}
        >
          Visit the live site ↗
        </a>
      ) : null}
    </div>
  )
}
