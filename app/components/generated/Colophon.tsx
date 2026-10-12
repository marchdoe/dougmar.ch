import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { SigRow } from './SigRow'

type Part = [string, boolean]
const signals: { k: string; parts: Part[] }[] = [
  {
    k: 'Detroit Lions',
    parts: [
      ['45–21', true],
      [' win', false],
    ],
  },
  {
    k: 'Baycurrent Classic',
    parts: [
      ['Brennan ', false],
      ['−16', true],
      [' · Mitchell / Bridgeman ', false],
      ['−15', true],
    ],
  },
  { k: 'Today', parts: [['Columbus Day', false]] },
  { k: 'On rotation', parts: [['Radiohead · Wet Leg · Tobin Sprout', false]] },
  {
    k: 'Weather',
    parts: [
      ['Overcast ', false],
      ['68.8°F', true],
    ],
  },
  {
    k: 'Moon',
    parts: [
      ['Waxing crescent ', false],
      ['5.9%', true],
    ],
  },
  { k: 'SPY', parts: [['−0.06%', true]] },
  { k: 'Air quality', parts: [['Good', false]] },
]

const fig = css({ color: 'accent', fontWeight: 'bold' })
const footLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  marginBlock: '-14px',
  color: 'accent',
  fontWeight: 'bold',
  textDecorationLine: 'underline',
  textDecorationColor: 'accentAlt',
  textUnderlineOffset: '3px',
})

export function Colophon() {
  return (
    <footer
      className={css({
        borderTopWidth: '4px',
        borderTopStyle: 'solid',
        borderTopColor: 'accent',
        paddingTop: '28px',
        paddingBottom: '52px',
      })}
    >
      <p
        className={css({
          fontWeight: 'bold',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wider',
          fontSize: 'sm',
          color: 'textFaint',
          paddingBottom: '8px',
        })}
      >
        Colophon, Monday 12 October 2026, Aldie, Virginia
      </p>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          columnGap: { md: '48px' },
        })}
      >
        {signals.map((s) => (
          <SigRow key={s.k} k={s.k}>
            {s.parts.map(([t, f]) => (
              <span key={t} className={f ? fig : undefined}>
                {t}
              </span>
            ))}
          </SigRow>
        ))}
      </div>
      <div
        className={css({
          marginTop: '26px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          paddingTop: '16px',
          fontSize: 'xs',
          color: 'textFaint',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: '10px',
          columnGap: '4',
        })}
      >
        <span>
          {identity.name}, {identity.role}
        </span>
        <span className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '4' })}>
          <a href="/about" className={footLink}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={footLink}>
            {identity.email}
          </a>
        </span>
        <span>Spectral and Albert Sans, set to a 112° grass register</span>
      </div>
    </footer>
  )
}
