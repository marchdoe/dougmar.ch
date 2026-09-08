import { Box } from '../../../styled-system/jsx'

export function HeroPhrase() {
  return (
    <Box
      position="relative"
      zIndex="3"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      pt={{ base: '40px', md: '52px', xl: '72px' }}
      pointerEvents="none"
    >
      <Box
        as="h1"
        fontFamily="display"
        fontWeight="900"
        fontSize={{ base: '30px', md: '48px', lg: 'hero' }}
        lineHeight="tight"
        letterSpacing="tight"
        color="text"
        overflowWrap="break-word"
        wordBreak="break-word"
      >
        <Box as="span" display="block">
          I rebuilt
        </Box>
        <Box as="span" display="block" ml={{ base: '0', md: '0.14em' }}>
          myself
        </Box>
        <Box as="span" display="block" ml={{ base: '0', md: '0.28em' }} color="accent">
          overnight.
        </Box>
      </Box>
    </Box>
  )
}
