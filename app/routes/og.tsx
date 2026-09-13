import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="field"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="1200px" height="630px" position="relative" overflow="hidden">
        <Box position="absolute" top="40px" left="40px" color="fieldInk">
          <BrandLockup variant="horizontal-md" mode="original" />
        </Box>
        <Box
          position="absolute"
          inset={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Box
            fontFamily="display"
            fontWeight="900"
            textTransform="uppercase"
            color="fieldInk"
            fontSize="5xl"
            lineHeight="tight"
          >
            Tigers
          </Box>
          <Box
            fontFamily="display"
            fontWeight="900"
            color="accentAlt"
            fontSize="hero"
            lineHeight="tight"
            textShadow="0 0 32px currentColor"
          >
            11&ndash;7
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
