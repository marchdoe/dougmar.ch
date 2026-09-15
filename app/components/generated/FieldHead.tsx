import { css } from '../../../styled-system/css'
import { Flex } from '../../../styled-system/jsx'
import { BrandLockup } from '../BrandLockup'
import { identity } from '../../content/about'

const linkCss = css({
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  fontWeight: 'bold',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'text',
})

const numCss = css({
  color: 'accent',
  marginRight: '2',
  fontVariantNumeric: 'tabular-nums',
})

export function FieldHead() {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      gap="3"
      className={css({
        position: 'relative',
        zIndex: 2,
        minHeight: '96px',
        minWidth: '0px',
        width: '100%',
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({ color: 'text', display: 'flex', alignItems: 'center', minWidth: '0px' })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: { base: '3', lg: '5' },
          minWidth: '0px',
        })}
      >
        <a href="/#work" className={linkCss}>
          <span className={numCss}>01</span>Work
        </a>
        <a href="/about" className={linkCss}>
          <span className={numCss}>02</span>About
        </a>
        <a href={`mailto:${identity.email}`} className={linkCss}>
          <span className={numCss}>03</span>Contact
        </a>
      </nav>
    </Flex>
  )
}
