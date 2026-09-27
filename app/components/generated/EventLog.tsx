import { css } from '../../../styled-system/css'
import { SectionHead } from './SectionHead'
import { LogRow } from './LogRow'

const BEFORE = [
  { label: 'Tigers', value: '4–3 W', event: true },
  { label: 'Red Wings', value: '2–4 L', event: false },
  { label: 'Presidents Cup', value: 'In progress', event: false },
  { label: 'SPY', value: '771.35 ▲ +0.54%', event: true },
]

const AFTER = [
  { label: 'Aldie', value: '60°F · Cloudy', event: false },
  { label: 'Air quality', value: 'Good', event: false },
  { label: "Nor'easter", value: 'NJ floods', event: false },
]

export function EventLog() {
  return (
    <section
      aria-labelledby="el-h"
      className={css({
        paddingBlock: { base: '5', lg: '7' },
        paddingInline: { base: '3', lg: '4vw' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead id="el-h" label="The Day's Log" aside="27·09·2026" />
      <ul
        className={css({
          listStyle: 'none',
          marginTop: '3',
          marginBottom: '0',
          padding: '0',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {BEFORE.map((row) => (
          <LogRow key={row.label} label={row.label} value={row.value} event={row.event} />
        ))}
        <li
          className={css({
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            alignItems: 'baseline',
            columnGap: '12px',
            paddingBlock: '22px',
            paddingInline: '6px',
            marginBlock: '6px',
            fontFamily: 'display',
            borderStyle: 'solid',
            borderColor: 'borderStrong',
            borderTopWidth: '1px',
            borderBottomWidth: '1px',
            borderLeftWidth: '0',
            borderRightWidth: '0',
          })}
        >
          <span
            aria-hidden="true"
            className={css({ color: 'accent', fontSize: '20px', alignSelf: 'center' })}
          >
            ▸
          </span>
          <span className={css({ display: 'flex', flexDirection: 'column' })}>
            <span
              className={css({
                color: 'textMuted',
                fontSize: 'sm',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
              })}
            >
              Full moon over Aldie
            </span>
            <span
              className={css({
                color: 'accent',
                fontSize: 'clamp(28px, 7vw, 44px)',
                fontWeight: 'bold',
                lineHeight: '1',
                marginTop: '1',
              })}
            >
              97%
            </span>
          </span>
        </li>
        {AFTER.map((row) => (
          <LogRow key={row.label} label={row.label} value={row.value} event={row.event} />
        ))}
      </ul>
    </section>
  )
}
