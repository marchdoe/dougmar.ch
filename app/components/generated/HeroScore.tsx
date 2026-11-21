import { css } from '../../../styled-system/css'
import { Leaderboard } from './Leaderboard'
import { TopLockup } from './TopLockup'

const words = ['Three ', 'tied ', 'at ', 'nine ']

export function HeroScore() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bgAlt',
        color: 'text',
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1.15fr 0.85fr' },
        gridTemplateRows: { lg: 'auto 1fr' },
        columnGap: { lg: '4vw' },
        rowGap: { base: '28px', lg: '24px' },
        paddingTop: { base: '28px', lg: '40px' },
        paddingInline: '6vw',
        paddingBottom: { base: '40px', lg: '56px' },
        minHeight: { base: '94vh', lg: '92vh' },
      })}
    >
      <TopLockup />
      <div
        className={css({
          gridColumn: { lg: '1' },
          gridRow: { lg: '1 / span 2' },
          display: { lg: 'flex' },
          flexDirection: { lg: 'column' },
          justifyContent: { lg: 'space-between' },
          gap: { lg: '32px' },
        })}
      >
        <h1
          className={css({
            display: 'flex',
            flexWrap: { base: 'wrap', lg: 'nowrap' },
            alignItems: 'flex-start',
            justifyContent: { lg: 'flex-end' },
            gap: 'clamp(10px, 2vw, 28px)',
            fontWeight: 'normal',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          <span
            aria-hidden="true"
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: 'clamp(88px, 14vw, 160px)',
              lineHeight: '0.82',
              color: 'accent',
              letterSpacing: '-0.01em',
            })}
          >
            {'\u22129'}
          </span>
          <span
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontVariant: 'small-caps',
              letterSpacing: '.04em',
              fontSize: 'clamp(30px, 4.4vw, 48px)',
              lineHeight: '0.98',
              color: 'text',
              marginTop: '6px',
              order: { lg: '-1' },
            })}
          >
            {words.map((w) => (
              <span key={w} className={css({ display: 'block' })}>
                {w}
              </span>
            ))}
            <span className={css({ display: 'block', color: 'accentAlt' })}>under.</span>
          </span>
        </h1>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: { base: '28px', lg: '4px' },
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          <span
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: '.14em',
              color: 'textMuted',
            })}
          >
            RSM Classic · Sea Island, GA · Round 4, live
          </span>
          <span className={css({ color: 'textMuted', textStyle: 'sm', letterSpacing: '.02em' })}>
            <strong className={css({ color: 'text', fontWeight: 'bold' })}>Aldie, VA</strong>,
            overcast, 47°F · Sat, Nov 21 2026
          </span>
        </div>
      </div>
      <Leaderboard />
    </section>
  )
}
