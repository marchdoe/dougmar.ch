import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { identity } from '../../content/about'

export function AboutHero() {
  return (
    <Box
      as="header"
      className={css({
        bg: 'field',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: { base: '8', lg: '9' },
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'fieldInkMuted',
          display: 'block',
          marginBottom: '5',
        })}
      >
        {identity.name} · {identity.role}
      </span>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'lg',
          lineHeight: 'normal',
          color: 'fieldInk',
          maxWidth: '48ch',
        })}
      >
        {identity.statement}
      </p>
    </Box>
  )
}
