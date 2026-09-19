import { css } from '../../../styled-system/css'
import { token } from '../../../styled-system/tokens'

// The mockup's marquee word runs far past the `hero` ramp step (a 3-letter
// word reaches ~388px cap height at 1440). That is a genuine departure from
// the ramp, so fontSize is set directly here per a length-tiered fluid
// clamp instead of a textStyle token, tuned to fill the hero band edge to
// edge without overflowing the 360px column.
function sizeForLength(len: number) {
  if (len <= 4) return { fontSize: 'clamp(5rem, 38vw, 34rem)', stroke: '7px' }
  if (len <= 8) return { fontSize: 'clamp(3.5rem, 16vw, 18rem)', stroke: '5px' }
  if (len <= 14) return { fontSize: 'clamp(3rem, 10vw, 12rem)', stroke: '4px' }
  return { fontSize: 'clamp(2.5rem, 7vw, 9rem)', stroke: '3px' }
}

export function OutlinedWord({ word }: { word: string }) {
  const clean = word.replace(/\s/g, '')
  const spread = clean.length <= 4
  const { fontSize, stroke } = sizeForLength(clean.length || 1)
  const strokeColor = token('colors.accent')

  const sharedCss = {
    fontFamily: 'display',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'transparent',
  } as const

  const letterCss = css({
    ...sharedCss,
    display: 'inline-block',
    fontSize,
    WebkitTextStroke: `${stroke} ${strokeColor}`,
  })

  const blockCss = css({
    ...sharedCss,
    display: 'block',
    fontSize,
    whiteSpace: 'nowrap',
    WebkitTextStroke: `${stroke} ${strokeColor}`,
  })

  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: spread ? 'space-between' : 'flex-start',
        width: '100%',
        overflow: 'hidden',
      })}
    >
      {spread ? (
        word.split('').map((letter, i) => (
          <span key={i} className={letterCss}>
            {letter}
          </span>
        ))
      ) : (
        <span className={blockCss}>{word}</span>
      )}
    </div>
  )
}
