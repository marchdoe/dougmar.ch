import { css } from '../../../styled-system/css'
import { Box, styled } from '../../../styled-system/jsx'
import { Ground } from '../Material'
import { FieldHead } from './FieldHead'
import { identity } from '../../content/about'

export function AboutHero() {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="bg"
      minWidth="0px"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        padding: { base: '28px 6vw', lg: '36px 4vw', xl: '44px 72px' },
        minHeight: { base: 'auto', lg: '70vh' },
      })}
    >
      <Ground material="dots" seed={13182863} />
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        flexDirection="column"
        flex="1 1 auto"
        minWidth="0px"
      >
        <FieldHead />
        <Box
          className={css({
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: { base: '36px 0 44px' },
            minWidth: '0px',
          })}
        >
          <styled.h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'lg',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '52ch',
              margin: 0,
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {identity.statement}
          </styled.h1>
          <styled.p
            className={css({
              textStyle: 'sm',
              color: 'textMuted',
              mt: '4',
              maxWidth: '40ch',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              fontWeight: 'bold',
              fontFamily: 'display',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            {identity.name}, {identity.role}
          </styled.p>
        </Box>
      </Box>
    </Box>
  )
}
