import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutIntro() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: { base: '14px', lg: '52px' },
        paddingBottom: { base: '44px', lg: '56px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
      })}
    >
      <h1
        className={css({
          maxWidth: '40ch',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontSize: { base: '22px', lg: '34px' },
          lineHeight: 'snug',
          color: 'text',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
