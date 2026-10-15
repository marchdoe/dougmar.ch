import { css } from '../../styled-system/css'
import { identity } from '../content/about'

// The shell footer: a deep jade field band (jade800 = surface), no nav element.
export function Sidebar() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'surface',
        color: 'text',
        paddingTop: '6',
        paddingBottom: '7',
        paddingInline: '6vw',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <div
        className={css({
          maxWidth: '1400px',
          marginInline: 'auto',
          display: 'grid',
          gridTemplateColumns: {
            base: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)',
          },
          gap: { base: '5', lg: '6' },
        })}
      >
        <div className={css({ minWidth: '0' })}>
          <div
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
              marginBottom: '2',
            })}
          >
            Aldie, Virginia
          </div>
          <div
            className={css({
              fontFamily: 'display',
              textStyle: 'lg',
              fontWeight: 'normal',
              color: 'text',
            })}
          >
            {identity.name}
          </div>
          <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '2' })}>
            {identity.role}
          </div>
          <div
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              marginTop: '12px',
              maxWidth: '45ch',
            })}
          >
            Wednesday, October 15, 2026, waxing crescent
          </div>
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '4',
              rowGap: '1',
              marginTop: '3',
            })}
          >
            <a
              href={`mailto:${identity.email}`}
              className={css({
                color: 'accentAlt',
                fontWeight: 'bold',
                fontSize: 'sm',
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                _hover: { color: 'accent' },
              })}
            >
              {identity.email}
            </a>
            <a
              href="/about"
              className={css({
                color: 'text',
                fontSize: 'sm',
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                minWidth: '44px',
                _hover: { color: 'accentAlt' },
              })}
            >
              About
            </a>
            <a
              href="/#work"
              className={css({
                color: 'text',
                fontSize: 'sm',
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                minWidth: '44px',
                _hover: { color: 'accentAlt' },
              })}
            >
              Work
            </a>
          </div>
        </div>
        <div className={css({ minWidth: '0' })}>
          <div
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
              marginBottom: '2',
            })}
          >
            From the floor
          </div>
          <div
            className={css({
              fontSize: 'sm',
              lineHeight: 'normal',
              color: 'textMuted',
              maxWidth: '45ch',
            })}
          >
            <span className={css({ color: 'accentAlt', fontWeight: 'bold' })}>
              Pistons 128–106.
            </span>{' '}
            A win, stated as a score. SPY down 1.08% on the day, overcast and 61° out the door.
          </div>
        </div>
        <div className={css({ minWidth: '0' })}>
          <div
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
              marginBottom: '2',
            })}
          >
            On rotation
          </div>
          <div
            className={css({
              fontSize: 'sm',
              lineHeight: 'normal',
              color: 'textMuted',
              maxWidth: '45ch',
            })}
          >
            <span className={css({ color: 'accentAlt', fontWeight: 'bold' })}>
              Guided by Voices
            </span>{' '}
            &amp;{' '}
            <span className={css({ color: 'accentAlt', fontWeight: 'bold' })}>
              My Morning Jacket
            </span>
            . Just get out and do it. You will be very, very glad that you did.
          </div>
        </div>
      </div>
    </footer>
  )
}
