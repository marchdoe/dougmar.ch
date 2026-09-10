import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Identity = { name: string; role: string; statement: string; email: string }

export function IdentityStandfirst({ identity }: { identity: Identity }) {
  return (
    <Box
      className={css({
        bg: 'bg',
        color: 'text',
        paddingX: { base: '5', lg: '6vw' },
        paddingTop: { base: '8', lg: '9' },
        paddingBottom: { base: '6', lg: '6' },
      })}
    >
      <p
        className={css({
          textStyle: 'base',
          fontWeight: '700',
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        {identity.name} — {identity.role}
      </p>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'lg',
          lineHeight: 'normal',
          color: 'text',
          maxWidth: '65ch',
        })}
      >
        {identity.statement}
      </p>
    </Box>
  )
}
