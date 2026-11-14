import { css } from '../../../styled-system/css'
import type { Project } from './projectFields'

export function StackList({ project }: { project: Project }) {
  const stack = project.stack ?? []
  if (stack.length === 0) return null
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: 'lg',
          color: 'text',
        })}
      >
        Stack
      </h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        })}
      >
        {stack.map((s) => (
          <li
            key={s}
            className={css({
              textStyle: 'sm',
              color: 'text',
              paddingBlock: '6px',
              paddingInline: '12px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'md',
              bg: 'surface',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
