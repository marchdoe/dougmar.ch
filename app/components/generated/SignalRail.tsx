import { css } from '../../../styled-system/css'

const navSpine = [
  { label: 'work', href: '/#work', n: '01' },
  { label: 'about', href: '/about', n: '02' },
]

const spineLink = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'text',
  letterSpacing: 'wide',
  fontVariant: 'small-caps',
  textTransform: 'lowercase',
  padding: '3 0',
  minHeight: '44px',
  borderTop: '1px solid',
  borderColor: 'border',
})

const rowStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2 0',
  borderBottom: '1px solid',
  borderColor: 'border',
})

export function SignalRail({ email }: { email: string }) {
  return (
    <div className={css({ display: { base: 'none', lg: 'block' }, marginTop: { lg: '6' } })}>
      <nav
        aria-label="Site sections"
        className={css({ display: { base: 'none', lg: 'block' }, marginBottom: '6' })}
      >
        {navSpine.map((item) => (
          <a key={item.label} href={item.href} className={spineLink}>
            <span>{item.label}</span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'xs',
                color: 'textFaint',
              })}
            >
              {item.n}
            </span>
          </a>
        ))}
        <a href={`mailto:${email}`} className={spineLink}>
          <span>Contact</span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'xs',
              color: 'textFaint',
            })}
          >
            03
          </span>
        </a>
      </nav>

      <div className={css({ marginBottom: '6' })}>
        <p
          className={css({
            fontWeight: 'bold',
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'accentAlt',
            marginBottom: '2',
          })}
        >
          Detroit · This weekend
        </p>
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2 0',
            borderBottom: '1px solid',
            borderTop: '1px solid',
            borderColor: 'border',
          })}
        >
          <span className={css({ fontWeight: 'bold', fontSize: 'base', color: 'text' })}>
            Lions
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'accent',
            })}
          >
            31–30
          </span>
        </div>
        <div className={rowStyle}>
          <span className={css({ fontWeight: 'bold', fontSize: 'base', color: 'text' })}>
            Tigers
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'accent',
            })}
          >
            8–1
          </span>
        </div>
      </div>

      <div className={css({ marginBottom: '6' })}>
        <p
          className={css({
            fontWeight: 'bold',
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'accentAlt',
            marginBottom: '2',
          })}
        >
          Markets &amp; sky
        </p>
        <div className={rowStyle}>
          <span className={css({ fontSize: 'sm', color: 'textMuted' })}>SPY</span>
          <span className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'accent' })}>
            764.29 +0.85%
          </span>
        </div>
        <div className={rowStyle}>
          <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Aldie, VA</span>
          <span className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text' })}>
            Clear · 69.6°F
          </span>
        </div>
        <div className={rowStyle}>
          <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Moon</span>
          <span className={css({ fontSize: 'sm', fontWeight: 'normal', color: 'textFaint' })}>
            Waxing crescent 12%
          </span>
        </div>
        <div className={rowStyle}>
          <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Biltmore Championship</span>
          <span className={css({ fontSize: 'sm', fontWeight: 'normal', color: 'textFaint' })}>
            Scheduled
          </span>
        </div>
        <div className={rowStyle}>
          <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Air quality</span>
          <span className={css({ fontSize: 'sm', fontWeight: 'normal', color: 'textFaint' })}>
            Good
          </span>
        </div>
      </div>

      <p
        className={css({
          fontSize: 'sm',
          lineHeight: 'normal',
          color: 'textMuted',
          borderTop: '1px solid',
          borderColor: 'border',
          paddingTop: '4',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontWeight: 'bold',
            color: 'textFaint',
            fontSize: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            marginBottom: '1',
          })}
        >
          On rotation
        </span>
        Tobin Sprout · The War on Drugs · Wet Leg
      </p>
    </div>
  )
}
