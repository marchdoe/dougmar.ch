import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { Ground } from '../components/Material'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="9999"
      bg="bg"
      className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}
    >
      <Box
        position="relative"
        overflow="hidden"
        bg="bg"
        className={css({ width: '1200px', height: '630px' })}
      >
        <Ground material="grain" seed={2127111272} />
        <Box
          position="relative"
          zIndex="1"
          className={css({
            padding: '64px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          })}
        >
          <Box color="text">
            <BrandLockup variant="horizontal-md" mode="single-color" roleLine color="text" />
          </Box>
          <Box
            as="h1"
            fontFamily="display"
            fontWeight="light"
            fontVariant="small-caps"
            textTransform="lowercase"
            color="text"
            textAlign="left"
            className={css({
              textStyle: '5xl',
              letterSpacing: 'wide',
              lineHeight: 'tight',
              maxWidth: '18ch',
            })}
          >
            <span className={css({ display: 'block' })}>what ships</span>
            <span className={css({ display: 'block' })}>should look like</span>
            <span className={css({ display: 'block' })}>
              what was designed
              <span className={css({ color: 'accent' })}>.</span>
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
