import { css, cx } from '../../../styled-system/css'
import { label } from './styles'

const WORDS = ['Nobody', 'Guarded', 'Anybody,', '144-140.']
const LINES = WORDS.map((word, li) => ({
  word,
  score: li === 3,
  letters: Array.from(word).map((ch, i) => ({ id: `${word}-${i}`, ch })),
}))

const line = css({
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  width: '100%',
  whiteSpace: 'nowrap',
})
const scoreLine = css({
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  width: '100%',
  whiteSpace: 'nowrap',
  color: 'accent',
})
const letter = css({ display: 'inline-block', fontStyle: 'normal' })

export function HeroTile() {
  return (
    <div
      className={css({
        bg: 'bg',
        gridColumn: { base: '1 / -1', md: 'span 2' },
        gridRow: { md: 'span 2' },
        minHeight: '54vh',
        minWidth: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '22px',
        paddingTop: { base: '26px', md: '34px' },
        paddingBottom: { base: '34px', md: '40px' },
        paddingInline: { base: 'clamp(16px, 5vw, 64px)', md: '40px' },
      })}
    >
      <span
        className={cx(
          label,
          css({
            color: 'textMuted',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })
        )}
      >
        Box score · Nov 12 · Little Caesars Arena
      </span>
      <h1
        aria-label="Nobody guarded anybody, 144-140."
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontVariant: 'small-caps',
          textAlign: 'justify',
          fontSize: {
            base: 'clamp(34px, 11vw, 46px)',
            md: 'clamp(56px, calc(9.6vw - 20px), 150px)',
          },
          lineHeight: '1.02',
          letterSpacing: '0.005em',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {LINES.map((l) => (
          <span key={l.word} className={css({ display: 'block' })}>
            <span aria-hidden="true" className={l.score ? scoreLine : line}>
              {l.letters.map((x) => (
                <span key={x.id} className={letter}>
                  {x.ch}
                </span>
              ))}
            </span>{' '}
          </span>
        ))}
      </h1>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: { base: 'clamp(16px, 2.1vw, 20px)', xl: '20px' },
          lineHeight: '1.45',
          color: 'textMuted',
          maxWidth: '46ch',
          margin: '0',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        Both teams sailed past 140.{' '}
        {/* accentAlt measured 2.84:1 on the light bg; accent clears 4.5:1 in both schemes. */}
        <em className={css({ color: 'accent', fontStyle: 'italic' })}>
          Somebody should file a report for the defense.
        </em>{' '}
        The Pistons won a 284-point track meet and called it basketball.
      </p>
    </div>
  )
}
