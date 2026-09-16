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
      bg="bg"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        position="relative"
        width="1200px"
        height="630px"
        bg="bg"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        px="72px"
        py="64px"
      >
        <span
          aria-hidden
          className={css({
            position: 'absolute',
            right: '-6%',
            top: '-8%',
            fontFamily: 'display',
            fontSize: 'hero',
            color: 'accent',
            opacity: 0.08,
            lineHeight: 'tight',
          })}
        >
          10&ndash;1
        </span>
        <Box position="relative" zIndex={1} color="text">
          <BrandLockup variant="stacked-lg" mode="single-color" />
        </Box>
        <Box position="relative" zIndex={1} textAlign="right">
          <h1
            className={css({
              fontFamily: 'display',
              textStyle: 'hero',
              color: 'accentAlt',
              lineHeight: 'tight',
              letterSpacing: 'tight',
              textTransform: 'lowercase',
            })}
          >
            ten to one, no questions asked.
          </h1>
          <p className={css({ textStyle: 'lg', color: 'textMuted', mt: '4' })}>
            Detroit put up ten and gave back one.
          </p>
        </Box>
      </Box>
    </Box>
  )
}
