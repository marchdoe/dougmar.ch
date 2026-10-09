import { css } from '../../../styled-system/css'

export function SigRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '1',
        columnGap: '16px',
        alignItems: 'baseline',
        paddingBlock: '13px',
        borderTop: '1px solid',
        borderColor: 'border',
        fontSize: 'sm',
        letterSpacing: 'normal',
      })}
    >
      <span
        className={css({
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textFaint',
          minWidth: '9ch',
        })}
      >
        {label}
      </span>
      <span className={css({ color: 'textMuted' })}>{value}</span>
    </div>
  )
}
