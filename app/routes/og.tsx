import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      className={css({
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        bg: 'field',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Box
        className={css({
          width: '1200px',
          height: '630px',
          bg: 'bg',
          color: 'text',
          position: 'relative',
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            textStyle: 'hero',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'text',
            maxWidth: '18ch',
          })}
        >
          The future is the worst thing about the present.
        </h1>
        <Box className={css({ color: 'text' })}>
          <BrandLockup variant="stacked-md" mode="single-color" />
        </Box>
      </Box>
    </Box>
  )
}
