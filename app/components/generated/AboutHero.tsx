import { Box, styled } from '../../../styled-system/jsx'
import { Masthead } from './Masthead'
import { identity } from '../../content/about'
import { capabilities } from '../../content/timeline'

export function AboutHero() {
  return (
    <Box
      as="section"
      bg="bg"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingTop="clamp(28px, 5vh, 44px)"
      paddingBottom="clamp(64px, 10vh, 120px)"
      display="flex"
      flexDirection="column"
    >
      <Masthead />
      <styled.h1
        fontFamily="display"
        fontWeight="500"
        color="text"
        textStyle={{ base: '2xl', lg: '4xl' }}
        lineHeight="1.05"
        letterSpacing="tight"
        maxWidth={{ base: '16ch', lg: '20ch' }}
        margin="0"
      >
        {identity.role}
      </styled.h1>
      <styled.p
        fontFamily="body"
        fontWeight="400"
        color="textMuted"
        textStyle="lg"
        lineHeight="1.55"
        maxWidth={{ base: '38ch', md: '54ch', lg: '66ch' }}
        marginTop={{ base: '5', lg: '6' }}
        margin="0"
      >
        {identity.statement}
      </styled.p>
      <Box display="flex" flexWrap="wrap" gap="1" marginTop={{ base: '6', lg: '7' }}>
        {capabilities.map((cap, i) => (
          <styled.span
            key={cap}
            fontFamily="body"
            textStyle="sm"
            fontVariantCaps="all-small-caps"
            textTransform="lowercase"
            letterSpacing="wide"
            color="textMuted"
          >
            {cap}
            {i < capabilities.length - 1 ? ' · ' : ''}
          </styled.span>
        ))}
      </Box>
    </Box>
  )
}
