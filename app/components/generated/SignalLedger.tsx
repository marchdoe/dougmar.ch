import { css } from '../../../styled-system/css'
import { LedgerCell } from './LedgerCell'
import { SectionHead } from './SectionHead'

const unit = css({ fontSize: '0.5em', color: 'textMuted' })
const rot = css({
  fontFamily: 'display',
  fontSize: { base: '24px', xl: '28px' },
  lineHeight: '1.15',
  color: 'text',
  display: 'block',
})

export function SignalLedger() {
  return (
    <section
      aria-labelledby="ledger-head"
      className={css({
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead id="ledger-head" title="The night, in figures" meta="Fri · Aldie, VA" />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: '1fr',
            md: 'repeat(auto-fit, minmax(240px, 1fr))',
            lg: 'repeat(4, 1fr)',
          },
          gridAutoFlow: { md: 'dense' },
          gap: { base: '1px', md: '14px' },
        })}
      >
        <LedgerCell
          tall
          gold
          label="Presidents Cup · in progress"
          sub="Leaders through the afternoon session, two teams separated by four."
        >
          +3 <span className={css({ color: 'fieldInkMuted' })}>/</span> +7
        </LedgerCell>
        <LedgerCell label="Full moon" sub="Waxing gibbous, near full over a clear sky.">
          99.7<span className={unit}>%</span>
        </LedgerCell>
        <LedgerCell label="Markets · SPY" sub="Closed up on the week.">
          <span className={css({ color: 'accent' })}>+0.54%</span>
        </LedgerCell>
        <LedgerCell label="Weather" sub="Clear, NW 9.8 mph">
          54<span className={unit}>°F</span>
        </LedgerCell>
        <LedgerCell label="Sun" sub="Sunrise to sunset, Aldie VA.">
          <span className={css({ fontSize: { base: '28px', lg: '32px' } })}>
            07:08 <span className={css({ color: 'textFaint' })}>·</span> 18:53
          </span>
        </LedgerCell>
        <LedgerCell tall label="In rotation" sub="Taste, not event.">
          <span className={css({ display: 'flex', flexDirection: 'column', gap: '2px' })}>
            <span className={rot}>My Morning Jacket</span>
            <span className={rot}>Radiohead</span>
          </span>
        </LedgerCell>
      </div>
    </section>
  )
}
