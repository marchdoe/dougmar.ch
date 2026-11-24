import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const label = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'fieldInkMuted',
  marginBottom: '10px',
})

const navLink = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accentAlt',
  paddingBlock: '10px',
  minHeight: '44px',
  minWidth: '44px',
  display: 'inline-flex',
  alignItems: 'center',
})

export function Colophon() {
  const credit = [identity.name, identity.role].filter(Boolean).join(', ')
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '56px',
        paddingBottom: '48px',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        display: 'grid',
        gap: { base: '36px', lg: '48px' },
        gridTemplateColumns: { base: '1fr', lg: '1.5fr 1fr 1fr' },
        alignItems: 'start',
      })}
    >
      <div>
        <blockquote
          className={css({
            margin: '0',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            textStyle: 'xl',
            lineHeight: '1.3',
            color: 'fieldInk',
            maxWidth: '34ch',
          })}
        >
          The desire for more positive experience is itself a negative experience.
          <cite
            className={css({
              display: 'block',
              fontStyle: 'normal',
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: '2xs',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'fieldInkMuted',
              marginTop: '14px',
            })}
          >
            Mark Manson
          </cite>
        </blockquote>
      </div>
      <div>
        <div className={label}>In rotation</div>
        <p
          className={css({
            fontFamily: 'body',
            textStyle: 'sm',
            lineHeight: '1.55',
            color: 'fieldInk',
          })}
        >
          Wet Leg
          <br />
          Tobin Sprout
          <br />
          My Morning Jacket
        </p>
      </div>
      <div>
        <div className={label}>Index</div>
        <nav
          aria-label="Footer"
          className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '10px', columnGap: '28px' })}
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
            fontFamily: 'body',
            textStyle: 'xs',
            color: 'fieldInkMuted',
            letterSpacing: '0.02em',
            marginTop: '2',
          })}
        >
          {credit}. Aldie, Virginia. © 2026
        </div>
      </div>
    </footer>
  )
}
