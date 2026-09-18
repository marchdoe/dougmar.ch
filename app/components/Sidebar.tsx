import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { BrandLockup } from './BrandLockup'
import { Ground } from './Material'
import { identity } from '../content/about'

const navItems = [
  { label: 'Work', href: '/' },
  { label: 'About', href: '/about' },
]

export function Sidebar() {
  return (
    <Box
      as="header"
      className={css({
        position: { base: 'relative', lg: 'sticky' },
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        borderBottom: { base: '1px solid', lg: 'none' },
        borderRight: { base: 'none', lg: '1px solid' },
        borderColor: 'fieldBorder',
        display: 'flex',
        flexDirection: 'column',
        alignItems: { base: 'flex-start', lg: 'center' },
        gap: { base: '4', lg: '6' },
        padding: { base: '4', md: '5', lg: '5' },
        width: { base: 'full', lg: '84px' },
        flex: { base: '0 0 auto', lg: '0 0 84px' },
        top: { lg: 0 },
        height: { lg: '100vh' },
        zIndex: 10,
      })}
    >
      <Ground material="rule" seed={1942557463} />
      <Box
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: { base: 'row', lg: 'column' },
          alignItems: 'center',
          gap: '3',
          textAlign: { lg: 'center' },
        })}
      >
        <BrandLockup
          variant="stacked-md"
          mode="original"
          roleLine
          className={css({ color: 'fieldInk' })}
        />
      </Box>
      <Box
        as="nav"
        aria-label="Primary"
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
          gap: '3',
          marginTop: { lg: 'auto' },
          width: { lg: 'full' },
        })}
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={css({
              fontSize: 'sm',
              fontWeight: 'bold',
              color: 'fieldInk',
              padding: { base: '2', lg: '0' },
              minHeight: { base: '44px', lg: '92px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              writingMode: { lg: 'vertical-rl' },
              letterSpacing: { lg: 'wide' },
              borderBottom: { lg: '1px solid' },
              borderTop: { lg: '1px solid' },
              borderColor: 'fieldBorder',
              marginTop: { lg: '-1px' },
              width: { lg: 'full' },
            })}
          >
            {item.label}
          </a>
        ))}
        <a
          href={`mailto:${identity.email}`}
          className={css({
            fontSize: 'sm',
            fontWeight: 'bold',
            color: 'fieldInk',
            padding: { base: '2', lg: '0' },
            minHeight: { base: '44px', lg: '92px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            writingMode: { lg: 'vertical-rl' },
            letterSpacing: { lg: 'wide' },
            borderBottom: { lg: '1px solid' },
            borderColor: 'fieldBorder',
            width: { lg: 'full' },
          })}
        >
          Contact
        </a>
      </Box>
    </Box>
  )
}
