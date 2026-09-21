import { css } from '../../../styled-system/css'

export function FigureBlock() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: { base: 'center', lg: 'flex-end' },
        textAlign: { base: 'center', lg: 'right' },
        gap: '4',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: 'hero',
          lineHeight: 'tight',
          letterSpacing: 'tight',
          color: 'fieldInk',
        })}
      >
        −26
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            marginTop: '3',
          })}
        >
          Winning score, four rounds, Asheville, N.C.
        </span>
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: { base: 'xl', lg: '2xl' },
          lineHeight: 'snug',
          color: 'textMuted',
          maxWidth: '22ch',
        })}
      >
        Twenty-six under wins the Biltmore.
      </h1>
      <p
        className={css({
          fontFamily: 'body',
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontSize: { base: 'md', lg: 'lg' },
          lineHeight: 'normal',
          color: 'textFaint',
          maxWidth: '42ch',
        })}
      >
        Jacob Bridgeman, two clear of the field at Asheville. The golf story of the day, stated
        plainly.
      </p>
    </div>
  )
}
