import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { featuredProject, selectedWork } from '../../content/projects'

const workHref = featuredProject
  ? `/work/${featuredProject.slug}`
  : selectedWork[0]
    ? `/work/${selectedWork[0].slug}`
    : '/'

const rowCss = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2 5',
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
})

const strongCss = css({ color: 'textMuted' })

const navLinkStyle = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textMuted',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  paddingX: '2',
  _hover: { color: 'accentAlt' },
})

const footnoteCss = css({
  marginTop: '4',
  fontStyle: 'italic',
  fontSize: 'base',
  lineHeight: 'loose',
  color: 'textFaint',
  maxWidth: '66ch',
})

export function Footer() {
  return (
    <Box
      as="footer"
      borderTop="1px solid"
      borderColor="borderStrong"
      padding={{ base: '20px 20px 32px', md: '32px 7vw 44px' }}
    >
      <Flex className={rowCss}>
        <span>
          Tigers <b className={strongCss}>11&ndash;7</b>
        </span>
        <span>
          SPY <b className={strongCss}>764.29</b> &#9650;0.85%
        </span>
        <span>
          Fog <b className={strongCss}>71.7&deg;F</b> 97%
        </span>
        <span>
          Moon <b className={strongCss}>5.9%</b>
        </span>
        <span>
          AQI <b className={strongCss}>Good</b> &middot; UV 0
        </span>
      </Flex>
      <nav
        className={css({ display: 'flex', flexWrap: 'wrap', gap: '5', marginTop: '5' })}
        aria-label="Footer"
      >
        <a href={workHref} className={navLinkStyle}>
          work
        </a>
        <a href="/about" className={navLinkStyle}>
          about
        </a>
        <a href={`mailto:${identity.email}`} className={navLinkStyle}>
          contact
        </a>
      </nav>
      <p className={footnoteCss}>
        &ldquo;High thoughts must have high language.&rdquo; &mdash; Aristophanes. &copy; 2026 Doug
        March.
      </p>
    </Box>
  )
}
