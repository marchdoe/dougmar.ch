import { css } from '../../../styled-system/css'

export function AboutStatement({ statement }: { statement: string }) {
  return (
    <section
      className={css({
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
      })}
    >
      <span
        className={css({
          display: 'block',
          textStyle: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          marginBottom: '5',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        About
      </span>
      <h1
        className={css({
          fontFamily: 'body',
          fontWeight: 'normal',
          textStyle: 'lede',
          color: 'text',
          maxWidth: '66ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {statement}
      </h1>
    </section>
  )
}
