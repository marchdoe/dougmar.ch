import { css } from '../../../styled-system/css'

type Props = { context?: string; constraints?: string[] }

export function WhitePaperContext({ context, constraints }: Props) {
  return (
    <div
      className={css({
        bg: 'bg',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: '7',
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      {context && (
        <div>
          <span
            className={css({
              textStyle: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              display: 'block',
              marginBottom: '3',
            })}
          >
            Context
          </span>
          <p className={css({ textStyle: 'base', color: 'textMuted', maxWidth: '65ch' })}>
            {context}
          </p>
        </div>
      )}
      {constraints && (
        <div>
          <span
            className={css({
              textStyle: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              display: 'block',
              marginBottom: '3',
            })}
          >
            Constraints
          </span>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
              paddingLeft: '5',
            })}
          >
            {constraints.map((c) => (
              <li key={c} className={css({ textStyle: 'sm', color: 'textMuted' })}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
