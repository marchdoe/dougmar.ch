import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { context?: string; constraints?: string[] }

export function ContextConstraints({ context, constraints }: Props) {
  if (!context && !constraints) return null
  return (
    <Box display="flex" flexDirection="column" gap="3">
      {context && (
        <Box className={css({ textStyle: 'base', color: 'textMuted', maxWidth: '60ch' })}>
          {context}
        </Box>
      )}
      {constraints && (
        <Box
          as="ul"
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            paddingLeft: '0px',
            margin: 0,
            listStyle: 'none',
          })}
        >
          {constraints.map((c) => (
            <Box
              as="li"
              key={c}
              className={css({
                textStyle: 'xs',
                color: 'textMuted',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'full',
                paddingX: '3',
                paddingY: '1',
              })}
            >
              {c}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
