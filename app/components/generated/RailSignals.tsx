import { css } from '../../../styled-system/css'
import { BlockLabel } from './BlockLabel'
import { FactRows } from './FactRows'

const today = [
  { k: 'Aldie', v: 'Sunny · 40°F' },
  { k: 'SPY', v: '754.37 · −0.36%' },
  { k: 'Moon', v: 'First quarter' },
]

const block = css({ display: 'flex', flexDirection: 'column' })

export function RailSignals() {
  return (
    <>
      <section className={block}>
        <BlockLabel>Austin Championship</BlockLabel>
        <div
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '12px',
          })}
        >
          <span className={css({ textStyle: 'sm', fontWeight: 'normal', color: 'fieldInk' })}>
            Trace Crowe
          </span>
          {/* accent on the light bronze field; fieldInk in the dark scheme where accent sinks into the gold field */}
          <span
            className={css({
              fontSize: 'xl',
              lineHeight: '1',
              fontWeight: 'bold',
              fontVariantNumeric: 'tabular-nums',
              color: { base: 'fieldInk', _light: 'accent' },
            })}
          >
            −14
          </span>
        </div>
        {/* fieldInk in the dark scheme, where fieldInkMuted misses 4.5:1 on the gold field */}
        <div
          className={css({
            marginTop: '10px',
            textStyle: 'sm',
            color: { base: 'fieldInk', _light: 'fieldInkMuted' },
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          Three tied −13
        </div>
      </section>
      <section className={block}>
        <BlockLabel>Today</BlockLabel>
        <FactRows rows={today} />
      </section>
      <section className={block}>
        <BlockLabel>In rotation</BlockLabel>
        <div
          className={css({
            textStyle: 'sm',
            lineHeight: 'normal',
            color: { base: 'fieldInk', _light: 'fieldInkMuted' },
          })}
        >
          <strong className={css({ color: 'fieldInk' })}>The War on Drugs</strong>, Tobin Sprout.
        </div>
      </section>
    </>
  )
}
