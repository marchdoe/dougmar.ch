import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Props = { role?: string; stack?: string[]; liveUrl?: string }

export function WorkMeta({ role, stack, liveUrl }: Props) {
  return (
    <Box
      className={css({
        bg: 'bg',
        paddingInline: { base: '5', lg: '9' },
        paddingBottom: { base: '8', lg: '9' },
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6',
        alignItems: 'center',
      })}
    >
      {role && (
        <p className={css({ textStyle: 'sm', color: 'text' })}>
          <span className={css({ color: 'textFaint' })}>Role </span>
          {role}
        </p>
      )}
      {stack && stack.length > 0 && (
        <p className={css({ textStyle: 'sm', color: 'textMuted' })}>{stack.join(' · ')}</p>
      )}
      {liveUrl && (
        <a
          href={liveUrl}
          rel="noopener"
          className={css({
            textStyle: 'sm',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'accentText',
            bg: 'accent',
            paddingInline: '5',
            paddingBlock: '3',
          })}
        >
          Visit live ↗
        </a>
      )}
    </Box>
  )
}
