import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutHero() {
  const [lead, ...rest] = identity.statement.split('. ')
  const tail = rest.join('. ')
  return (
    <section
      className={css({
        position: 'relative',
        paddingInline: { base: '7vw', md: '6vw' },
        paddingTop: { base: '6', md: '7' },
        paddingBottom: '7',
      })}
    >
      <span
        className={css({
          display: 'block',
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '4',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        02 About
      </span>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(28px, 3.6vw, 48px)',
          lineHeight: '1.08',
          letterSpacing: '-0.01em',
          maxWidth: '24em',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span className={css({ color: 'accent' })}>
          {lead}
          {tail ? '.' : ''}
        </span>{' '}
        {tail}
      </h1>
    </section>
  )
}
