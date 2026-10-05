import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const SIGNALS: { label: string; value: string; up?: string }[] = [
  { label: 'Golf · his game', value: 'Bank of Utah Championship · Final · Smotherman −26' },
  { label: 'Detroit Lions', value: 'Lions 26, 32 · loss' },
  { label: 'Red Wings', value: 'Red Wings 2–3 · loss' },
  { label: 'Market', value: 'SPY 769.64', up: '+0.74% ▲' },
  { label: 'Weather · Aldie', value: 'mist · 54°F' },
  { label: 'Moon', value: 'waning crescent · 27%' },
]

const footLink = css({
  color: 'text',
  display: 'inline-block',
  minHeight: '44px',
  minWidth: '44px',
  textAlign: 'center',
  paddingBlock: '10px',
  paddingInline: '2px',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textUnderlineOffset: '4px',
})

export function Sidebar() {
  return (
    <footer className={css({ bg: 'bg' })}>
      <div className={css({ height: '3px', bg: 'field' })} />
      <div
        className={css({
          paddingBlock: 'clamp(28px, 5vw, 56px)',
          paddingInline: 'clamp(20px, 6vw, 80px)',
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '28px',
          })}
        >
          <BrandLockup variant="stacked-md" mode="original" />
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'text',
              letterSpacing: '-0.015em',
            })}
          >
            The ledger, today
          </span>
        </div>
        <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
          {SIGNALS.map((s) => (
            <li
              key={s.label}
              className={css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', md: '200px 1fr' },
                alignItems: { md: 'baseline' },
                rowGap: '2px',
                columnGap: '16px',
                paddingBlock: '12px',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'border',
              })}
            >
              <span
                className={css({
                  fontSize: 'xs',
                  letterSpacing: 'widest',
                  textTransform: 'uppercase',
                  color: 'textMuted',
                })}
              >
                {s.label}
              </span>
              <span
                className={css({
                  fontSize: 'sm',
                  color: 'text',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.02em',
                })}
              >
                {s.value}
                {s.up ? (
                  <span className={css({ color: 'accentAlt' })}>
                    {' · '}
                    {s.up}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
        <div
          className={css({
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          })}
        >
          <p
            className={css({
              margin: '0',
              fontSize: 'sm',
              color: 'textMuted',
              letterSpacing: '0.02em',
              maxWidth: '50ch',
            })}
          >
            On rotation: <b className={css({ color: 'text' })}>The War on Drugs</b> ·{' '}
            <b className={css({ color: 'text' })}>Guided by Voices</b> ·{' '}
            <b className={css({ color: 'text' })}>Radiohead</b>
          </p>
          <span
            className={css({
              fontSize: 'xs',
              color: 'textMuted',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
            })}
          >
            Upcoming · Columbus Day · Oct 12
          </span>
          <p
            className={css({
              margin: '0',
              marginTop: '12px',
              fontSize: 'sm',
              color: 'textMuted',
              maxWidth: '50ch',
            })}
          >
            {identity.name}, {identity.role}. Read{' '}
            <a href="/about" className={footLink}>
              About
            </a>{' '}
            the maker, or write to{' '}
            <a href={`mailto:${identity.email}`} className={footLink}>
              {identity.email}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
