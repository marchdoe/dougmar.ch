import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const strong = css({ color: 'text', fontWeight: 'normal' })
// amberLight (#F0AD45) has no semantic token; nearest semantic highlight ink is accentAlt.
const amb = css({ color: 'accentAlt', fontVariantNumeric: 'tabular-nums' })

const cells: { lab: string; val: ReactNode }[] = [
  {
    lab: 'Weather',
    val: (
      <>
        <strong className={strong}>48.8°F</strong>, fog
        <br />
        Aldie, VA
      </>
    ),
  },
  {
    lab: 'Pistons',
    val: (
      <>
        <strong className={strong}>Win</strong> <span className={amb}>97–89 ↑</span>
      </>
    ),
  },
  {
    lab: 'World Series',
    val: (
      <>
        Rays force Game 5, <strong className={strong}>4–3</strong>
      </>
    ),
  },
  {
    lab: 'Markets',
    val: (
      <>
        SPY <span className={amb}>+0.34%</span>
      </>
    ),
  },
  {
    lab: 'Golf',
    val: (
      <>
        VidantaWorld Mexico Open <strong className={strong}>(scheduled)</strong>
      </>
    ),
  },
  {
    lab: 'Moon',
    val: (
      <>
        Waning gibbous, <strong className={strong}>82%</strong>
      </>
    ),
  },
  { lab: 'In rotation', val: 'My Morning Jacket · Guided by Voices · Tobin Sprout' },
  {
    lab: 'Up next',
    val: (
      <>
        Halloween, <strong className={strong}>2 days out</strong>
      </>
    ),
  },
]

const label = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
})

export function Colophon() {
  const who = [identity.name, identity.role].filter(Boolean).join(', ')
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '6',
        paddingBottom: '7',
        paddingInline: { base: '7vw', md: '6vw' },
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
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '4',
          paddingBottom: '18px',
          marginBottom: '28px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        <span className={label}>Colophon, October 29, 2026</span>
        <span className={label}>Aldie, Virginia</span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          rowGap: '5',
          columnGap: '6',
        })}
      >
        {cells.map((cell) => (
          <div key={cell.lab}>
            <div
              className={css({
                fontSize: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textMuted',
                marginBottom: '6px',
              })}
            >
              {cell.lab}
            </div>
            <div className={css({ fontSize: '15px', lineHeight: '1.45', color: 'textMuted' })}>
              {cell.val}
            </div>
          </div>
        ))}
      </div>
      <div
        className={css({
          marginTop: '36px',
          paddingTop: '28px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
        })}
      >
        <blockquote
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: 'clamp(17px, 2vw, 22px)',
            lineHeight: '1.4',
            color: 'text',
            maxWidth: '46ch',
            margin: '0',
          })}
        >
          “I’m a great believer in luck, and I find the harder I work, the more I have of it.”
        </blockquote>
        <cite
          className={css({
            fontStyle: 'normal',
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          Thomas Jefferson, the day’s note
        </cite>
        <p
          className={css({
            marginTop: '4',
            fontSize: 'sm',
            color: 'textMuted',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: '2',
          })}
        >
          <span>{who}.</span>
          <a
            href={`mailto:${identity.email}`}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              minWidth: '44px',
              color: 'text',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              _hover: { color: 'text' },
            })}
          >
            {identity.email}
          </a>
        </p>
      </div>
    </footer>
  )
}
