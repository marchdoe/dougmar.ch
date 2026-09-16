import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type FeaturedBandProps = {
  tag: string
  title: string
  problem: string
  linkHref?: string
  linkLabel?: string
}

export function FeaturedBand({ tag, title, problem, linkHref, linkLabel }: FeaturedBandProps) {
  return (
    <Box
      as="section"
      bg="field"
      color="fieldInk"
      borderTop="3px solid"
      borderBottom="3px solid"
      borderColor="fieldBorder"
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10', lg: '16' }}
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <p
        className={css({
          fontSize: 'sm',
          color: 'fieldInkMuted',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          textTransform: 'lowercase',
          mb: '4',
        })}
      >
        {tag}
      </p>
      <h3
        className={css({
          fontFamily: 'display',
          textStyle: '5xl',
          color: 'fieldInk',
          lineHeight: 'tight',
          letterSpacing: 'tight',
          mb: '5',
          textTransform: 'lowercase',
        })}
      >
        {title}
      </h3>
      <p className={css({ textStyle: 'md', color: 'fieldInk', maxW: '56ch', mb: '5' })}>
        {problem}
      </p>
      {linkHref && (
        <a
          href={linkHref}
          className={css({
            fontSize: 'sm',
            color: 'fieldInk',
            borderBottom: '2px solid',
            borderColor: 'fieldInk',
            pb: '1',
            letterSpacing: 'wide',
            display: 'inline-block',
            _hover: { color: 'fieldInkMuted', borderColor: 'fieldInkMuted' },
          })}
        >
          {linkLabel ?? 'Open'} &rarr;
        </a>
      )}
    </Box>
  )
}
