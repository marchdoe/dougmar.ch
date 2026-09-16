import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { BrandLockup } from '../BrandLockup'

export function AboutHero({ statement, role }: { statement: string; role: string }) {
  return (
    <Box
      as="header"
      position="relative"
      overflow="hidden"
      bg="bg"
      minH={{ base: 'auto', md: '58vh' }}
      px={{ base: '4', md: '6', lg: '96px' }}
      pt={{ base: '5', md: '6' }}
      pb={{ base: '7', md: '8' }}
      display="flex"
      flexDirection="column"
    >
      <Ground material="halftone" seed={2110333653} />
      <Box
        position="absolute"
        inset="-4%"
        bg="bg"
        zIndex={-1}
        animation="drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate"
      />
      <span
        aria-hidden
        className={css({
          position: 'absolute',
          right: { base: '-10%', md: '0%' },
          top: { base: '30%', md: '18%' },
          fontFamily: 'display',
          fontSize: 'hero',
          color: 'accent',
          opacity: 0.05,
          lineHeight: 'tight',
          zIndex: 0,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        })}
      >
        {statement.split(' ')[0]}
      </span>

      <Box position="relative" zIndex={1} color="text">
        <BrandLockup variant="stacked-lg" mode="single-color" />
      </Box>

      <Box
        position="relative"
        zIndex={1}
        ml={{ base: '0', md: 'auto' }}
        mt={{ base: '8', md: '14' }}
        maxW={{ base: '100%', md: '760px' }}
      >
        <span
          className={css({
            fontSize: 'sm',
            color: 'textFaint',
            textTransform: 'lowercase',
            letterSpacing: 'wide',
            display: 'block',
            mb: '3',
            textAlign: { base: 'left', md: 'right' },
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {role}
        </span>
        <h1
          className={css({
            fontFamily: 'body',
            textStyle: 'lg',
            color: 'text',
            fontWeight: 'normal',
            textAlign: { base: 'left', md: 'right' },
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {statement}
        </h1>
      </Box>
    </Box>
  )
}
