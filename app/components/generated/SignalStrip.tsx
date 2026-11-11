import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const signals = [
  { label: 'Red Wings', value: '2–3', note: 'Loss' },
  { label: 'Markets · SPY', value: '749.92', note: '−0.37%' },
  { label: 'Aldie, VA', value: '51°F', note: 'Sunny, calm' },
  { label: 'Moon', value: 'Waxing crescent', note: '6.5% lit' },
  { label: 'Golf', value: 'Austin Championship', note: 'Scheduled' },
  { label: 'In rotation', value: 'My Morning Jacket · Radiohead', note: 'Tobin Sprout' },
]

const footLink = css({
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'fieldInkMuted',
})

export function SignalStrip() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'accent',
        paddingBlock: 'clamp(36px, 6vh, 72px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: '28px',
          columnGap: '40px',
        })}
      >
        {signals.map((s) => (
          <div
            key={s.label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              minWidth: '130px',
            })}
          >
            {/* mockup label ink #cf9a33 has no token; accent is the nearest brass */}
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'accent',
              })}
            >
              {s.label}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontSize: 'sm',
                color: 'fieldInk',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: '1.45',
              })}
            >
              {s.value}
              {' · '}
              <span className={css({ color: 'fieldInkMuted' })}>{s.note}</span>
            </span>
          </div>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '4',
          marginTop: 'clamp(32px, 5vh, 56px)',
          paddingTop: '5',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          fontFamily: 'body',
          fontSize: 'xs',
          color: 'fieldInkMuted',
        })}
      >
        <span>
          {identity.name} · {identity.role}
        </span>
        <nav
          aria-label="Footer"
          className={css({ display: 'flex', columnGap: '10px', flexWrap: 'wrap' })}
        >
          <a href="/#work" className={footLink}>
            Work
          </a>
          <a href="/about" className={footLink}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={footLink}>
            {identity.email}
          </a>
        </nav>
      </div>
    </footer>
  )
}
