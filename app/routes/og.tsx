import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box, styled } from '../../styled-system/jsx'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      className={css({
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Box
        className={css({
          position: 'relative',
          width: '1200px',
          height: '630px',
          bg: 'bg',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        })}
      >
        <Box position="absolute" top="48px" left="56px">
          <BrandLockup variant="mark-only-md" mode="original" />
        </Box>
        <styled.h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            fontSize: '260px',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'transparent',
            WebkitTextStrokeWidth: '6px',
            WebkitTextStrokeColor: 'var(--colors-accent)',
            margin: 0,
          })}
        >
          Both
        </styled.h1>
        <Box
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '40px',
            color: 'text',
            marginTop: '4',
          })}
        >
          Deep in both. Not a generalist.
        </Box>
      </Box>
    </Box>
  )
}
