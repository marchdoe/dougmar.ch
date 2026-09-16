import { css } from '../../../styled-system/css'

export function SubheadDivider({ label }: { label: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        gap: '3',
        px: { base: '4', md: '6', lg: '96px' },
        pt: { base: '9', md: '12' },
        pb: { base: '3', md: '4' },
      })}
    >
      <span className={css({ fontFamily: 'display', textStyle: 'lg', color: 'fieldBorder' })}>
        &#10022;
      </span>
      <h3
        className={css({
          textStyle: 'md',
          color: 'textMuted',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          textTransform: 'lowercase',
        })}
      >
        {label}
      </h3>
    </div>
  )
}
