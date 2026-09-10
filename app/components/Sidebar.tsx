import { BrandLockup } from './BrandLockup'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { SignalLedger } from './generated/SignalLedger'

function NavItem({ href, children }: { href: string; children: string }) {
  return (
    <Box as="li" className={css({ listStyle: 'none' })}>
      <a
        href={href}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { base: '44px', lg: '48px' },
          minWidth: '44px',
          paddingX: '3',
          fontFamily: 'body',
          fontWeight: '500',
          textStyle: 'sm',
          fontVariant: 'small-caps',
          letterSpacing: { base: 'wide', lg: 'wider' },
          color: 'fieldInk',
          _hover: { color: 'accent' },
        })}
      >
        {children}
      </a>
    </Box>
  )
}

export function Sidebar() {
  return (
    <>
      <Box
        as="header"
        className={css({
          gridArea: 'brand',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: { lg: 'center' },
          paddingX: '5',
          paddingTop: { base: '6', lg: '7' },
          paddingBottom: { base: '5', lg: '6' },
          minHeight: { lg: '120px' },
          minWidth: 0,
          maxWidth: '100%',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
          borderRight: { lg: '1px solid' },
        })}
      >
        <a href="/" aria-label="Doug March — home" className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="stacked-md" mode="single-color" />
        </a>
      </Box>

      <Box
        as="nav"
        aria-label="Primary"
        className={css({
          gridArea: 'nav',
          bg: 'field',
          color: 'fieldInk',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
          borderRight: { lg: '1px solid' },
          paddingTop: { base: '2', lg: '6' },
          paddingBottom: { base: '5', lg: '6' },
          paddingX: { base: '5', lg: '6' },
          minWidth: 0,
          maxWidth: '100%',
        })}
      >
        <Box
          as="ul"
          className={css({
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: { base: 'row', lg: 'column' },
            flexWrap: 'wrap',
            rowGap: { base: '1', lg: '0' },
            columnGap: { base: '4', lg: '0' },
          })}
        >
          <NavItem href="/#work">work</NavItem>
          <NavItem href="/about">about</NavItem>
          <NavItem href={`mailto:${identity.email}`}>contact</NavItem>
        </Box>
      </Box>

      <Box
        aria-hidden
        className={css({
          gridArea: 'spacer',
          display: { base: 'none', lg: 'block' },
          bg: 'field',
          borderRight: '1px solid',
          borderColor: 'fieldBorder',
          minWidth: 0,
        })}
      />

      <SignalLedger />
    </>
  )
}
