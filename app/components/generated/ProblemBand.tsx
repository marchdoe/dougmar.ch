import { css } from '../../../styled-system/css'

export function ProblemBand({ text }: { text: string }) {
  return (
    <div
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingBlock: 'clamp(28px, 4vw, 48px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      })}
    >
      <span
        className={css({
          textStyle: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'bold',
          color: 'fieldInkMuted',
        })}
      >
        Problem
      </span>
      <p
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: { base: 'base', md: 'md' },
          lineHeight: '1.45',
          color: 'fieldInk',
          maxWidth: '48ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}
