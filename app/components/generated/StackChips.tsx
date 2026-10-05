import { css } from '../../../styled-system/css'

export function StackChips({ stack }: { stack: string[] | undefined }) {
  const list = stack ?? []
  if (list.length === 0) return null
  return (
    <div className={css({ marginTop: '32px' })}>
      <span
        className={css({
          display: 'block',
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginBottom: '10px',
        })}
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
          gap: '8px',
        })}
      >
        {list.map((s) => (
          <li
            key={s}
            className={css({
              fontSize: 'sm',
              color: 'fieldInk',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'fieldBorder',
              paddingBlock: '4px',
              paddingInline: '12px',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
