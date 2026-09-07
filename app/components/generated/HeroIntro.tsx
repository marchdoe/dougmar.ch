import { Box, styled } from '../../../styled-system/jsx'
import { Masthead } from './Masthead'

export function HeroIntro() {
  return (
    <Box
      as="section"
      bg="bg"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingTop="clamp(28px, 5vh, 44px)"
      paddingBottom="clamp(64px, 10vh, 120px)"
      minHeight={{ base: 'auto', lg: '50vh' }}
      display="flex"
      flexDirection="column"
    >
      <Masthead />
      <styled.p
        fontFamily="body"
        fontWeight="400"
        color="textMuted"
        textStyle="xl"
        lineHeight="1.35"
        maxWidth={{ base: '22ch', md: '26ch', lg: '34ch' }}
        marginBottom={{ base: '5', lg: '6' }}
        margin="0"
      >
        If you cling to a certain thought with dynamic will power{' '}
        <styled.span color="textFaint">—</styled.span>
      </styled.p>
      <styled.h1
        fontFamily="display"
        fontWeight="500"
        color="text"
        textStyle={{ base: '3xl', lg: 'hero' }}
        lineHeight="1.02"
        letterSpacing="tight"
        maxWidth={{ base: '16ch', lg: '18ch' }}
        margin="0"
        marginTop={{ base: '5', lg: '6' }}
      >
        It finally assumes
      </styled.h1>
    </Box>
  )
}
