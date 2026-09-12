import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Props = { problem?: string; approach?: string; outcome?: string }

export function WorkNarrative({ problem, approach, outcome }: Props) {
  return (
    <Box
      className={css({
        bg: 'bg',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: { base: '8', lg: '9' },
        display: 'flex',
        flexDirection: 'column',
        gap: '7',
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      {problem && (
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
            Problem
          </span>
          <p
            className={css({
              fontFamily: 'display',
              textStyle: 'lg',
              color: 'textMuted',
              maxWidth: '62ch',
            })}
          >
            {problem}
          </p>
        </div>
      )}
      {approach && (
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
            Approach
          </span>
          <p className={css({ textStyle: 'base', color: 'textMuted', maxWidth: '62ch' })}>
            {approach}
          </p>
        </div>
      )}
      {outcome && (
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
            Outcome
          </span>
          <p className={css({ textStyle: 'base', color: 'textMuted', maxWidth: '62ch' })}>
            {outcome}
          </p>
        </div>
      )}
    </Box>
  )
}
