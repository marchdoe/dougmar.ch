import { css } from '../../styled-system/css'
import { Flex, Box } from '../../styled-system/jsx'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'
import { projects, featuredProject } from '../content/projects'

const navLinkStyle = css({
  fontFamily: 'body',
  fontWeight: '500',
  fontSize: 'sm',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  textTransform: 'lowercase',
  color: 'text',
  padding: '2',
  minHeight: '36px',
  display: 'flex',
  alignItems: 'center',
})

export function Sidebar() {
  const workHref = featuredProject
    ? `/work/${featuredProject.slug}`
    : projects[0]
      ? `/work/${projects[0].slug}`
      : '/about'

  return (
    <Flex
      as="header"
      align={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: '3', md: '4' }}
      bg="bg"
      position="relative"
      zIndex="5"
      className={css({
        paddingInline: { base: '5vw', md: '7vw' },
        paddingBlock: { base: '3', md: '0' },
        height: { base: 'auto', md: '76px' },
      })}
    >
      <BrandLockup variant="horizontal-md" mode="single-color" roleLine color="text" />
      <nav
        aria-label="Primary"
        className={css({
          marginLeft: { base: '0', md: 'auto' },
          position: 'relative',
          '&:hover .navDropdown, &:focus-within .navDropdown': {
            opacity: '1',
            pointerEvents: 'auto',
            transform: 'translateY(0)',
          },
        })}
      >
        <button
          type="button"
          className={css({
            fontFamily: 'body',
            fontWeight: '600',
            fontSize: 'sm',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textTransform: 'lowercase',
            color: 'text',
            bg: 'transparent',
            border: 'none',
            padding: '2',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            minHeight: '44px',
          })}
        >
          Index ›
        </button>
        <Box
          className={
            'navDropdown ' +
            css({
              position: 'absolute',
              top: '100%',
              right: '0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '1',
              padding: '2',
              bg: 'bgAlt',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'sm',
              opacity: '0',
              pointerEvents: 'none',
              transform: 'translateY(-4px)',
              transition: 'opacity 0.18s ease-out, transform 0.18s ease-out',
              zIndex: '20',
            })
          }
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
        </Box>
      </nav>
    </Flex>
  )
}
