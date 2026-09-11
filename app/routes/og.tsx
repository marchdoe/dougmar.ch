import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="field"
      className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}
    >
      <Box
        width="1200px"
        height="630px"
        bg="field"
        color="fieldInk"
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '9',
          overflow: 'hidden',
          borderBottom: '2px solid',
          borderColor: 'fieldBorder',
        })}
      >
        <Box className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="stacked-lg" mode="original" />
        </Box>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'hero',
            letterSpacing: 'tight',
            color: 'fieldInk',
            maxWidth: '1000px',
          })}
        >
          Free to produce.
          <br />
          Not free to{' '}
          <span className={css({ bg: 'accent', color: 'accentText', paddingInline: '2' })}>
            own
          </span>
          .
        </h1>
        <Box
          className={css({
            fontFamily: 'display',
            textStyle: 'sm',
            color: 'fieldInkMuted',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
          })}
        >
          dougmar.ch
        </Box>
      </Box>
    </Box>
  )
}
