import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutStatement() {
  return (
    <section
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4',
        textAlign: 'center',
      })}
    >
      <div
        className={css({
          textStyle: 'xs',
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
        })}
      >
        About
      </div>
      {/* The statement is a paragraph, so it sits on a reading size rather than a display step. */}
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          fontSize: { base: '20px', lg: '28px' },
          lineHeight: 'snug',
          letterSpacing: 'normal',
          color: 'text',
          maxWidth: '36ch',
          textWrap: 'balance',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
