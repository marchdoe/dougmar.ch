import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        paddingTop: '7',
        paddingBottom: '9',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '5',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: '3xl',
          textTransform: 'uppercase',
          color: 'text',
        })}
      >
        No project by that name
      </h1>
      <a
        href="/"
        className={css({
          fontWeight: 'bold',
          textStyle: 'sm',
          color: 'text',
          borderBottom: '2px solid',
          borderBottomColor: 'text',
        })}
      >
        Back to the work
      </a>
    </section>
  )
}
