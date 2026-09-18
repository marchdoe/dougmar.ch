import { css } from '../../../styled-system/css'

export function ContextBlock({ text }: { text: string }) {
  return (
    <section
      className={css({
        bg: 'surface',
        color: 'text',
        padding: { base: '5', md: '7' },
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      <p
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          fontSize: 'xs',
          color: 'textFaint',
          marginBottom: '3',
        })}
      >
        Context
      </p>
      <p
        className={css({ maxWidth: '68ch', fontSize: 'base', lineHeight: 'loose', color: 'text' })}
      >
        {text}
      </p>
    </section>
  )
}
