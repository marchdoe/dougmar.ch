import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const score = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.01em',
})

function Entry({ n, quote, children }: { n: string; quote?: boolean; children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '28px 1fr',
        gap: '12px',
        paddingBlock: '12px',
        alignItems: 'baseline',
        // mockup rgba(46,29,0,0.28) hairline mapped to fieldBorder
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '13px',
          letterSpacing: '0.05em',
          color: 'fieldInk',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {n}
      </span>
      <span
        className={css({
          fontFamily: 'body',
          fontWeight: quote ? 'bold' : 'medium',
          fontSize: quote ? '15px' : '14px',
          letterSpacing: quote ? 'normal' : '0.04em',
          textTransform: quote ? 'none' : 'uppercase',
          color: 'fieldInk',
          lineHeight: '1.4',
        })}
      >
        {children}
      </span>
    </div>
  )
}

export function ColophonSignals() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' },
        columnGap: { md: '40px', lg: '48px' },
      })}
    >
      <Entry n="01">
        NHL · Red Wings <span className={score}>4–1</span>
      </Entry>
      <Entry n="02">
        VidantaWorld Mexico Open · Karl Vilips <span className={score}>−9</span>, in progress
      </Entry>
      <Entry n="03">Oct 31 · Halloween</Entry>
      <Entry n="04">
        SPY 769.36 <span className={score}>−0.38%</span>
      </Entry>
      <Entry n="05">Aldie, VA · Clear 54°F</Entry>
      <Entry n="06">
        Waning Gibbous <span className={score}>74%</span>
      </Entry>
      <Entry n="07">On rotation: Wet Leg · Guided by Voices · Tobin Sprout</Entry>
      <Entry n="08" quote>
        “A needle is not sharp at both ends.”{' '}
        <cite
          className={css({
            fontStyle: 'normal',
            color: 'fieldInk',
            fontWeight: 'bold',
            fontSize: '2xs',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          })}
        >
          Chinese Proverb
        </cite>
      </Entry>
      <Entry n="09">
        {identity.name} · {identity.role} · Aldie, Virginia
      </Entry>
    </div>
  )
}
