import { css } from '../../../styled-system/css'

export function WorkMissing() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: { base: '64px', md: '80px' },
        paddingInline: { base: '4', md: '6vw' },
      })}
    >
      <h1
        className={css({
          textStyle: '3xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          marginBottom: '4',
        })}
      >
        Nothing filed under that name.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontWeight: 'bold',
          borderBottom: '2px solid',
          borderBottomColor: 'accent',
        })}
      >
        Back to the work →
      </a>
    </section>
  )
}
