import { css } from '../../../styled-system/css'

export function WorkMissing() {
  return (
    <section
      data-split=""
      className={css({
        gridArea: 'hero',
        minWidth: '0',
        bg: 'bg',
        paddingTop: { base: '48px', lg: '96px' },
        paddingBottom: { base: '48px', lg: '64px' },
        paddingInline: { base: '24px', lg: '6vw' },
        minHeight: { lg: '420px' },
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textStyle: '3xl',
          color: 'text',
        })}
      >
        Not found
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '5',
          textStyle: 'base',
          fontWeight: 'bold',
          color: 'text',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
          _hover: { textDecoration: 'none', borderBottomColor: 'text' },
        })}
      >
        Back to selected work
      </a>
    </section>
  )
}
