import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const rail = css({
  bg: 'bgAlt',
  color: 'text',
  borderBottomWidth: { base: '1px', lg: '0px' },
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
  borderRightWidth: { base: '0px', lg: '1px' },
  borderRightStyle: 'solid',
  borderRightColor: 'border',
  display: { lg: 'flex' },
  flexDirection: { lg: 'column' },
  justifyContent: { lg: 'space-between' },
})

const railHead = css({
  paddingTop: { base: '12px', lg: '32px' },
  paddingBottom: { base: '6px', lg: '32px' },
  paddingLeft: { base: '16px', lg: '24px' },
  paddingRight: { base: '16px', lg: '24px' },
  position: { lg: 'sticky' },
  top: { lg: '0px' },
  minHeight: { lg: '320px' },
})

const mark = css({
  display: 'flex',
  alignItems: 'center',
  width: 'max-content',
  minWidth: '44px',
  minHeight: '44px',
  textDecoration: 'none',
})

const nav = css({
  marginTop: { base: '2px', lg: '40px' },
  textStyle: { base: 'sm', lg: 'md' },
  lineHeight: '44px',
  color: 'text',
  textTransform: 'lowercase',
})

/* The mockup sets nav links at weight 500. The weight tokens are light, normal and bold, so normal stands in. */
const navLink = css({
  display: { base: 'inline-flex', lg: 'inline' },
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: { base: '44px', lg: '0px' },
  minHeight: { base: '44px', lg: '0px' },
  paddingLeft: { base: '7px', lg: '0px' },
  paddingRight: { base: '7px', lg: '0px' },
  marginLeft: { base: '-7px', lg: '0px' },
  marginRight: { base: '-7px', lg: '0px' },
  fontWeight: 'normal',
  verticalAlign: 'top',
})

const railFoot = css({
  display: { base: 'none', lg: 'block' },
  padding: '24px',
  textStyle: 'sm',
  lineHeight: '1.5',
  color: 'textMuted',
})

export function Sidebar() {
  return (
    <header className={rail}>
      <div className={railHead}>
        <a href="/" aria-label={`${identity.name}, home`} className={mark}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
        <nav aria-label="Primary" className={nav}>
          start with the{' '}
          <a href="/#work" className={navLink}>
            work
          </a>
          , then read{' '}
          <a href="/about" className={navLink}>
            about me
          </a>
          , then{' '}
          <a href={`mailto:${identity.email}`} className={navLink}>
            get in touch
          </a>
          .
        </nav>
      </div>
      <p className={railFoot}>
        {identity.name}. {identity.role}.
      </p>
    </header>
  )
}
