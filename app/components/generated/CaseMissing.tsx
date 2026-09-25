import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        maxWidth: '760px',
        marginInline: 'auto',
        paddingInline: { base: '4', lg: '7' },
        paddingBlock: { base: '7', lg: '8' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4',
        textAlign: 'center',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          textStyle: '3xl',
          lineHeight: 'tight',
          color: 'text',
        })}
      >
        Nothing filed under that name.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-block',
          paddingBlock: '3',
          color: 'accent',
          borderBottom: '1px solid',
          borderColor: 'accent',
          lineHeight: '1',
        })}
      >
        Back to the work
      </a>
    </section>
  )
}
