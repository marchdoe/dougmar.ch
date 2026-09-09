import { Box, Flex } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'

const navLinkStyle = css({
  textStyle: 'sm',
  fontVariantCaps: 'all-small-caps',
  letterSpacing: 'wide',
  color: 'textMuted',
  paddingX: '3',
  paddingY: '2',
  minHeight: '44px',
  minWidth: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid transparent',
  _hover: { color: 'accent', borderBottomColor: 'accent' },
})

export function Sidebar() {
  return (
    <Box
      as="header"
      paddingInline={{ base: '20px', md: '6', lg: '8' }}
      paddingTop="5"
      minHeight="72px"
    >
      <Flex direction="column" gap="2">
        <a
          href="/"
          aria-label={`${identity.name} home`}
          className={css({ display: 'inline-flex', width: 'fit-content' })}
        >
          <BrandLockup variant="horizontal-md" mode="original" />
        </a>
        <nav
          aria-label="Primary"
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: { base: '1', md: '5' },
            paddingLeft: { base: '0px', md: '52px' },
            marginLeft: { base: '-3', md: '0px' },
          })}
        >
          <a href="/work" className={navLinkStyle}>
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
