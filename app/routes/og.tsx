import { createFileRoute } from '@tanstack/react-router'
import { Box, styled } from '../../styled-system/jsx'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="9999"
      bg="field"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="1200px"
        height="630px"
        bg="field"
        color="fieldInk"
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        padding="64px"
        overflow="hidden"
      >
        <Box color="fieldInk">
          <BrandLockup variant="stacked-lg" mode="original" />
        </Box>
        <styled.h1
          fontFamily="display"
          fontWeight="500"
          color="fieldInk"
          fontSize="hero"
          lineHeight="1.02"
          letterSpacing="tight"
          maxWidth="16ch"
          margin="0"
        >
          It finally assumes a tangible outward form.
        </styled.h1>
      </Box>
    </Box>
  )
}
