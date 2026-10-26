import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const score = css({
  color: 'fieldInkMuted',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'bold',
})
// mockup .faint is brass-200 at 0.82 opacity; fieldInkMuted is brass-200 exactly
const faint = css({ color: 'fieldInkMuted', opacity: 0.82 })
const music = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontVariant: 'small-caps',
  fontSize: '17px',
  letterSpacing: 'wide',
})

const signals: { label: string; value: ReactNode }[] = [
  {
    label: 'Golf · Butterfield Bermuda',
    value: (
      <>
        Smotherman &amp; Power, <span className={score}>−16</span>
      </>
    ),
  },
  {
    label: 'Detroit',
    value: (
      <>
        Lions <span className={score}>20–17</span>. Pistons <span className={score}>106–93</span>.
      </>
    ),
  },
  { label: 'World Series', value: <span className={faint}>Brewers lead 2–0</span> },
  { label: 'Market', value: <span className={faint}>SPY 759.97, down 0.52%</span> },
  { label: 'In rotation', value: <span className={music}>The War on Drugs · Tobin Sprout</span> },
  { label: 'Moon', value: 'Full moon, 99%' },
  { label: 'Season', value: <span className={faint}>Halloween, 5 days</span> },
  { label: 'Place', value: 'Aldie, Virginia · Clear, 44°F' },
]

const footLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '1',
  color: 'fieldInk',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  _hover: { color: 'fieldInkMuted' },
})

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: 'clamp(28px, 4vw, 48px)',
        paddingBottom: 'clamp(36px, 5vw, 64px)',
        paddingInline: 'clamp(20px, 6vw, 96px)',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          textStyle: 'lg',
          letterSpacing: 'wider',
          color: 'fieldInk',
          marginBottom: '22px',
          paddingBottom: '3',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Colophon. The night of 26 October 2026
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          rowGap: '20px',
          columnGap: '40px',
        })}
      >
        {signals.map((s) => (
          <div key={s.label} className={css({ textStyle: 'sm', lineHeight: 'normal' })}>
            <span
              className={css({
                display: 'block',
                fontSize: '12px',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                marginBottom: '5px',
              })}
            >
              {s.label}
            </span>
            <span className={css({ color: 'fieldInk' })}>{s.value}</span>
          </div>
        ))}
      </div>
      <div
        className={css({
          marginTop: '28px',
          paddingTop: '20px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          display: 'flex',
          flexDirection: { base: 'column', lg: 'row' },
          justifyContent: { lg: 'space-between' },
          alignItems: { lg: 'flex-end' },
          gap: '18px',
        })}
      >
        <p
          className={css({
            maxWidth: '52ch',
            fontStyle: 'italic',
            textStyle: 'sm',
            lineHeight: 'loose',
            color: 'fieldInkMuted',
          })}
        >
          You can never cross the ocean until you have the courage to lose sight of the shore.
          <span
            className={css({
              display: 'block',
              fontStyle: 'normal',
              marginTop: '2',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: '13px',
              color: 'fieldInkMuted',
            })}
          >
            Christopher Columbus
          </span>
        </p>
        <div
          className={css({
            fontSize: '13px',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
            textAlign: { base: 'left', lg: 'right' },
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
          })}
        >
          <span>
            {identity.name}. {identity.role}
          </span>
          <span
            className={css({
              display: 'flex',
              gap: '4',
              flexWrap: 'wrap',
              justifyContent: { lg: 'flex-end' },
            })}
          >
            <a href="/about" className={footLink}>
              About
            </a>
            <a href={`mailto:${identity.email}`} className={footLink}>
              {identity.email}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
