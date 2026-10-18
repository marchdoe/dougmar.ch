import { css } from '../../../styled-system/css'

export function CaseStack({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null
  return (
    <div className={css({ marginTop: '40px' })}>
      <div
        className={css({
          fontSize: '13px',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textFaint',
          marginBottom: '16px',
        })}
      >
        Stack
      </div>
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          listStyle: 'none',
          padding: '0',
          margin: '0',
        })}
      >
        {stack.map((s) => (
          <li
            key={s}
            className={css({
              fontSize: '14px',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: { base: 'accent', _light: 'text' },
              border: '1px solid',
              borderColor: { base: 'border', _light: 'borderStrong' },
              paddingBlock: '6px',
              paddingInline: '10px',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
