import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'
import { Lab } from './generated/Lab'
import { MetaGroup } from './generated/MetaGroup'

const navLink = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '56px',
  paddingBlock: '2',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderColor: 'fieldBorder',
  textDecoration: 'none',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontVariantCaps: 'all-small-caps',
  letterSpacing: 'wider',
  textStyle: 'sm',
  color: 'fieldInk',
  _hover: { color: 'accentAlt' },
})

// Colophon footer: shell_posture footer-only, the nav index lives here.
export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        marginTop: 'clamp(48px, 6vw, 88px)',
        paddingTop: 'clamp(40px, 6vw, 72px)',
        paddingBottom: 'clamp(40px, 6vw, 64px)',
        paddingInline: 'clamp(28px, 6vw, 108px)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '48px',
        lg: { gridTemplateColumns: 'repeat(12, 1fr)', columnGap: '24px', rowGap: '40px' },
      })}
    >
      <div className={css({ minWidth: 0, lg: { gridColumn: '1 / 5' } })}>
        <BrandLockup
          variant="stacked-lg"
          mode="single-color"
          className={css({ color: 'fieldInk' })}
        />
        <div className={css({ marginTop: '5' })}>
          <Lab>{identity.role}</Lab>
        </div>
        <p
          className={css({
            marginTop: '3',
            marginBottom: '0',
            maxWidth: '34ch',
            color: 'fieldInkMuted',
            textStyle: 'sm',
          })}
        >
          Independent product and brand design from Aldie, Virginia. Ten years of Spaceman, built on
          my own terms.
        </p>
      </div>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: 'column',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'fieldBorder',
          lg: { gridColumn: '5 / 8' },
        })}
      >
        <a href="/work" className={navLink}>
          Work
        </a>
        <a href="/about" className={navLink}>
          About
        </a>
        <a href={`mailto:${identity.email}`} className={navLink}>
          Contact
        </a>
      </nav>
      <div
        className={css({
          display: 'grid',
          rowGap: '26px',
          minWidth: 0,
          lg: { gridColumn: '9 / 13' },
        })}
      >
        <MetaGroup
          label="Aldie, VA"
          lines={[
            ['Weather', 'Light rain · 61.5°F'],
            ['Moon', 'New · 0.01'],
            ['Today', 'Columbus Day · Oct 12'],
          ]}
        />
        <MetaGroup
          label="On rotation"
          lines={[
            ['Side A', 'The War on Drugs'],
            ['Side B', 'Guided by Voices'],
          ]}
        />
      </div>
      <div
        className={css({
          gridColumn: '1 / -1',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'fieldBorder',
          paddingTop: '5',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          rowGap: '3',
          columnGap: '6',
          justifyContent: 'space-between',
          textStyle: 'xs',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        <span>© 2026 {identity.name}, Spaceman LLC</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            color: 'fieldInk',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
          })}
        >
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
