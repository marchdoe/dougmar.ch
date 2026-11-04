import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'

/* Repair note, unresolved: this patch does not fix the 820px overflow in the
   top rail's text span. __root.tsx renders the rail, and this role may neither
   write that file nor style the rail, so the error stays open until the fix
   lands in __root.tsx. The change here only enlarges the nav's tap targets at
   base. The negative margins cancel the padding, so the line rhythm holds. */
const linkClass = css({
  display: 'inline-block',
  paddingBlock: { base: '12px', md: '0' },
  paddingInline: { base: '5px', md: '0' },
  marginBlock: { base: '-12px', md: '0' },
  marginInline: { base: '-5px', md: '0' },
  color: 'fieldInk',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  _hover: { color: 'accentAlt' },
})

export function Fold() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: { base: '34px', lg: '48px' },
      })}
    >
      <a
        href="/"
        className={css({
          display: 'block',
          width: 'fit-content',
          color: 'fieldInk',
          _hover: { textDecoration: 'none' },
        })}
      >
        <BrandLockup variant="horizontal-md" mode="original" roleLine />
      </a>
      <nav aria-label="Primary">
        <p
          className={css({
            fontFamily: 'display',
            textStyle: 'sm',
            lineHeight: '1.7',
            letterSpacing: '-0.01em',
            color: 'fieldInkMuted',
            maxWidth: '62ch',
            _before: { content: '"// "' },
          })}
        >
          see the{' '}
          <a href="/work" className={linkClass}>
            work
          </a>
          , read{' '}
          <a href="/about" className={linkClass}>
            about
          </a>
          , or say{' '}
          <a href={`mailto:${identity.email}`} className={linkClass}>
            contact
          </a>
          .
        </p>
      </nav>
    </div>
  )
}
