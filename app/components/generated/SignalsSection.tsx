import { css } from '../../../styled-system/css'
import { SectionHeading } from './SectionHeading'
import { SigItem } from './SigItem'

const num = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontVariantNumeric: 'tabular-nums',
  fontSize: '17px',
})

export function SignalsSection() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        marginTop: '64px',
        marginBottom: '48px',
        paddingTop: '48px',
        paddingBottom: '52px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="around the edges" title="the rest of the day" />
      <div
        className={css({
          maxWidth: '1040px',
          marginInline: 'auto',
          marginTop: '28px',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(auto-fit, minmax(230px, 1fr))' },
          rowGap: '4px',
          columnGap: { base: '4px', md: '24px' },
          justifyItems: 'center',
        })}
      >
        <SigItem label="market">
          <b className={num}>SPY 769.64</b>{' '}
          <span className={css({ color: 'fieldBorder', fontWeight: '500' })}>▲ 0.74%</span>
        </SigItem>
        <SigItem label="red wings">
          Red Wings <b className={num}>0</b> · Panthers <b className={num}>2</b>
        </SigItem>
        <SigItem label="weather">
          Aldie, Virginia, patchy rain, <b className={num}>59°F</b>
        </SigItem>
        <SigItem label="sky">last quarter moon · air quality good</SigItem>
      </div>
    </section>
  )
}
