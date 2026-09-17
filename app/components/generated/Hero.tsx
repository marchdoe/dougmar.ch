import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { Ground } from '../Material'

export function Hero() {
  return (
    <Box
      as="section"
      aria-label="Statement"
      position="relative"
      overflow="hidden"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '56px 44px', md: '96px 64px', xl: '112px 72px' },
        minHeight: { md: '60vh' },
      })}
    >
      <Ground material="grain" seed={2127111272} />
      <Box position="relative" zIndex="1">
        <Box
          as="h1"
          fontFamily="display"
          fontWeight="light"
          fontVariant="small-caps"
          textTransform="lowercase"
          color="text"
          textAlign="left"
          className={css({
            textStyle: { base: '3xl', md: 'hero' },
            letterSpacing: 'wide',
            lineHeight: 'tight',
            margin: '0',
          })}
        >
          <span className={css({ display: 'block' })}>what ships</span>
          <span className={css({ display: 'block' })}>should look like</span>
          <span className={css({ display: 'block' })}>
            what was designed
            <span className={css({ color: 'accent' })}>.</span>
          </span>
        </Box>
        <Box
          as="p"
          fontFamily="display"
          color="textMuted"
          className={css({
            fontSize: { base: 'lg', md: 'xl' },
            lineHeight: 'normal',
            maxWidth: { base: '26ch', md: '30ch' },
            marginTop: { base: '5', md: '6' },
          })}
        >
          Doug March builds the thing he drew. Design and engineering, one hand, no drift between
          the drawing and the object.
        </Box>
        <Box
          className={css({
            marginTop: '6',
            borderTop: '1px solid',
            borderColor: 'border',
            paddingTop: '3',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            alignItems: 'baseline',
          })}
        >
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: '600',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            Specimen
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: 'sm',
              color: 'textMuted',
              letterSpacing: 'normal',
            })}
          >
            Zilla Slab, small-caps, light, reversed out of ochre 68 degrees.
          </span>
        </Box>
      </Box>
    </Box>
  )
}
