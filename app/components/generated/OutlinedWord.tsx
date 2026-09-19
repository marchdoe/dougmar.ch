import type { CSSProperties } from 'react'
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

  // Size and stroke width are chosen from the word's length, so they are only
  // known at render time. Panda extracts styles at build time, so a value
  // interpolated into css() produces a class name with no rule behind it:
  // the word shipped transparent, unstroked, at the inherited 32px — an empty
  // band where the hero belongs. The two runtime values ride in as custom
  // properties that a static class reads, which is how the archive calendar
  // already passes a day's color.
  const vars = {
    '--outlined-size': fontSize,
    '--outlined-stroke': stroke,
    '--outlined-stroke-color': token('colors.accent'),
  } as CSSProperties

  const sharedCss = {
    fontFamily: 'display',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'transparent',
    fontSize: 'var(--outlined-size)',
    WebkitTextStroke: 'var(--outlined-stroke) var(--outlined-stroke-color)',
  } as const

  const letterCss = css({
    ...sharedCss,
    display: 'inline-block',
  })

  const blockCss = css({
    ...sharedCss,
    display: 'block',
    whiteSpace: 'nowrap',
  })

  return (
    <div
      style={vars}
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
