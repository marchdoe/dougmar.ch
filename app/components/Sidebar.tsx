import { Box, Flex } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'

const navLinkClass = css({
  textStyle: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  fontWeight: '600',
  color: 'textMuted',
  padding: '11px 0',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
})

export function Sidebar() {
  return (
    <Box
      as="footer"
      borderTop="1px solid"
      borderColor="borderStrong"
      bg="bg"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '24px', md: '30px' }}
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems={{ base: 'flex-start', md: 'center' }}
      justifyContent={{ md: 'space-between' }}
      flexWrap="wrap"
      gap="22px"
    >
      <Flex align="center" gap="12px" color="text">
        <BrandLockup variant="horizontal-sm" mode="single-color" />
      </Flex>

      <Flex gap={{ base: '18px', md: '34px' }} flexWrap="wrap">
        <a href="/" className={navLinkClass}>
          Work
        </a>
        <a href="/about" className={navLinkClass}>
          About
        </a>
        <a href={`mailto:${identity.email}`} className={navLinkClass}>
          Contact
        </a>
      </Flex>

      <Box
        flexBasis={{ md: '100%' }}
        order={{ md: 3 }}
        textStyle="2xs"
        textTransform="uppercase"
        letterSpacing="normal"
        color="textFaint"
        lineHeight="loose"
      >
        <styled.b className={css({ color: 'textMuted', fontWeight: '600' })}>
          Rebuilt nightly, from scratch
        </styled.b>{' '}
        · Autumn 2026 · Waning crescent 8% · On rotation: My Morning Jacket / Tobin Sprout
      </Box>
    </Box>
  )
}

import { styled } from '../../styled-system/jsx'
