import { Box, Flex } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'
import { featuredProject, selectedWork } from '../content/projects'

const workHref = featuredProject
  ? `/work/${featuredProject.slug}`
  : selectedWork[0]
    ? `/work/${selectedWork[0].slug}`
    : '/'

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

export function Sidebar() {
  return (
    <Box
      as="header"
      position="relative"
      zIndex={2}
      padding={{ base: '20px 20px 0', md: '32px 7vw 0' }}
      maxWidth="100vw"
      overflow="hidden"
    >
      <Flex direction="column" gap="2" color="text">
        <BrandLockup variant="horizontal-md" mode="original" />
        <nav
          className={css({
            display: { base: 'none', md: 'flex' },
            flexWrap: 'wrap',
            gap: '5',
          })}
          aria-label="Primary"
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
      </Flex>
    </Box>
  )
}
