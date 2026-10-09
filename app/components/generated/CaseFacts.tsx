import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const labelCls = css({
  fontVariant: 'small-caps',
  letterSpacing: 'wider',
  fontSize: 'xs',
  color: 'textFaint',
  minWidth: '9ch',
})
const itemCls = css({
  fontSize: 'sm',
  color: 'textMuted',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
})
const rowCls = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  rowGap: '2',
  columnGap: '20px',
  paddingBlock: '13px',
  borderTop: '1px solid',
  borderColor: 'border',
})

export function CaseFacts({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const clients = project.clients ?? []
  return (
    <div className={css({ marginTop: '6' })}>
      <div className={rowCls}>
        <span className={labelCls}>Stack</span>
        <ul className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '2', columnGap: '20px' })}>
          {stack.map((s) => (
            <li key={s} className={itemCls}>
              {s}
            </li>
          ))}
        </ul>
      </div>
      {clients.length > 0 ? (
        <div className={rowCls}>
          <span className={labelCls}>Clients</span>
          <ul
            className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '2', columnGap: '20px' })}
          >
            {clients.map((c) => (
              <li key={c.name} className={itemCls}>
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '4',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
            fontSize: 'sm',
            color: 'accentAlt',
            borderBottom: '2px solid',
            borderColor: 'accent',
            _hover: { color: 'text' },
          })}
        >
          Visit {project.title} ↗
        </a>
      ) : null}
    </div>
  )
}
