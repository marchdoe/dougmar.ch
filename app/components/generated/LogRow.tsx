import { css } from '../../../styled-system/css'

export function LogRow({ label, value, event }: { label: string; value: string; event: boolean }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
        alignItems: 'baseline',
        columnGap: '12px',
        paddingBlock: '13px',
        paddingInline: '6px',
        fontFamily: 'display',
        fontSize: 'sm',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span aria-hidden="true" className={css({ color: event ? 'accent' : 'textFaint' })}>
        {event ? '▸' : '·'}
      </span>
      <span
        className={css({
          color: event ? 'text' : 'textMuted',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
        })}
      >
        {label}
      </span>
      <span
        className={css({
          color: event ? 'accent' : 'textMuted',
          justifySelf: 'end',
          textAlign: 'right',
        })}
      >
        {value}
      </span>
    </li>
  )
}
