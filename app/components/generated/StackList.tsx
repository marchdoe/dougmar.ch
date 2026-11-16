import { css } from '../../../styled-system/css'

export function StackList({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null
  return (
    <div>
      <h2
        className={css({
          marginTop: '6',
          marginBottom: '3',
          textStyle: 'sm',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: { base: 'accent', _light: 'accentAlt' },
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
          columnGap: '4',
          rowGap: '2',
        })}
      >
        {stack.map((item) => (
          <li
            key={item}
            className={css({
              textStyle: 'sm',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
