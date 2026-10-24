import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { plainDash } from './projectFields'

export function AboutHero() {
  return (
    <section
      className={css({
        paddingTop: '6',
        paddingBottom: '8',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '5',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: '22px', lg: '30px' },
          lineHeight: '1.25',
          textAlign: 'center',
          width: '100%',
          maxWidth: '44ch',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {plainDash(identity.statement)}
      </h1>
      <p
        className={css({
          textStyle: 'lede',
          color: 'textMuted',
          maxWidth: '44ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {identity.role}
      </p>
    </section>
  )
}
