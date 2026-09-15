import { css } from '../../../styled-system/css'
import { Box, styled } from '../../../styled-system/jsx'
import { Ground } from '../Material'
import { FieldHead } from './FieldHead'

const heroWordCss = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  textStyle: { base: '4xl', lg: 'hero' },
  lineHeight: 'tight',
  letterSpacing: 'tight',
  color: 'transparent',
  WebkitTextStrokeWidth: { base: '2px', lg: '4px' },
  WebkitTextStrokeColor: 'var(--colors-accent)',
  margin: 0,
  maxWidth: '100%',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const deckCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textStyle: '3xl',
  lineHeight: 'tight',
  color: 'text',
  mt: '5',
  maxWidth: '16ch',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const standfirstCss = css({
  textStyle: 'xl',
  color: 'textMuted',
  mt: '4',
  maxWidth: '34ch',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

export function HeroField() {
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
        minHeight: { base: 'auto', lg: '88vh' },
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
          <styled.h1 className={heroWordCss}>Both</styled.h1>
          <styled.p className={deckCss}>Deep in both. Not a generalist.</styled.p>
          <styled.p className={standfirstCss}>
            Design and engineering as one job, not two teams passing files.
          </styled.p>
        </Box>
      </Box>
    </Box>
  )
}
