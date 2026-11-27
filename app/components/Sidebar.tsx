import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const sub = [identity.role, 'Aldie, Virginia', 'MMXXVI'].filter(Boolean).join(' · ')

const navLink = css({
  display: 'inline-block',
  paddingBlock: '2',
  color: 'fieldInk',
  textDecoration: 'underline',
  textDecorationThickness: '2px',
  textUnderlineOffset: '5px',
  _hover: { color: 'fieldInkMuted' },
})

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '44px', lg: '64px' },
        paddingBottom: { base: '48px', lg: '72px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1.2fr 1fr' },
        rowGap: { base: '24px', lg: '40px' },
        columnGap: { lg: '6vw' },
        alignItems: { lg: 'end' },
      })}
    >
      <div>
        <div
          className={css({
            fontFamily: 'display',
            fontSize: { base: '24px', lg: '46px' },
            lineHeight: '1',
            letterSpacing: 'normal',
            fontWeight: 'normal',
          })}
        >
          {identity.name}
        </div>
        <div
          className={css({
            textStyle: 'sm',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
            marginTop: '2',
          })}
        >
          {sub}
        </div>
      </div>
      <div className={css({ textStyle: 'sm', color: 'fieldInkMuted', maxWidth: '42ch' })}>
        On rotation. The War on Drugs, Guided by Voices.
      </div>
      <nav aria-label="Site" className={css({ gridColumn: { lg: '1 / -1' } })}>
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '24px', lg: '46px' },
            lineHeight: '1.4',
            letterSpacing: 'normal',
            maxWidth: { base: '30ch', lg: '26ch' },
            textTransform: 'lowercase',
          })}
        >
          see the{' '}
          <a href="/work" className={navLink}>
            work
          </a>
          , read{' '}
          <a href="/about" className={navLink}>
            about
          </a>
          , or get in{' '}
          <a href={`mailto:${identity.email}`} className={navLink}>
            contact
          </a>
          .
        </p>
      </nav>
    </footer>
  )
}
