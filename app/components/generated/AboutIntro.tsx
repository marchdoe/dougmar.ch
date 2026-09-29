import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Ground } from '../Material'

export function AboutIntro() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingTop: '8',
        paddingBottom: '7',
        paddingInline: '6vw',
      })}
    >
      <Ground material="grain" seed={2093408939} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          maxWidth: '880px',
          marginInline: 'auto',
        })}
      >
        <div
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wide',
            color: 'textMuted',
            marginBottom: '4',
          })}
        >
          about
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontSize: 'md',
            lineHeight: 'normal',
            fontWeight: 'normal',
            maxWidth: '48ch',
            color: 'text',
          })}
        >
          {identity.statement}
        </h1>
      </div>
    </section>
  )
}
