import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="9999"
      bg="bg"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="1200px"
        height="630px"
        position="relative"
        bg="field"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        px="72px"
        py="64px"
      >
        <Box color="fieldInk">
          <BrandLockup variant="horizontal-sm" mode="single-color" />
        </Box>
        <Box
          fontFamily="display"
          fontWeight="900"
          textStyle="hero"
          lineHeight="tight"
          letterSpacing="tight"
          color="fieldInk"
        >
          <Box as="span" display="block">
            I rebuilt
          </Box>
          <Box as="span" display="block" ml="0.14em">
            myself
          </Box>
          <Box as="span" display="block" ml="0.28em" color="accent">
            overnight.
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
