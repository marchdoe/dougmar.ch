import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutStatement() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: { base: 'clamp(40px, 8vw, 88px)', lg: 'clamp(56px, 8vw, 112px)' },
        paddingBottom: '7',
        paddingInline: 'clamp(40px, 6vw, 112px)',
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textFaint',
          marginBottom: '4',
        })}
      >
        About · {identity.name}
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontSize: 'clamp(24px, 2.8vw, 40px)',
          lineHeight: 'snug',
          color: 'text',
          maxWidth: '28em',
          margin: '0',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
