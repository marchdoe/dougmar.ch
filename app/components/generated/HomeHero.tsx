import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        minHeight: { base: '48vh', md: '46vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: '7',
        paddingBottom: '5',
        paddingInline: '6vw',
        overflow: 'hidden',
        bg: 'bg',
      })}
    >
      <Ground material="grain" seed={2093408939} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontSize: { base: '3xl', lg: '5xl' },
            lineHeight: 'snug',
            letterSpacing: 'normal',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textTransform: 'lowercase',
            textAlign: 'center',
            maxWidth: 'min(12em, 90vw)',
            color: 'text',
          })}
        >
          What do we live for, if it is not to make life less difficult for each other?
        </h1>
        <p
          className={css({
            marginTop: '4',
            fontSize: { base: 'sm', md: 'base' },
            letterSpacing: 'wide',
            textTransform: 'lowercase',
            color: 'textMuted',
            textAlign: 'center',
          })}
        >
          George Eliot
        </p>
      </div>
    </section>
  )
}
