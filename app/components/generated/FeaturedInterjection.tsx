import { Box, styled } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedInterjection() {
  if (!featuredProject) return null

  const href =
    featuredProject.externalUrl || featuredProject.liveUrl || `/work/${featuredProject.slug}`

  return (
    <Box
      as="section"
      bg="bgAlt"
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="border"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingBlock={{ base: '8', lg: '9' }}
    >
      <Box
        fontFamily="body"
        textStyle="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        color="textFaint"
        marginBottom="3"
      >
        Featured
      </Box>
      <styled.h2
        fontFamily="display"
        fontWeight="500"
        color="text"
        textStyle={{ base: '2xl', lg: '4xl' }}
        lineHeight="1.1"
        letterSpacing="tight"
        maxWidth="20ch"
        margin="0"
      >
        {featuredProject.title}
      </styled.h2>
      {featuredProject.problem && (
        <Box
          fontFamily="body"
          textStyle="base"
          color="textMuted"
          lineHeight="1.55"
          maxWidth="60ch"
          marginTop="4"
        >
          {featuredProject.problem}
        </Box>
      )}
      <a
        href={href}
        className={css({
          fontFamily: 'body',
          textStyle: 'sm',
          fontWeight: '600',
          color: 'accent',
          display: 'inline-block',
          marginTop: '4',
        })}
      >
        View project →
      </a>
    </Box>
  )
}
