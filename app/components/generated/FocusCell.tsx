import { css } from '../../../styled-system/css'

export function FocusCell({ text }: { text: string }) {
  return (
    <div
      className={css({
        gridColumn: { base: '1 / -1', lg: 'span 1' },
        bg: 'field',
        paddingBlock: '18px',
        paddingInline: '3',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
        })}
      >
        Current focus
      </div>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'base',
          color: 'fieldInk',
          maxWidth: '46ch',
          marginTop: '2',
        })}
      >
        {text}
      </p>
    </div>
  )
}
