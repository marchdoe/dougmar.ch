import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { BrandLockup } from '../BrandLockup'

export function HeroHome() {
  return (
    <Box
      as="header"
      position="relative"
      overflow="hidden"
      bg="bg"
      minH={{ base: 'auto', md: '82vh' }}
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
          right: { base: '-14%', md: '2%' },
          top: { base: '18%', md: '8%' },
          fontFamily: 'display',
          fontSize: 'hero',
          color: 'accent',
          opacity: 0.06,
          lineHeight: 'tight',
          zIndex: 0,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        })}
      >
        10&ndash;1
      </span>

      <Box position="relative" zIndex={1} display="flex" justifyContent="flex-start" color="text">
        <BrandLockup variant="stacked-lg" mode="single-color" />
      </Box>

      <Flex
        position="relative"
        zIndex={1}
        flex="1"
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        gap="4"
        mt={{ base: '6', md: '10' }}
        minWidth="0"
      >
        <span
          className={css({
            fontSize: 'sm',
            color: 'textFaint',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            writingMode: { base: 'horizontal-tb', md: 'vertical-rl' },
            transform: { md: 'rotate(180deg)' },
            borderRight: { md: '1px solid' },
            borderColor: 'border',
            pr: { md: '3' },
            display: 'inline-block',
            flexShrink: 0,
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          Detroit 10 &middot; Visitors 1 &middot; Comerica
        </span>
        <p
          aria-hidden
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: 'hero' },
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'accentAlt',
            textAlign: { base: 'left', md: 'right' },
            m: '0',
            flex: '1',
            minWidth: '0',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          10<span className={css({ color: 'fieldBorder' })}>&ndash;</span>1
        </p>
      </Flex>

      <Box
        position="relative"
        zIndex={1}
        ml={{ base: '0', md: 'auto' }}
        mt={{ base: '5', md: '9' }}
        maxW={{ base: '100%', md: '640px' }}
        textAlign={{ base: 'left', md: 'right' }}
      >
        <h1
          className={css({
            fontFamily: 'display',
            textStyle: { base: 'xl', md: '3xl' },
            color: 'text',
            fontWeight: 'normal',
            textTransform: 'lowercase',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          ten to one, no questions asked.
        </h1>
        <p
          className={css({
            mt: '3',
            textStyle: 'md',
            color: 'textMuted',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          Detroit put up ten and gave back one.
        </p>
      </Box>
    </Box>
  )
}
