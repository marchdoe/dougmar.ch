import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutStatement() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '24px', sm: '6vw' },
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          left: '-10%',
          right: '-10%',
          top: '28%',
          height: '44%',
          bg: 'field',
          transform: { sm: 'rotate(-4deg)' },
          zIndex: -1,
        })}
      />
      <div className={css({ position: 'relative', zIndex: 1, maxWidth: '46ch' })}>
        <div
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'text',
            fontWeight: 'bold',
            marginBottom: '3',
          })}
        >
          about doug
        </div>
        <h1
          className={css({
            textStyle: 'lede',
            fontFamily: 'display',
            fontWeight: 'normal',
            color: 'fieldInk',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
    </section>
  )
}
