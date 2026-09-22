import { css } from '../../../styled-system/css'

export function AboutHero({ role, statement }: { role: string; statement: string }) {
  return (
    <section
      className={css({
        bg: 'bg',
        minHeight: '36vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingInline: '6vw',
        paddingBlock: '9',
        textAlign: 'right',
      })}
    >
      <span
        className={css({
          display: 'block',
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '3',
          animationName: 'settle',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '80ms',
        })}
      >
        {role}
      </span>
      <h1
        className={css({
          fontFamily: 'body',
          fontWeight: 'normal',
          textStyle: 'lg',
          color: 'text',
          maxWidth: '48ch',
          textAlign: 'right',
          fontSize: 'lg',
          animationName: 'settle',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '0ms',
        })}
      >
        {statement}
      </h1>
    </section>
  )
}
