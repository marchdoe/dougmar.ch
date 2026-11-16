import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { RailNav } from './generated/RailNav'
import { RailSignals } from './generated/RailSignals'
import { RailFoot } from './generated/RailFoot'

// Mark sits on the bronze field. Light scheme: field is near-black bronze,
// the full-colour disc passes, so original. Dark scheme: field turns gold,
// the full-colour mark fails 3:1, so single-color in fieldInk.
export function Sidebar() {
  return (
    <>
      <header
        className={css({
          gridArea: 'mark',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { base: 'flex-end', lg: 'center' },
          paddingTop: { base: '16px', lg: '40px' },
          paddingBottom: { base: '16px', lg: '24px' },
          paddingInline: '24px',
          borderBottomWidth: { base: '1px', lg: '0' },
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ display: 'block', _hover: { textDecoration: 'none' } })}
        >
          <BrandLockup variant="mark-only-md" mode={{ light: 'original', dark: 'single-color' }} />
        </a>
      </header>
      <aside
        aria-label="Site index and signals"
        className={css({
          gridArea: 'rail',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          gap: { base: '32px', lg: '36px' },
          paddingTop: { base: '32px', lg: '0' },
          paddingBottom: { base: '40px', lg: '44px' },
          paddingInline: { base: '24px', lg: '28px' },
          minWidth: '0',
        })}
      >
        <RailNav />
        <RailSignals />
        <RailFoot />
      </aside>
    </>
  )
}
