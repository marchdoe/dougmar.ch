import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Ground } from '../Material'

export function AboutStatement() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'surface',
        marginTop: 'calc(var(--tab) * -1)',
        paddingTop: { base: '112px', lg: '152px' },
        paddingBottom: 'clamp(48px,6vw,96px)',
        paddingInline: 'var(--pad)',
      })}
    >
      <Ground material="grain" seed={1533375130} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            textStyle: { base: '3xl', lg: 'hero' },
            color: 'fieldInk',
            textAlign: 'right',
          })}
        >
          {identity.name}
        </h1>
        <p
          className={css({
            marginTop: '5',
            marginLeft: 'auto',
            maxWidth: '46ch',
            textStyle: 'lede',
            color: 'surface',
          })}
        >
          {identity.statement}
        </p>
      </div>
    </section>
  )
}
