import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
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
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '9',
          overflow: 'hidden',
        })}
      >
        <span
          className={css({
            textStyle: 'xs',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'accentAlt',
          })}
        >
          Today&rsquo;s creed
        </span>

        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: '500',
            fontSize: '92px',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'fieldInk',
            maxWidth: '920px',
          })}
        >
          There will be nothing learned from any challenge in which we don&rsquo;t{' '}
          <span className={css({ fontStyle: 'italic', fontWeight: '700', color: 'accentAlt' })}>
            try our hardest.
          </span>
        </h1>

        <Box className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="horizontal-md" mode="single-color" />
        </Box>
      </Box>
    </Box>
  )
}
