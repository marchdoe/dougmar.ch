import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { DriftGround } from './DriftGround'

export function AboutHead() {
  const nameLine = [identity.name, identity.role].filter(Boolean).join(', ')
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingTop: { base: '40px', lg: '80px' },
        paddingBottom: { base: '48px', lg: '96px' },
      })}
    >
      <DriftGround />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <div className={css({ marginBottom: '24px' })}>
          <span
            className={css({
              fontSize: '13px',
              fontVariant: 'small-caps',
              letterSpacing: 'wider',
              color: { base: 'accent', _light: 'text' },
              bg: 'bg',
            })}
          >
            About
          </span>
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'lg',
            color: 'text',
            maxWidth: '34ch',
            bg: 'bg',
            paddingBlock: '8px',
          })}
        >
          {identity.statement}
        </h1>
        <p
          className={css({
            marginTop: '20px',
            fontSize: '16px',
            color: 'textMuted',
            width: 'fit-content',
            maxWidth: '46ch',
            bg: 'bg',
          })}
        >
          {nameLine}
        </p>
      </div>
    </section>
  )
}
