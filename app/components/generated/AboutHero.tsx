import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

// The statement's source text carries a long dash. It renders as a comma here.
const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')

export function AboutHero() {
  return (
    <section
      className={css({
        display: 'flex',
        justifyContent: 'flex-end',
        textAlign: 'right',
        paddingTop: { base: '32px', md: '48px' },
        paddingBottom: { base: '32px', md: '48px', lg: '56px' },
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: { base: 'clamp(28px,8.5vw,34px)', lg: 'clamp(34px,3.6vw,46px)' },
          lineHeight: '1.04',
          maxWidth: { lg: '30ch' },
          textTransform: 'lowercase',
          fontVariant: 'small-caps',
          letterSpacing: '0.02em',
          fontWeight: 'normal',
          color: 'accent',
        })}
      >
        {statement}
      </h1>
    </section>
  )
}
