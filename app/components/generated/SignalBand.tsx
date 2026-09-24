import { css } from '../../../styled-system/css'

const signals = [
  { label: 'Tigers', value: '2–4', note: 'Loss.' },
  { label: 'Presidents Cup', value: 'Scheduled', note: 'No leaders yet.' },
  { label: 'SPY', value: '767.81', note: 'Down 0.72% on the day.' },
  { label: 'Weather', value: '51°F', note: 'Overcast, wind N 9 mph.' },
  { label: 'Moon', value: '97.6%', note: 'Full, illuminated.' },
  { label: 'Sun', value: '07:06 · 18:57', note: 'Sunrise, sunset.' },
]

export function SignalBand() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: { base: '72px', xl: '88px' },
        paddingInline: '6vw',
        minHeight: '44vh',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          rowGap: '8px',
          columnGap: '16px',
          paddingBottom: '14px',
          marginBottom: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 500,
            fontSize: 'lg',
            letterSpacing: 'tight',
            color: 'fieldInk',
          })}
        >
          Today, for the record
        </h2>
        <span
          className={css({
            fontFamily: 'body',
            fontSize: 'xs',
            fontWeight: 600,
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
          })}
        >
          Aldie, Virginia · 24 Sept 2026
        </span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          columnGap: '4vw',
        })}
      >
        {signals.map((signal) => (
          <div
            key={signal.label}
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'baseline',
              rowGap: '4px',
              columnGap: '14px',
              paddingBlock: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                gridColumn: '1',
                fontFamily: 'body',
                fontSize: 'xs',
                fontWeight: 600,
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wide',
                color: 'fieldInkMuted',
              })}
            >
              {signal.label}
            </span>
            <span
              className={css({
                gridColumn: '2',
                gridRow: '1',
                fontFamily: 'display',
                fontSize: 'md',
                fontVariantNumeric: 'tabular-nums',
                color: 'fieldInk',
                textAlign: 'right',
              })}
            >
              {signal.value}
            </span>
            <span
              className={css({
                gridColumn: '1 / -1',
                fontFamily: 'body',
                fontSize: 'xs',
                color: 'fieldInkMuted',
              })}
            >
              {signal.note}
            </span>
          </div>
        ))}
      </div>
      <p
        className={css({
          marginTop: '36px',
          paddingTop: '20px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontSize: 'base',
          color: 'fieldInkMuted',
        })}
      >
        On now:{' '}
        <b className={css({ fontWeight: 500, fontStyle: 'normal', color: 'fieldInk' })}>
          The War on Drugs
        </b>{' '}
        and{' '}
        <b className={css({ fontWeight: 500, fontStyle: 'normal', color: 'fieldInk' })}>
          Radiohead
        </b>
        .
      </p>
    </section>
  )
}
