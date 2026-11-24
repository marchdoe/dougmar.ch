import { css } from '../../../styled-system/css'

export function MissingProject() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        paddingBlock: 'clamp(48px, 8vw, 96px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: { base: '2xl', lg: '4xl' },
          lineHeight: '1',
          color: 'text',
        })}
      >
        No project at this address.
      </h1>
      <a
        href="/work"
        className={css({
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: 'sm',
          color: 'accent',
        })}
      >
        See the work →
      </a>
    </section>
  )
}
