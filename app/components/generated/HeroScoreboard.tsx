import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

const eyebrowCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'fieldInkMuted',
})

const tigersCss = css({
  fontFamily: 'display',
  fontWeight: '900',
  fontSize: '2xl',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'fieldInk',
  textAlign: 'center',
  lineHeight: 'tight',
  maxWidth: '100%',
  overflowWrap: 'break-word',
})

const numCss = css({
  fontFamily: 'display',
  fontWeight: '900',
  fontSize: 'hero',
  lineHeight: 'tight',
  color: 'fieldInk',
})

const numWinCss = css({
  fontFamily: 'display',
  fontWeight: '900',
  fontSize: 'hero',
  lineHeight: 'tight',
  color: 'fieldInk',
  textShadow: '0 0 32px {colors.accentAlt}',
})

const dashCss = css({
  fontFamily: 'display',
  fontWeight: '400',
  fontSize: '4xl',
  lineHeight: 'tight',
  color: 'fieldInkMuted',
})

const teamCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'fieldInkMuted',
})

const teamStrongCss = css({ color: 'fieldInk' })

const deckCss = css({
  maxWidth: '60ch',
  textAlign: 'center',
  marginTop: { base: '6', md: '8' },
  fontFamily: 'display',
  fontSize: 'xl',
  lineHeight: 'snug',
  color: 'textMuted',
})

const emCss = css({ color: 'text', fontStyle: 'normal' })

export function HeroScoreboard() {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={{ base: '20px 20px 32px', md: '32px 7vw 64px' }}
    >
      <Box
        width="100%"
        maxWidth="1100px"
        minHeight={{ base: '52vh', md: '74vh', lg: '78vh' }}
        bg="field"
        border="2px solid"
        borderColor="fieldBorder"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        padding={{ base: '20px', md: '48px', lg: '56px' }}
        position="relative"
      >
        <Flex justify="space-between" align="baseline" wrap="wrap" gap="4">
          <span className={eyebrowCss}>Final &middot; Sat Sep 12</span>
          <span className={eyebrowCss}>AL Central</span>
        </Flex>

        <Box alignSelf="center" textAlign="center">
          <p className={tigersCss}>Tigers</p>
          <Flex
            justify="center"
            align="center"
            gap={{ base: '2', md: '8' }}
            marginTop={{ base: '2', md: '4' }}
          >
            <span className={numWinCss}>11</span>
            <span className={dashCss}>&ndash;</span>
            <span className={numCss}>7</span>
          </Flex>
        </Box>

        <Flex
          justify="space-between"
          align="baseline"
          wrap="wrap"
          gap="4"
          borderTop="1px solid"
          borderColor="fieldBorder"
          paddingTop="4"
        >
          <span className={teamCss}>
            <b className={teamStrongCss}>Detroit</b> &mdash; win
          </span>
          <span className={teamCss}>Comerica Park</span>
        </Flex>
      </Box>

      <p className={deckCss}>
        A Detroit win is the one signal this morning that is{' '}
        <em className={emCss}>unambiguously Doug&apos;s</em> &mdash; a scoreboard, not a slogan.
      </p>
    </Box>
  )
}
