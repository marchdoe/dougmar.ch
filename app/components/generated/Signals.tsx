import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const mark = css({ color: 'accent', fontWeight: 'bold' })

const rows: { k: string; v: ReactNode }[] = [
  {
    k: 'Presidents Cup, in progress',
    v: (
      <>
        leaders <span className={mark}>−3</span>, <span className={mark}>−2</span>
      </>
    ),
  },
  { k: 'Full moon', v: '99.8% illuminated' },
  { k: 'S&P 500 (SPY)', v: '−0.08%' },
  { k: 'Weather · Aldie, VA', v: 'Overcast, 47°F' },
  { k: 'Detroit, off-season', v: 'Tigers & Pistons resting' },
]

export function Signals() {
  return (
    // The band renders at full opacity at rest: a scroll-linked fade left its small
    // type measured half-faded against the ground, so this band carries no reveal.
    <section
      aria-label="Today's signals"
      className={css({
        bg: 'surface',
        color: 'text',
        paddingTop: { base: '6', lg: '8' },
        paddingBottom: { base: '6', lg: '8' },
        paddingInline: { base: '4', lg: '7' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { base: '5', lg: '6' },
      })}
    >
      <h2
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: { base: 'base', lg: 'md' },
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          textAlign: 'center',
        })}
      >
        Signals, 25 Sep 2026
      </h2>
      <div
        className={css({
          width: '100%',
          maxWidth: '720px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })}
      >
        <div
          className={css({
            width: '100%',
            textAlign: 'center',
            paddingTop: { base: '4', lg: '5' },
            paddingBottom: { base: '4', lg: '5' },
            borderBottom: '1px solid',
            borderColor: 'fieldBorder',
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: { base: '52px', lg: '92px' },
              lineHeight: 'tight',
              letterSpacing: 'tight',
              color: 'accent',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            3–2
          </div>
          <div
            className={css({
              marginTop: '2',
              textStyle: 'xs',
              fontVariant: 'small-caps',
              letterSpacing: 'wider',
              color: 'textMuted',
            })}
          >
            Detroit Red Wings win, the bright note
          </div>
        </div>
        <div
          className={css({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          })}
        >
          {rows.map((row) => (
            <div
              key={row.k}
              className={css({
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                columnGap: '3',
                rowGap: '1',
                paddingBlock: '3',
                borderBottom: '1px solid',
                borderColor: 'fieldBorder',
              })}
            >
              <span
                className={css({
                  textStyle: 'xs',
                  fontVariant: 'small-caps',
                  letterSpacing: 'wider',
                  color: 'textMuted',
                })}
              >
                {row.k}
              </span>
              <span
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'normal',
                  textStyle: 'sm',
                  color: 'text',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {row.v}
              </span>
            </div>
          ))}
          <p
            className={css({
              paddingTop: '3',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              textStyle: 'lede',
              color: 'textMuted',
              textAlign: 'center',
              maxWidth: '46ch',
            })}
          >
            On the turntable: Tobin Sprout, Guided by Voices, Radiohead.
          </p>
        </div>
      </div>
    </section>
  )
}
