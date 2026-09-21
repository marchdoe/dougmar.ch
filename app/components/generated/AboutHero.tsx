import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutHero() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'field',
        paddingTop: { base: '10', lg: '12' },
        paddingInline: { base: '6vw', lg: '5vw' },
        paddingBottom: '9',
      })}
    >
      <span
        className={css({
          display: 'block',
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginBottom: '4',
        })}
      >
        {identity.name}, {identity.role}
      </span>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          fontSize: { base: 'md', lg: 'lg' },
          lineHeight: 'loose',
          color: 'fieldInk',
          maxWidth: '48ch',
          overflowWrap: 'break-word',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
