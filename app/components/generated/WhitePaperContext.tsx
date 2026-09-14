import { css } from '../../../styled-system/css'

export function WhitePaperContext({
  context,
  constraints,
}: {
  context?: string
  constraints?: string[]
}) {
  if (!context && !constraints) return null
  return (
    <section
      className={css({
        bg: 'surface',
        padding: { base: '8 5', lg: '48px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      {context && (
        <p
          className={css({
            fontSize: 'md',
            color: 'text',
            maxWidth: '66ch',
            marginBottom: constraints ? '5' : '0',
          })}
        >
          {context}
        </p>
      )}
      {constraints && (
        <ul
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            listStyle: 'none',
            padding: 0,
          })}
        >
          {constraints.map((c) => (
            <li
              key={c}
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
                border: '1px solid',
                borderColor: 'border',
                padding: '1 3',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
