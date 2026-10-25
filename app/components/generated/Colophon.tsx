import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { KeyValueGrid } from './KeyValueGrid'
import { SentenceNav } from './SentenceNav'

const signals = [
  { k: 'Moon', v: 'Full moon over Aldie. 43° and clear.' },
  { k: 'Red Wings', v: 'Red Wings fall, 1–4.' },
  { k: 'Markets', v: 'SPY 759.97, down 0.52%.' },
  { k: 'Golf', v: 'The long off-season.' },
  { k: 'On rotation', v: 'My Morning Jacket, The War on Drugs, Tobin Sprout.' },
  { k: 'Ahead', v: 'Halloween, 6 days.' },
]

export function Colophon() {
  return (
    <footer
      className={css({
        bg: 'surface',
        paddingTop: 'clamp(34px, 6vw, 56px)',
        paddingBottom: 'clamp(40px, 6vw, 64px)',
        paddingLeft: 'clamp(22px, 6vw, 112px)',
        paddingRight: 'clamp(22px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        aria-hidden="true"
        className={css({
          height: '1px',
          bg: 'borderStrong',
          marginBottom: 'clamp(26px, 4vw, 34px)',
        })}
      />
      <KeyValueGrid
        items={signals}
        className={css({ gridTemplateColumns: { md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' } })}
      />
      <SentenceNav
        className={css({ marginTop: 'clamp(28px, 4vw, 36px)', display: { lg: 'none' } })}
      />
      <p
        className={css({
          marginTop: 'clamp(26px, 4vw, 34px)',
          fontFamily: 'body',
          fontSize: '14px',
          letterSpacing: '0.02em',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
          maxWidth: '48ch',
        })}
      >
        {identity.name}, {identity.role}. Aldie, Virginia · Sunday, 25 October 2026.
      </p>
    </footer>
  )
}
