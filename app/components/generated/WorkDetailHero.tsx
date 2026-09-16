import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { BrandLockup } from '../BrandLockup'

type WorkDetailHeroProps = {
  title: string
  type: string
  year: number
  role?: string
  liveUrl?: string
}

export function WorkDetailHero({ title, type, year, role, liveUrl }: WorkDetailHeroProps) {
  const tag = [type, String(year), role].filter(Boolean).join(' \u00b7 ')
  return (
    <Box as="header" position="relative">
      <Box
        position="relative"
        overflow="hidden"
        bg="bg"
        px={{ base: '4', md: '6', lg: '96px' }}
        pt={{ base: '5', md: '6' }}
        pb={{ base: '6', md: '8' }}
      >
        <Ground material="halftone" seed={2110333653} />
        <Box
          position="absolute"
          inset="-4%"
          bg="bg"
          zIndex={-1}
          animation="drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate"
        />
        <Box position="relative" zIndex={1} color="text">
          <BrandLockup variant="stacked-lg" mode="single-color" />
        </Box>
      </Box>

      <Box
        bg="field"
        color="fieldInk"
        borderTop="3px solid"
        borderBottom="3px solid"
        borderColor="fieldBorder"
        px={{ base: '4', md: '6', lg: '96px' }}
        py={{ base: '8', md: '10' }}
        textAlign="right"
      >
        <p
          className={css({
            fontSize: 'sm',
            color: 'fieldInkMuted',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            mb: '4',
            textTransform: 'lowercase',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {tag}
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            textStyle: '5xl',
            color: 'fieldInk',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            mb: '5',
            textTransform: 'lowercase',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {title}
        </h1>
        {liveUrl && (
          <a
            href={liveUrl}
            className={css({
              fontSize: 'sm',
              color: 'fieldInk',
              borderBottom: '2px solid',
              borderColor: 'fieldInk',
              pb: '1',
              display: 'inline-block',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            Open live &rarr;
          </a>
        )}
      </Box>
    </Box>
  )
}
