import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

// The statement carries a spaced em dash in its source; render it as a comma.
const statement = identity.statement.replaceAll(' \u2014 ', ', ').replaceAll('\u2014', ', ')

export function AboutIntro() {
  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '6' })}
    >
      <div
        className={css({
          fontFamily: 'body',
          textStyle: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        About
      </div>
      <h1
        className={css({
          fontFamily: 'body',
          textStyle: 'md',
          fontWeight: 'normal',
          color: 'text',
          maxWidth: '46ch',
        })}
      >
        {statement}
      </h1>
      <div
        aria-hidden="true"
        className={css({ width: 'min(72vw, 420px)', height: '2px', bg: 'accent' })}
      />
    </div>
  )
}
