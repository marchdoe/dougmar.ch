import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={9999}
      bg="field"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box position="relative" width="1200px" height="630px" bg="field" overflow="hidden">
        <Box position="absolute" top="48px" left="64px" className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="horizontal-md" mode="original" />
        </Box>
        <Box
          position="absolute"
          inset="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingInline="100px"
        >
          <Box
            as="h1"
            textAlign="center"
            className={css({
              textStyle: 'hero',
              fontWeight: '800',
              fontFamily: 'display',
              color: 'fieldInk',
              letterSpacing: 'tight',
              maxWidth: '16ch',
              margin: 0,
            })}
          >
            Limit the number of details
            <span className={css({ color: 'accent' })}>.</span>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
